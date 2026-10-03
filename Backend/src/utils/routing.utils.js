import axios from "axios";

export const getRouteInfo = async (startLngLat, endLngLat) => {
  try {
    const [startLng, startLat] = startLngLat;
    const [endLng, endLat] = endLngLat;

    const url = `http://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`;

    const res = await axios.get(url, { timeout: 8000 });

    if (res.data.routes?.length > 0) {
      const route = res.data.routes[0];
      return {
        distanceKm: (route.distance / 1000).toFixed(1), // meters → km
        durationMin: Math.round(route.duration / 60), // seconds → minutes
        success: true,
      };
    }
    return { success: false };
  } catch (err) {
    console.error("OSRM routing failed:", err.message);
    return { success: false };
  }
};
