import { Star, Navigation, Clock, ArrowRight } from "lucide-react";

interface RouteOption {
  id: number;
  type: "Best Route" | "Nearest Terminal" | "Fastest Route";
  optionNumber: number;
  terminal: string;
  stops: string[];
  duration: string;
  distance: string;
  estimatedMoney: string;
  onClick: () => void;
  isDarkMode: boolean;
  showPrice: boolean;
}

export default function RouteCard({
  type,
  optionNumber,
  terminal,
  stops,
  duration,
  distance,
  estimatedMoney,
  onClick,
  isDarkMode,
  showPrice,
}: RouteOption & {
  onClick: () => void;
  isDarkMode: boolean;
  showPrice: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-xl border-l-4 shadow-md transition-all hover:shadow-lg ${
        isDarkMode
          ? "bg-gray-800/80 border-blue-500/60 hover:bg-gray-800"
          : "bg-white border-blue-500 hover:shadow-xl"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {type === "Best Route" && (
            <Star className="w-6 h-6 text-yellow-400" />
          )}
          {type === "Nearest Terminal" && (
            <Navigation className="w-6 h-6 text-green-500" />
          )}
          {type === "Fastest Route" && (
            <Clock className="w-6 h-6 text-blue-500" />
          )}
          <h3 className="text-xl font-semibold">{type}</h3>
        </div>
        <span className="px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
          Option {optionNumber}
        </span>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Terminal
          </p>
          <p className="font-medium">{terminal}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Distance
          </p>
          <p className="font-medium">{distance}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Est. Time
          </p>
          <p className="font-medium">{duration}</p>
        </div>
        {showPrice && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Est. Cost
            </p>
            <p className="font-medium text-green-600 dark:text-green-400">
              {estimatedMoney}
            </p>
          </div>
        )}
      </div>

      {stops.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Stops:
          </p>
          <div className="flex flex-wrap gap-2">
            {stops.map((stop, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-sm ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {stop}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onClick}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
      >
        View on Map
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
