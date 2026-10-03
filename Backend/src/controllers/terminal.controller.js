import Terminal from "../models/Terminal.model.js";
import { getCoordinates } from "../utils/geo.utils.js";
import axios from "axios"; // Make sure this is imported!

// Helper: straight-line distance fallback (in km)
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const searchTerminals = async (req, res) => {
  try {
    let {
      latitude,
      longitude,
      from,
      destination,
      maxDistance = 5000,
    } = req.body;

    let resolvedLat = latitude ? parseFloat(latitude) : null;
    let resolvedLng = longitude ? parseFloat(longitude) : null;
    let resolvedFromName = "Current Location";

    // Priority 1: coordinates provided → use them
    if (resolvedLat && resolvedLng) {
      // Good to go
    }
    // Priority 2: no coordinates but from text provided → geocode it
    else if (from?.trim()) {
      const coords = await getCoordinates(from.trim());
      if (coords) {
        resolvedLat = coords.lat;
        resolvedLng = coords.lng;
        resolvedFromName = coords.displayName || from.trim();
      } else {
        return res.status(404).json({
          message: `Could not resolve location: "${from}"`,
          suggestion: "Try a more specific name like 'Merkato' or 'Bole'",
        });
      }
    }
    // Priority 3: nothing useful → error
    else {
      return res.status(400).json({
        message:
          "Location required: provide coordinates or a starting place name",
      });
    }

    // Basic coordinate validation
    if (
      isNaN(resolvedLat) ||
      isNaN(resolvedLng) ||
      resolvedLat < -90 ||
      resolvedLat > 90 ||
      resolvedLng < -180 ||
      resolvedLng > 180
    ) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    // Build MongoDB query for nearby terminals
    const query = {
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [resolvedLng, resolvedLat] },
          $maxDistance: Number(maxDistance),
        },
      },
    };

    if (destination?.trim()) {
      query.routes = { $regex: destination.trim(), $options: "i" }; // fuzzy match
    }

    const terminals = await Terminal.find(query);

    // Enrich each terminal with real road distance & time via OSRM
    const enriched = await Promise.all(
      terminals.map(async (t) => {
        const coords = t.location.coordinates; // [lng, lat]

        let routeInfo = { distanceKm: null, durationMin: null };

        try {
          // OSRM public demo server (driving mode)
          const url = `http://router.project-osrm.org/route/v1/driving/${resolvedLng},${resolvedLat};${coords[0]},${coords[1]}?overview=false`;
          const res = await axios.get(url, { timeout: 6000 });

          if (res.data.routes?.length > 0) {
            const r = res.data.routes[0];
            routeInfo = {
              distanceKm: (r.distance / 1000).toFixed(1), // meters → km
              durationMin: Math.round(r.duration / 60), // seconds → minutes
            };
          }
        } catch (err) {
          console.warn(`OSRM failed for terminal "${t.name}": ${err.message}`);
        }

        // Fallback if OSRM failed: straight-line distance + estimated time
        if (!routeInfo.distanceKm) {
          const dist = haversineKm(
            resolvedLat,
            resolvedLng,
            coords[1],
            coords[0],
          );
          routeInfo = {
            distanceKm: dist.toFixed(1),
            durationMin: Math.round(dist * 4), // Assume ~15 km/h average in Addis traffic
          };
        }

        return {
          ...t.toObject(),
          price: req.user ? t.price : null,
          realDistanceKm: routeInfo.distanceKm,
          realDurationMin: routeInfo.durationMin,
        };
      }),
    );

    res.json({
      results: enriched,
      resolvedLocation: {
        lat: resolvedLat,
        lng: resolvedLng,
        fromName: resolvedFromName,
      },
    });
  } catch (error) {
    console.error("searchTerminals error:", error);
    res.status(500).json({ message: "Server error during search" });
  }
};
