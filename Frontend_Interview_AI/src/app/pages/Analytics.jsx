import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Layout } from "../components/Layout.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { analyticsService } from "../services/analytics.service.js";

function StatPanel({ label, value, description }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">{value}</div>
      <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</div>
    </div>
  );
}

export function Analytics() {
  const [summary, setSummary] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [summaryResponse, usageResponse] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getUsage(),
        ]);

        setSummary(summaryResponse);
        setUsage(usageResponse);
      } catch (error) {
        toast.error("Could not load analytics.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading analytics" />;
  }

  return (
    <Layout title="Analytics" eyebrow="Performance tracking">
      <div className="space-y-6">
        <section className="grid gap-6 md:grid-cols-3">
          <StatPanel
            label="Completed sessions"
            value={summary?.totalMockInterviews || 0}
            description="Finished mock interviews captured by the backend"
          />
          <StatPanel
            label="Average score"
            value={`${Math.round(summary?.averageScore || 0)}%`}
            description="Current overall performance trend"
          />
          <StatPanel
            label="Weak topics"
            value={summary?.weakTopics?.length || 0}
            description="Recurring areas flagged across sessions"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Score history
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
              Session trend over time
            </h2>

            <div className="mt-8 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary?.scoreHistory || []}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip />
                  <Area dataKey="score" stroke="#4f46e5" fill="url(#scoreFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Usage status
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                  Reports
                </div>
                <ProgressBar current={usage?.reports?.used || 0} total={usage?.reports?.limit || 20} />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                  Resume exports
                </div>
                <ProgressBar current={usage?.resumes?.used || 0} total={usage?.resumes?.limit || 15} color="amber" />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                  Mock interviews
                </div>
                <ProgressBar current={usage?.mockInterviews?.used || 0} total={usage?.mockInterviews?.limit || 10} color="emerald" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Weak topics
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {summary?.weakTopics?.length ? (
              summary.weakTopics.map((topic, index) => (
                <div
                  key={`${topic.topic}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="text-lg font-semibold text-slate-900 dark:text-white">
                    {topic.topic}
                  </div>
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Average score {Math.round(topic.averageScore || 0)}%
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Complete more sessions to populate this area.
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
