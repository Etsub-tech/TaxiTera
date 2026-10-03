import { useTheme } from "../../context/ThemeContext";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";

interface SearchFormProps {
  from: string;
  to: string;
  maxDistance: number;
  userLocation: { lat: number; lng: number } | null;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onMaxDistanceChange: (value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  fromSuggestions: string[];
  toSuggestions: string[];
  onSuggestionClick: (type: "from" | "to", value: string) => void;
  loadingSuggestions?: boolean;
  showRadiusSlider?: boolean;
}

export default function SearchForm({
  from,
  to,
  maxDistance,
  userLocation,
  onFromChange,
  onToChange,
  onMaxDistanceChange,
  onSubmit,
  fromSuggestions,
  toSuggestions,
  onSuggestionClick,
  loadingSuggestions = false,
  showRadiusSlider = true,
}: SearchFormProps) {
  const { isDarkMode } = useTheme();

  // NEW: Flag to prevent re-fetch after selection / popular click
  const [isFromSelected, setIsFromSelected] = useState(false);
  const [isToSelected, setIsToSelected] = useState(false);

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-white/10 border-blue-300/40"
          : "bg-white border-gray-200"
      } backdrop-blur-xl border rounded-lg shadow-2xl mb-6 overflow-hidden`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <Search className="w-6 h-6 text-white" />
          <h2 className="text-white text-xl">Search Routes</h2>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-8">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* From */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <label className="text-white">From (Origin)</label>
              {userLocation && !from && (
                <span className="text-xs text-green-400 ml-2">
                  (current location)
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={from}
                onChange={(e) => {
                  const newValue = e.target.value;
                  onFromChange(newValue);
                  setIsFromSelected(false);
                }}
                className="w-full px-4 py-3 bg-gray-800/70 border border-blue-400/40 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder={
                  userLocation
                    ? "Type to override current location"
                    : "Enter starting point"
                }
              />

              {loadingSuggestions && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500 dark:text-blue-400" />
                </div>
              )}
            </div>

            {fromSuggestions.length > 0 && (
              <ul className="absolute z-30 w-full mt-1 max-h-60 overflow-auto rounded-lg shadow-2xl border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-700">
                {fromSuggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-3 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
                    onClick={() => {
                      onSuggestionClick("from", s);
                      setIsFromSelected(true); // block re-fetch & no-match
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* To - same logic */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <label className="text-white">To (Destination)</label>
            </div>

            <div className="relative">
              <input
                type="text"
                value={to}
                onChange={(e) => {
                  const newValue = e.target.value;
                  onToChange(newValue);
                  setIsToSelected(false);
                }}
                className="w-full px-4 py-3 bg-gray-800/70 border border-blue-400/40 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Select destination"
                required
              />

              {loadingSuggestions && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500 dark:text-blue-400" />
                </div>
              )}
            </div>

            {toSuggestions.length > 0 && (
              <ul className="absolute z-30 w-full mt-1 max-h-60 overflow-auto rounded-lg shadow-2xl border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-700">
                {toSuggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-3 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
                    onClick={() => {
                      onSuggestionClick("to", s);
                      setIsToSelected(true);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {showRadiusSlider && (
          <div className="mb-6">
            <label className="block text-white mb-2">
              Search radius: {maxDistance / 1000} km
            </label>
            <input
              type="range"
              min={2000}
              max={15000}
              step={1000}
              value={maxDistance}
              onChange={(e) => onMaxDistanceChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
            <span>2 km</span>
            <span>15 km</span>
           </div>
          </div>
        )}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded flex items-center justify-center gap-2 font-medium transition-all"
        >
          <Search className="w-5 h-5" />
          Find Routes
        </button>
      </form>
    </div>
  );
}
