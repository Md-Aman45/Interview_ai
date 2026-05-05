import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRightIcon, BarChart3Icon, FileTextIcon, MicIcon,
  SparklesIcon, TrendingUpIcon, GithubIcon, LinkedinIcon, ExternalLinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Layout } from "../components/Layout.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { Badge } from "../components/Badge.jsx";
import { analyticsService } from "../services/analytics.service.js";
import { interviewService } from "../services/interview.service.js";
import { getRecommendationBadge, formatDate } from "../utils/formatters.js";
import { useAuth } from "../context/AuthContext.jsx";

function MetricCard({ label, value, description, icon: Icon, color = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400",
  };
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 text-4xl font-semibold text-slate-900 dark:text-white">{value}</div>
      <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</div>
    </div>
  );
}

// ── EDITABLE PROFILE LINKS ────────────────────────────────
const PRESET_DEFS = [
  { key: "github",    label: "GitHub",        icon: "🐙", placeholder: "https://github.com/username" },
  { key: "linkedin",  label: "LinkedIn",      icon: "💼", placeholder: "https://linkedin.com/in/username" },
  { key: "portfolio", label: "Portfolio",     icon: "🌐", placeholder: "https://yoursite.com" },
  { key: "leetcode",  label: "LeetCode",      icon: "🧩", placeholder: "https://leetcode.com/username" },
  { key: "gfg",       label: "GeeksforGeeks", icon: "🟢", placeholder: "https://geeksforgeeks.org/user/username" },
];

const STORAGE_KEY = "interviewai_profile_links";

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { presets: {}, custom: [] }; }
  catch { return { presets: {}, custom: [] }; }
}

