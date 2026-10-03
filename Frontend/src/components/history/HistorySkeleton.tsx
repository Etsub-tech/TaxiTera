export default function HistorySkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-700/60 dark:bg-gray-700/40 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-6 h-6 bg-gray-500 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-24 bg-gray-500 rounded" />
                  <div className="w-5 h-5 bg-gray-500 rounded-full" />
                  <div className="h-6 w-24 bg-gray-500 rounded" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-5 w-20 bg-gray-500 rounded" />
              <div className="h-4 w-32 bg-gray-500 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
