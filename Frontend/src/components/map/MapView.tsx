import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Fix default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapViewProps {
  userLocation: { lat: number; lng: number };
  terminalLocation: { lat: number; lng: number };
  destination: string;
  route?: any;
}

function RouteFetcher({
  userLocation,
  terminalLocation,
  setDriveRoute,
  setWalkRoute,
}: any) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !terminalLocation) return;

    const fetchRoute = async (profile: "driving" | "walking", setter: any) => {
      try {
        const url = `http://router.project-osrm.org/route/v1/${profile}/${userLocation.lng},${userLocation.lat};${terminalLocation.lng},${terminalLocation.lat}?overview=full&geometries=geojson`;
        const res = await axios.get(url, { timeout: 8000 });

        if (res.data.routes?.length > 0) {
          const r = res.data.routes[0];
          const coords = r.geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng],
          );
          setter({
            coords,
            distanceKm: (r.distance / 1000).toFixed(1),
            durationMin: Math.round(r.duration / 60),
          });
        }
      } catch (err) {
        console.warn(`OSRM ${profile} failed:`, err);
      }
    };

    fetchRoute("driving", setDriveRoute);
    fetchRoute("walking", setWalkRoute);
  }, [userLocation, terminalLocation]);

  return null;
}

export default function MapView({
  userLocation,
  terminalLocation,
  destination,
  route,
}: MapViewProps) {
  const mapRef = useRef<L.Map>(null);
  const [driveRoute, setDriveRoute] = useState<any>(null);
  const [walkRoute, setWalkRoute] = useState<any>(null);
  const [mode, setMode] = useState<"car" | "walk">("car");

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize({ animate: false });
      setTimeout(() => mapRef.current?.invalidateSize(), 300);
    }
  }, []);

  const center = [userLocation.lat, userLocation.lng] as [number, number];

  const currentRoute = mode === "car" ? driveRoute : walkRoute;
  const currentColor = mode === "car" ? "#3b82f6" : "#10b981";
  const currentStyle = mode === "car" ? {} : { dashArray: "10, 10" };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Bottom Center Toggle - Icons Only, Medium Size */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2000,
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "9999px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          padding: "10px 20px",
          display: "flex",
          gap: "24px",
          border: "1px solid rgba(229,231,235,0.6)",
        }}
      >
        {/* Car Button */}
        <button
          onClick={() => setMode("car")}
          title="By Car / Minibus"
          style={{
            padding: "10px",
            borderRadius: "50%",
            background: mode === "car" ? "#3b82f6" : "#f3f4f6",
            color: mode === "car" ? "white" : "#4b5563",
            fontSize: "1.8rem",
            lineHeight: "1",
            cursor: "pointer",
            border: "none",
            boxShadow:
              mode === "car" ? "0 0 0 4px rgba(59,130,246,0.4)" : "none",
            transition: "all 0.18s ease",
          }}
        >
          🚗
        </button>

        {/* Walk Button */}
        <button
          onClick={() => setMode("walk")}
          title="By Foot"
          style={{
            padding: "10px",
            borderRadius: "50%",
            background: mode === "walk" ? "#10b981" : "#f3f4f6",
            color: mode === "walk" ? "white" : "#4b5563",
            fontSize: "1.8rem",
            lineHeight: "1",
            cursor: "pointer",
            border: "none",
            boxShadow:
              mode === "walk" ? "0 0 0 4px rgba(16,185,129,0.4)" : "none",
            transition: "all 0.18s ease",
          }}
        >
          🚶
        </button>
      </div>

      <MapContainer
        ref={mapRef}
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <RouteFetcher
          userLocation={userLocation}
          terminalLocation={terminalLocation}
          setDriveRoute={setDriveRoute}
          setWalkRoute={setWalkRoute}
        />

        <Marker
          position={center}
          icon={L.divIcon({
            html: '<div style="font-size:40px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5))">📍</div>',
            className: "",
            iconSize: [56, 64],
            iconAnchor: [28, 64],
          })}
        >
          <Popup>You are here</Popup>
        </Marker>

        <Marker
          position={[terminalLocation.lat, terminalLocation.lng]}
          icon={L.divIcon({
            html: '<div style="font-size:40px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5))">🚌</div>',
            className: "",
            iconSize: [56, 64],
            iconAnchor: [28, 64],
          })}
        >
          <Popup>{route?.terminal || destination || "Terminal"}</Popup>
        </Marker>

        {currentRoute?.coords && (
          <Polyline
            key={mode} // ← This forces re-render when mode changes
            positions={currentRoute.coords}
            color={currentColor}
            weight={7}
            opacity={0.9}
            {...currentStyle}
          >
            <Popup style={{ fontSize: "15px" }}>
              {mode === "car" ? "🚗 Minibus/Car" : "🚶 Walking"} Route
              <br />
              <strong>Distance:</strong> {currentRoute.distanceKm} km
              <br />
              <strong>Time:</strong> {currentRoute.durationMin} min
            </Popup>
          </Polyline>
        )}
      </MapContainer>
    </div>
  );
}
