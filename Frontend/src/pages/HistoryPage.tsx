import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Clock, MapPin, ArrowRight, DollarSign } from "lucide-react";
import logoImage from "figma:asset/5915e0617cff13c3e21f224b1e9a79ae0981b769.png";
import HistorySkeleton from "../components/history/HistorySkeleton"; // ← import here

interface SearchHistoryItem {
  from: string;
  to: string;
  createdAt: string;
  price?: number;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (isoString: string) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/history", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch history");
        const data: SearchHistoryItem[] = await res.json();
        setSearchHistory(data || []);
      } catch (err) {
        console.error("Failed to fetch search history", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1
          className={`text-4xl mb-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Search History
        </h1>

        {loading ? (
          <HistorySkeleton /> // ← now using the exported component
        ) : searchHistory.length === 0 ? (
          <div
            className={`${
              isDarkMode
                ? "bg-gray-700/60 border-blue-400/30"
                : "bg-white border-gray-200"
            } backdrop-blur-xl border rounded-lg p-12 text-center`}
          >
            <Clock
              className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
            />
            <p
              className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              No search history yet
            </p>
            <p
              className={`mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              Start searching for routes to build your history
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchHistory.map((item, index) => (
              <div
                key={index}
                className={`${
                  isDarkMode
                    ? "bg-gray-700/60 border-blue-400/30 hover:bg-gray-700/80"
                    : "bg-white border-gray-200 hover:shadow-md"
                } backdrop-blur-xl border rounded-lg p-6 transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <MapPin
                      className={`w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span
                        className={`text-xl ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}
                      >
                        {item.from}
                      </span>
                      <ArrowRight
                        className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      />
                      <span
                        className={`text-xl ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}
                      >
                        {item.to}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {item.price && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign
                          className={`w-4 h-4 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}
                        />
                        <span
                          className={`${isDarkMode ? "text-yellow-400" : "text-yellow-600"} font-medium`}
                        >
                          {item.price} ETB
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock
                        className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      />
                      <span
                        className={`px-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
