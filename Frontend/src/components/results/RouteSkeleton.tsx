import { useTheme } from "../../context/ThemeContext";

export default function RouteSkeleton() {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`p-6 rounded-xl border-l-4 border-blue-500/60 shadow-md
        ${isDarkMode ? "bg-gray-800/80" : "bg-white"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-shimmer" />
        <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full animate-shimmer" />
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-shimmer" />
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-shimmer" />
          </div>
        ))}
      </div>

      <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-lg animate-shimmer" />
    </div>
  );
}
