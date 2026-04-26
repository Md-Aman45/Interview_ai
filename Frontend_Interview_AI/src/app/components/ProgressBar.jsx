export function ProgressBar({ current, total, color = "indigo" }) {
  const width = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  const colorMap = {
    indigo: "bg-indigo-600",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>
          {current} / {total}
        </span>
        <span>{width}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-900">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${colorMap[color] || colorMap.indigo}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
