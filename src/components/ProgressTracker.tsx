type ProgressTrackerProps = {
  current: number;
  total: number;
};

export const ProgressTracker = ({ current, total }: ProgressTrackerProps) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded h-4 mb-4">
      <div
        className="bg-blue-600 h-4 rounded transition-all"
        style={{ width: `${percent}%` }}
      />
      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-right">
        {current} / {total} answered ({percent}%)
      </div>
    </div>
  );
};