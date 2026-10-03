import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import { useSearchResults } from "../hooks/useSearchResults";
import { useRouteOptions } from "../hooks/useRouteOptions";

import RouteCard from "../components/results/RouteCard";
import RouteSkeleton from "../components/results/RouteSkeleton";
import SearchSummary from "../components/results/SearchSummary";
import NoResultsMessage from "../components/results/NoResultsMessage";

export default function SearchResultsPage() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const { searchData, loading, error } = useSearchResults();
  const routes = useRouteOptions(searchData?.terminals || []);

  const handleRouteClick = (route: any) => {
    if (!searchData) return;

    // Save history if logged in
    if (user) {
      const token = localStorage.getItem("token");
      fetch("http://localhost:5000/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          from:
            searchData.userLocation.fromName ||
            searchData.fromName ||
            "Current Location",
          to: searchData.destination,
          price: route.estimatedMoney,
        }),
      }).catch((err) => console.error("History save failed:", err));
    }

    // Prepare map data
    const mapData = {
      userLocation: searchData.userLocation,
      terminalLocation: { lat: route.lat || 0, lng: route.lng || 0 },
      destination: searchData.destination,
      route,
      fromName:
        searchData.userLocation.fromName ||
        searchData.fromName ||
        "Current Location",
    };

    localStorage.setItem("mapData", JSON.stringify(mapData));
    window.location.href = "/map"; // or use navigate("/map", { state: mapData })
  };

  return (
    <div
      className={`min-h-screen pt-8 ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Available Routes</h1>

        {user && <p className="mb-6 text-lg">Welcome back, {user.username}</p>}

        {searchData && (
          <SearchSummary
            fromName={
              searchData.userLocation.fromName ||
              searchData.fromName ||
              "Your Location"
            }
            destination={searchData.destination}
          />
        )}
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <RouteSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-8">{error}</p>
        ) : routes.length === 0 ? (
          <NoResultsMessage />
        ) : (
          <div className="space-y-6">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                {...route}
                onClick={() => handleRouteClick(route)}
                isDarkMode={isDarkMode}
                showPrice={!!user}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
