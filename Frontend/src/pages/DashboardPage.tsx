// src/pages/DashboardPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useSuggestions } from "../hooks/useSuggestions";
import { toast } from "sonner";
import { Search, MapPin, ArrowRight, TrendingUp, Loader2 } from "lucide-react";
import Header from "../components/common/Header";
import SearchForm from "../components/common/SearchForm";

export default function DashboardPage() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const {
    fromSuggestions,
    toSuggestions,
    fetchSuggestions,
    clearSuggestions,
    loadingSuggestions,
  } = useSuggestions();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [maxDistance, setMaxDistance] = useState(5000);
  const [popularRoutes, setPopularRoutes] = useState<{ from: string; to: string; count: number }[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          toast.success("Location detected");
        },
        () => toast.error("Location access denied")
      );
    }
  }, []);

useEffect(() => {
  const fetchPopular = async () => {
    if (!user) {
      setLoadingPopular(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/history/popular", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch popular routes");

      const data = await res.json();
      setPopularRoutes(data || []);
    } catch (err) {
      console.error("Failed to load popular routes", err);
      toast.error("Couldn't load your popular routes");
    } finally {
      setLoadingPopular(false);
    }
  };

  fetchPopular();
}, [user]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim()) {
      toast.error("Destination is required");
      return;
    }
    navigate("/search-results", {
      state: { from: from.trim(), to: to.trim(), userLocation, maxDistance },
    });
  };

  const handleSelectPopular = (fromVal: string, toVal: string) => {
    setFrom(fromVal);
    setTo(toVal);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8 pt-8">
        <h1 className={`text-3xl mb-6 ${isDarkMode ? "text-white" : "text-black"}`}>
          Welcome, {user?.username || "User"}!
        </h1>

        <SearchForm
          from={from}
          to={to}
          maxDistance={maxDistance}
          userLocation={userLocation}
          onFromChange={(v) => {
            setFrom(v);
            fetchSuggestions(v, "from");
          }}
          onToChange={(v) => {
            setTo(v);
            fetchSuggestions(v, "to");
          }}
          onMaxDistanceChange={setMaxDistance}
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
        />

        {/* Personalized Popular Routes */}
        <div
          className={`${
            isDarkMode ? "bg-white/10 border-blue-300/40" : "bg-white border-gray-200"
          } backdrop-blur-xl border rounded-lg p-8 mt-8`}
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className={`w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
            <h2 className={`text-2xl ${isDarkMode ? "text-white" : "text-black"}`}>
              {user ? "Your Frequent Routes" : "Popular Routes"}
            </h2>
          </div>

          {loadingPopular ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            </div>
          ) : popularRoutes.length > 0 ? (
            <div className="space-y-3">
              {popularRoutes.map((route, idx) => (
                <div
                  key={idx}
                  className={`${
                    isDarkMode ? "bg-gray-800/60 hover:bg-gray-800/80" : "bg-gray-50 hover:bg-gray-100"
                  } border rounded p-5 transition-colors cursor-pointer`}
                  onClick={() => handleSelectPopular(route.from, route.to)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={isDarkMode ? "text-white" : "text-black"}>{route.from}</span>
                      <ArrowRight className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                      <span className={isDarkMode ? "text-white" : "text-black"}>{route.to}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-600 text-white">
                      {route.count}x
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {user
                ? "Start searching routes — your most visited will appear here!"
                : "Popular routes will appear here for guests"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}