export function AIInsightsCard({ summary }) {
  if (!summary) return null;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
      
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
        AI Insights
      </div>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
        Your performance overview
      </h3>

      <div className="space-y-4">

        {/* Average Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Average Score</span>
          <span className="font-semibold text-indigo-600">
            {summary?.averageScore || 0}%
          </span>
        </div>

        {/* Hiring Recommendation */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Hiring Signal</span>
          <span className="font-semibold text-green-600">
            {summary?.hiringRecommendation || "N/A"}
          </span>
        </div>

        {/* Weak Areas */}
        <div>
          <div className="text-sm text-slate-500 mb-2">Focus Areas</div>
          <div className="flex flex-wrap gap-2">
            {summary?.weakTopics?.length ? (
              summary.weakTopics.map((topic, i) => (
                <span key={i} className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600">
                  {topic}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">
                No weak areas detected yet
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}