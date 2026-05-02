import { Link } from "react";

export function NextActionCard({ summary }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">

      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
        Next Steps
      </div>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
        What should you do next?
      </h3>

      <div className="space-y-3">

        <Link to="/reports/new"
          className="block p-4 rounded-xl border hover:bg-indigo-50 dark:hover:bg-indigo-950 transition">
          📄 Create new report
        </Link>

        <Link to="/mock"
          className="block p-4 rounded-xl border hover:bg-indigo-50 dark:hover:bg-indigo-950 transition">
          🎤 Start mock interview
        </Link>

        {summary?.weakTopics?.length > 0 && (
          <div className="p-4 rounded-xl border bg-red-50 dark:bg-red-950">
            ⚠ Focus on: <b>{summary.weakTopics[0]}</b>
          </div>
        )}

      </div>
    </div>
  );
}''