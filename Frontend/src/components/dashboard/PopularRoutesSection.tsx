import { useTheme } from "../../context/ThemeContext";
import { TrendingUp, ArrowRight } from "lucide-react";

const POPULAR_ROUTES = [
  { from: "Mercato", to: "Bole", popularity: "Very Popular" },
  { from: "Piassa", to: "Megenagna", popularity: "Popular" },
  { from: "Meskel Square", to: "Mexico", popularity: "Popular" },
  { from: "Autobus Tera", to: "Mercato", popularity: "Very Popular" },
];

interface PopularRoutesSectionProps {
  onSelectRoute: (from: string, to: string) => void;
}

export default function PopularRoutesSection({
  onSelectRoute,
}: PopularRoutesSectionProps) {
  const { isDarkMode } = useTheme();

  return (
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
        <h2 className={`text-2xl ${isDarkMode ? "text-white" : "text-black"}`}>
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
            onClick={() => onSelectRoute(route.from, route.to)}
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
  );
}