function ProfileLinksCard() {
  const [saved, setSaved] = useState(loadSaved);
  const [editing, setEditing] = useState(false);
  const [draftPresets, setDraftPresets] = useState({});
  const [draftCustom, setDraftCustom] = useState([]);

  function openEdit() {
    setDraftPresets({ ...saved.presets });
    setDraftCustom(saved.custom?.length ? [...saved.custom] : []);
    setEditing(true);
  }

  function addCustom() {
    setDraftCustom(prev => [...prev, { id: Date.now(), label: '', url: '', icon: '🔗' }]);
  }

  function removeCustom(id) {
    setDraftCustom(prev => prev.filter(c => c.id !== id));
  }

  function updateCustom(id, field, value) {
    setDraftCustom(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  function save() {
    const next = { presets: draftPresets, custom: draftCustom.filter(c => c.url?.trim()) };
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setEditing(false);
  }

  // Build display list
  const filledPresets = PRESET_DEFS.filter(d => saved.presets?.[d.key]);
  const filledCustom = (saved.custom || []).filter(c => c.url);
  const allLinks = [
    ...filledPresets.map(d => ({ label: d.label, icon: d.icon, url: saved.presets[d.key] })),
    ...filledCustom.map(c => ({ label: c.label || 'Link', icon: c.icon || '🔗', url: c.url })),
  ];

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-1">Your profiles</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Resume links</h3>
        </div>
        <button onClick={openEdit}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 py-1.5">
          {allLinks.length === 0 ? "Add links" : "Edit"}
        </button>
      </div>

      {allLinks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center">
          <div className="text-2xl mb-2">🔗</div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Add your GitHub, LinkedIn, portfolio and any other links.</p>
          <button onClick={openEdit} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition">
            Add profile links →
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {allLinks.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 transition hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{link.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{link.label}</div>
                  <div className="text-xs text-slate-400 truncate max-w-[140px]">{link.url.replace(/^https?:\/\/(www\.)?/, '')}</div>
                </div>
              </div>
              <ExternalLinkIcon className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-500 transition flex-shrink-0" />
            </a>
          ))}
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="px-7 py-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit profile links</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Saved locally in your browser. Add any link you want.</p>
            </div>

            <div className="px-7 py-5 overflow-y-auto max-h-[60vh] space-y-5">
              {/* Preset links */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Popular platforms</div>
                <div className="space-y-2.5">
                  {PRESET_DEFS.map(def => (
                    <div key={def.key} className="flex items-center gap-3">
                      <span className="text-lg flex-shrink-0 w-7 text-center">{def.icon}</span>
                      <input
                        type="url"
                        value={draftPresets[def.key] || ""}
                        onChange={e => setDraftPresets(d => ({ ...d, [def.key]: e.target.value }))}
                        placeholder={def.placeholder}
                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom links */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Custom links</div>
                  <button onClick={addCustom} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition flex items-center gap-1">
                    + Add link
                  </button>
                </div>
                {draftCustom.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-4 text-center">
                    <p className="text-xs text-slate-400 mb-1.5">Add Twitter, YouTube, Hashnode, Dev.to — anything</p>
                    <button onClick={addCustom} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">+ Add custom link</button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {draftCustom.map(c => (
                      <div key={c.id} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3">
                        <div className="flex gap-2 mb-2">
                          <input value={c.icon} onChange={e => updateCustom(c.id, 'icon', e.target.value)}
                            placeholder="🔗" maxLength={2}
                            className="w-11 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 text-base outline-none focus:border-indigo-500 dark:text-white" />
                          <input value={c.label} onChange={e => updateCustom(c.id, 'label', e.target.value)}
                            placeholder="Label (e.g. Twitter)"
                            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600" />
                          <button onClick={() => removeCustom(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition text-lg leading-none">×</button>
                        </div>
                        <input value={c.url} onChange={e => updateCustom(c.id, 'url', e.target.value)}
                          placeholder="https://..."
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button onClick={() => setEditing(false)}
                className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                Cancel
              </button>
              <button onClick={save}
                className="flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-sm font-bold text-white transition shadow-lg shadow-indigo-500/20">
                Save links
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [usage, setUsage] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, usageRes, reportsRes] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getUsage(),
          interviewService.getAllReports(),
        ]);
        setSummary(summaryRes); setUsage(usageRes); setReports(reportsRes);
      } catch {
        toast.error("Could not load your dashboard.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const recentReports = useMemo(() => reports.slice(0, 4), [reports]);

  if (loading) return <LoadingSpinner fullScreen label="Loading dashboard" />;

  return (
    <Layout
      title={`Welcome back, ${user?.username || "Operator"}`}
      eyebrow="Workspace overview"
      actions={
        <Link to="/reports/new" className="hidden rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 md:inline-flex">
          New report
        </Link>
      }
    >
      <div className="space-y-6">

        {/* Hero + Usage */}
        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="info"><SparklesIcon className="mr-1.5 h-3 w-3" />InterviewAI</Badge>
              <Badge variant="neutral">AI-powered prep</Badge>
            </div>
            <h2 className="max-w-xl text-3xl font-semibold text-slate-900 dark:text-white leading-tight">
              Your AI interview coach, always ready.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Upload your resume, get a job match score, practice voice interviews, and track your progress — all from one workspace.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { to: "/reports/new", icon: FileTextIcon, label: "Create report", desc: "Analyze a new role", color: "hover:border-indigo-300 hover:bg-indigo-50 dark:hover:border-indigo-800", iconColor: "text-indigo-600" },
                { to: "/mock", icon: MicIcon, label: "Start practice", desc: "Voice mock interview", color: "hover:border-emerald-300 hover:bg-emerald-50 dark:hover:border-emerald-800", iconColor: "text-emerald-600" },
                { to: "/analytics", icon: BarChart3Icon, label: "Analytics", desc: "Track performance", color: "hover:border-sky-300 hover:bg-sky-50 dark:hover:border-sky-800", iconColor: "text-sky-600" },
              ].map(item => (
                <Link key={item.to} to={item.to} className={`rounded-2xl border border-slate-200 bg-slate-50 p-5 transition dark:border-slate-800 dark:bg-slate-900 ${item.color}`}>
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                  <div className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{item.label}</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Usage */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-6">Monthly usage</div>
            <div className="space-y-6">
              {[
                { label: "Reports", current: usage?.reports?.used || 0, total: usage?.reports?.limit || 20, color: "indigo" },
                { label: "Resume exports", current: usage?.resumes?.used || 0, total: usage?.resumes?.limit || 15, color: "amber" },
                { label: "Mock interviews", current: usage?.mockInterviews?.used || 0, total: usage?.mockInterviews?.limit || 10, color: "emerald" },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{item.current}/{item.total}</span>
                  </div>
                  <ProgressBar current={item.current} total={item.total} color={item.color} />
                </div>
              ))}
            </div>
            {usage?.resetDate && (
              <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
                Resets on {formatDate(usage.resetDate)}
              </p>
            )}
          </div>
        </section>

        {/* Metrics */}
        <section className="grid gap-6 md:grid-cols-3">
          <MetricCard label="Reports created" value={reports.length} description="Total analyses in workspace" icon={FileTextIcon} color="indigo" />
          <MetricCard label="Mock sessions" value={summary?.totalMockInterviews || 0} description="Completed interview runs" icon={MicIcon} color="emerald" />
          <MetricCard label="Average score" value={`${Math.round(summary?.averageScore || 0)}%`} description="Overall interview trend" icon={TrendingUpIcon} color="sky" />
        </section>

        {/* Recent reports + Links */}
        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Recent reports</div>
                <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Latest analysis</h3>
              </div>
              <Link to="/reports" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition">
                View all <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentReports.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400 text-center">
                  No reports yet.{" "}
                  <Link to="/reports/new" className="font-semibold text-indigo-600 hover:text-indigo-500">Create your first one →</Link>
                </div>
              ) : recentReports.map((report) => {
                const badge = getRecommendationBadge(report.hiringRecommendation.decision);
                return (
                  <Link key={report._id} to={`/reports/${report._id}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-4 transition hover:border-indigo-200 hover:bg-indigo-50/30 dark:border-slate-800 dark:hover:border-indigo-800 dark:hover:bg-slate-900 group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{report.jobRole}</div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{formatDate(report.createdAt)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-900 dark:text-white">{report.matchScore.overall}%</span>
                      <Badge variant={badge.variant}>{badge.text}</Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <ProfileLinksCard />
        </section>

        {/* Weak topics */}
        {summary?.weakTopics?.length > 0 && (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-2">Improvement queue</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Topics to work on</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {summary.weakTopics.slice(0, 6).map((topic, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 px-4 py-4">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{topic.topic}</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Avg score {Math.round(topic.averageScore || 0)}%</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}