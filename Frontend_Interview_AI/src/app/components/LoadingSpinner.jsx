export function LoadingSpinner({ label = "Loading", fullScreen = false }) {
  const wrapperClass = fullScreen
    ? "min-h-screen flex items-center justify-center"
    : "flex items-center justify-center py-10";

  return (
    <div className={wrapperClass}>
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
        <span>{label}</span>
      </div>
    </div>
  );
}
