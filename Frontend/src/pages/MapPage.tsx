// src/pages/MapPage.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  MapPin,
  Clock,
  Navigation,
  DollarSign,
  Moon,
  Sun,
  AlertCircle,
  MapPinned,
  CheckCircle,
} from "lucide-react";
import logoImage from "figma:asset/5915e0617cff13c3e21f224b1e9a79ae0981b769.png";
import MapView from "../components/map/MapView";

export default function MapPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapData, setMapData] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "pending" | "granted" | "denied"
  >("idle");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  // Single effect: load data + decide on GPS fallback
  useEffect(() => {
    // Step 1: Load from storage or state
    const stored = localStorage.getItem("mapData");
    let parsedData;

    if (stored) {
      parsedData = JSON.parse(stored);
    } else if (location.state) {
      parsedData = location.state;
      localStorage.setItem("mapData", JSON.stringify(parsedData));
    }

    if (parsedData) {
      setMapData(parsedData);
      setRoute(parsedData.route);

      // Step 2: Use resolved/geocoded location if available (priority!)
      if (parsedData.userLocation) {
        setUserLocation(parsedData.userLocation);
        setLocationStatus("granted");
        setLocationMessage(null);
        return; // ← IMPORTANT: Exit early — no GPS needed
      }
    }

    // Step 3: Only fallback to real GPS if NO resolved location was found
    if (navigator.geolocation) {
      setLocationStatus("pending");
      setLocationMessage("Trying to detect your current location...");

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(newLoc);
          setLocationStatus("granted");
          setLocationMessage("Current location acquired");

          // Update mapData only if no location was previously set
          if (mapData && !mapData.userLocation) {
            const updated = { ...mapData, userLocation: newLoc };
            setMapData(updated);
            localStorage.setItem("mapData", JSON.stringify(updated));
          }
        },
        (err) => {
          setLocationStatus("denied");
          setLocationMessage(
            err.code === 1
              ? "Location access denied — showing searched/fallback location."
              : "Could not get location — showing searched/fallback location.",
          );
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      setLocationStatus("denied");
      setLocationMessage(
        "Geolocation not supported — using searched location.",
      );
    }
  }, [location.state]); // Only depend on location.state

  if (!route || !mapData) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1
            className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            No route data available
          </h1>
          <p
            className={`mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Please go back and try searching again.
          </p>
          <Link
            to={user ? "/dashboard" : "/guest-search"}
            className="inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const terminalLoc = mapData.terminalLocation;
  const currentUserLoc = userLocation || mapData.userLocation;

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1
          className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          {route.type || "Route"}: {mapData.fromName || "Current Location"} →{" "}
          {mapData.destination}
        </h1>

        {/* Location status */}
        <div className="mb-6">
          {locationStatus === "pending" && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                isDarkMode
                  ? "bg-blue-900/40 text-blue-200"
                  : "bg-blue-50 text-blue-800"
              }`}
            >
              <MapPinned className="w-5 h-5 animate-pulse" />
              <span>{locationMessage || "Detecting your location..."}</span>
            </div>
          )}

          {locationStatus === "granted" && currentUserLoc && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                isDarkMode
                  ? "bg-green-900/40 text-green-200"
                  : "bg-green-50 text-green-800"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>
                Location acquired • {currentUserLoc.lat.toFixed(4)},{" "}
                {currentUserLoc.lng.toFixed(4)}
              </span>
            </div>
          )}

          {locationStatus === "denied" && locationMessage && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                isDarkMode
                  ? "bg-yellow-900/40 text-yellow-200"
                  : "bg-yellow-50 text-yellow-800"
              }`}
            >
              <AlertCircle className="w-5 h-5" />
              <span>{locationMessage}</span>
            </div>
          )}
        </div>

        {/* Map */}
        {currentUserLoc && terminalLoc && (
          <div
            style={{
              height: "600px",
              width: "100%",
              borderRadius: "0.75rem",
              overflow: "hidden",
              border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
            }}
            className="mb-10"
          >
            <MapView
              userLocation={currentUserLoc}
              terminalLocation={terminalLoc}
              destination={mapData.destination}
              route={route}
            />
          </div>
        )}

        {/* Route Details */}
        <div
          className={`${
            isDarkMode
              ? "bg-gray-800/90 border-blue-500/30"
              : "bg-white border-gray-200"
          } backdrop-blur-md border rounded-xl p-6 shadow-lg`}
        >
          <h2
            className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Route Details
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div
              className={`${
                isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
              } p-5 rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-green-500" />
                <h3 className="font-medium">Duration</h3>
              </div>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {route.duration || "—"}
              </p>
            </div>

            <div
              className={`${
                isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
              } p-5 rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Navigation className="w-6 h-6 text-blue-500" />
                <h3 className="font-medium">Distance</h3>
              </div>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {route.distance || "—"}
              </p>
            </div>

            {user && (
              <div
                className={`${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                } p-5 rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-6 h-6 text-yellow-500" />
                  <h3 className="font-medium">Est. Cost</h3>
                </div>
                <p
                  className={`text-2xl font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}
                >
                  {route.estimatedMoney || "—"}
                </p>
              </div>
            )}
          </div>

          <div>
            <h3
              className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              Terminal: {route.terminal || "—"}
            </h3>
            {route.stops?.length > 0 && (
              <div>
                <p
                  className={`mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Stops along the way:
                </p>
                <div className="flex flex-wrap gap-3">
                  {route.stops.map((stop: string, i: number) => (
                    <span
                      key={i}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        isDarkMode
                          ? "bg-blue-900/50 text-blue-200 border border-blue-700/30"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {stop}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
