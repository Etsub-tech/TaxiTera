// src/pages/GuestSearchPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSuggestions } from "../hooks/useSuggestions";
import { TrendingUp, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import SearchForm from "../components/common/SearchForm";

const POPULAR_ROUTES = [
  { from: "Mercato", to: "Bole", popularity: "Very Popular" },
  { from: "Piassa", to: "Megenagna", popularity: "Popular" },
  { from: "Legehar", to: "CMC", popularity: "Very Popular" },
  { from: "Meskel Square", to: "Mexico", popularity: "Popular" },
  { from: "Autobus Tera", to: "Mercato", popularity: "Very Popular" },
];

export default function GuestSearchPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const {
    fromSuggestions,
    toSuggestions,
    fetchSuggestions,
    clearSuggestions,
    loadingSuggestions,
  } = useSuggestions();

  // Auto-detect location
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationPermission("pending");
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationPermission("granted");
          setLoadingLocation(false);
          toast.success("Location detected");
        },
        () => {
          setLocationPermission("denied");
          setLoadingLocation(false);
          toast.error("Location access denied. Enter starting point manually.");
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      setLocationPermission("denied");
      toast.error("Geolocation not supported");
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim()) {
      toast.error("Destination required");
      return;
    }

    navigate("/search-results", {
      state: {
        from: from.trim(),
        to: to.trim(),
        userLocation: locationPermission === "granted" ? userLocation : null,
      },
    });
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1
          className={`text-3xl mb-6 ${isDarkMode ? "text-white" : "text-black"}`}
        >
          Welcome to TaxiTera
        </h1>

        {/* Reused shared SearchForm */}
        <SearchForm
          from={from}
          to={to}
          maxDistance={5000} // fixed for guest, or make state if you want
          userLocation={userLocation}
          onFromChange={(v) => {
            setFrom(v);
            fetchSuggestions(v, "from");
          }}
          onToChange={(v) => {
            setTo(v);
            fetchSuggestions(v, "to");
          }}
          onMaxDistanceChange={() => {}} // no slider for guest
          onSubmit={handleSearch}
          fromSuggestions={fromSuggestions}
          toSuggestions={toSuggestions}
          onSuggestionClick={(type, value) => {
            if (type === "from") {
              setFrom(value);
              clearSuggestions("from");
            } else {
              setTo(value);
              clearSuggestions("to");
            }
          }}
          loadingSuggestions={loadingSuggestions}
          showRadiusSlider={false} // ← hide slider for guest
        />

        {/* Popular Routes */}
        <div
          className={`${
            isDarkMode
              ? "bg-white/10 border-blue-300/40"
              : "bg-white border-gray-200"
          } backdrop-blur-xl border rounded-lg p-8`}
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp
              className={`w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
            />
            <h2
              className={`text-2xl ${isDarkMode ? "text-white" : "text-black"}`}
            >
              Popular Routes
            </h2>
          </div>
          <div className="space-y-3">
            {POPULAR_ROUTES.map((route, idx) => (
              <div
                key={idx}
                className={`${
                  isDarkMode
                    ? "bg-gray-800/60 hover:bg-gray-800/80"
                    : "bg-gray-50 hover:bg-gray-100"
                } border rounded p-5 transition-colors cursor-pointer`}
                onClick={() => {
                  setFrom(route.from);
                  setTo(route.to);
                  fetchSuggestions(route.from, "from");
                  fetchSuggestions(route.to, "to");
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={isDarkMode ? "text-white" : "text-black"}>
                      {route.from}
                    </span>
                    <ArrowRight
                      className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                    />
                    <span className={isDarkMode ? "text-white" : "text-black"}>
                      {route.to}
                    </span>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm ${
                      route.popularity.includes("Very")
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {route.popularity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
