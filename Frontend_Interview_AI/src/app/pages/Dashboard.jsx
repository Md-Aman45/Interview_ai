// // import { useEffect, useMemo, useState } from "react";
// // import { Link } from "react-router";
// // import {
// //   ArrowRightIcon,
// //   BarChart3Icon,
// //   FileTextIcon,
// //   MicIcon,
// //   SparklesIcon,
// //   TrendingUpIcon,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import { Layout } from "../components/Layout.jsx";
// // import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
// // import { ProgressBar } from "../components/ProgressBar.jsx";
// // import { Badge } from "../components/Badge.jsx";
// // import { analyticsService } from "../services/analytics.service.js";
// // import { interviewService } from "../services/interview.service.js";
// // import { getRecommendationBadge, formatDate } from "../utils/formatters.js";
// // import { useAuth } from "../context/AuthContext.jsx";

// // function MetricCard({ label, value, description, icon: Icon }) {
// //   return (
// //     <div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
// //       <div className="flex items-center justify-between">
// //         <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
// //         <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
// //           <Icon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
// //         </div>
// //       </div>
// //       <div className="mt-6 text-4xl font-semibold text-slate-900 dark:text-white">{value}</div>
// //       <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</div>
// //     </div>
// //   );
// // }

// // export function Dashboard() {
// //   const { user } = useAuth();
// //   const [summary, setSummary] = useState(null);
// //   const [usage, setUsage] = useState(null);
// //   const [reports, setReports] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     async function load() {
// //       try {
// //         const [summaryResponse, usageResponse, reportsResponse] = await Promise.all([
// //           analyticsService.getSummary(),
// //           analyticsService.getUsage(),
// //           interviewService.getAllReports(),
// //         ]);

// //         setSummary(summaryResponse);
// //         setUsage(usageResponse);
// //         setReports(reportsResponse);
// //       } catch (error) {
// //         toast.error("Could not load your dashboard.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     load();
// //   }, []);

// //   const recentReports = useMemo(() => reports.slice(0, 4), [reports]);

// //   if (loading) {
// //     return <LoadingSpinner fullScreen label="Loading dashboard" />;
// //   }

// //   return (
// //     <Layout
// //       title={`Welcome back, ${user?.username || "Operator"}`}
// //       eyebrow="Workspace overview"
// //       actions={
// //         <Link
// //           to="/reports/new"
// //           className="hidden rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 md:inline-flex"
// //         >
// //           New report
// //         </Link>
// //       }
// //     >
// //       <div className="space-y-8">
// //         <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
// //           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// //             <div className="flex flex-wrap items-center gap-3">
// //               <Badge variant="info">
// //                 <SparklesIcon className="mr-2 h-3.5 w-3.5" />
// //                 React frontend rebuild
// //               </Badge>
// //               <Badge variant="neutral">Backend-connected flow</Badge>
// //             </div>
// //             <h2 className="mt-6 max-w-2xl text-3xl font-semibold text-slate-900 dark:text-white">
// //               Reports, practice, and analytics now sit in one cleaner operational shell.
// //             </h2>
// //             <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
// //               The dashboard is now structured around actual product actions instead of decorative
// //               blocks, with a report-first workflow that lines up better with your backend.
// //             </p>

// //             <div className="mt-8 grid gap-4 sm:grid-cols-3">
// //               <Link
// //                 to="/reports/new"
// //                 className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 dark:hover:bg-slate-900"
// //               >
// //                 <FileTextIcon className="h-5 w-5 text-indigo-600" />
// //                 <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
// //                   Create report
// //                 </div>
// //                 <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
// //                   Start a new role analysis.
// //                 </div>
// //               </Link>
// //               <Link
// //                 to="/mock"
// //                 className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800 dark:hover:bg-slate-900"
// //               >
// //                 <MicIcon className="h-5 w-5 text-emerald-600" />
// //                 <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
// //                   Start practice
// //                 </div>
// //                 <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
// //                   Launch a session from a report.
// //                 </div>
// //               </Link>
// //               <Link
// //                 to="/analytics"
// //                 className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800 dark:hover:bg-slate-900"
// //               >
// //                 <BarChart3Icon className="h-5 w-5 text-sky-600" />
// //                 <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
// //                   Review analytics
// //                 </div>
// //                 <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
// //                   Track progress and weak spots.
// //                 </div>
// //               </Link>
// //             </div>
// //           </div>

// //           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// //             <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// //               Monthly usage
// //             </div>
// //             <div className="mt-6 space-y-6">
// //               <div>
// //                 <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
// //                   Reports
// //                 </div>
// //                 <ProgressBar
// //                   current={usage?.reports?.used || 0}
// //                   total={usage?.reports?.limit || 20}
// //                   color="indigo"
// //                 />
// //               </div>
// //               <div>
// //                 <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
// //                   Resume exports
// //                 </div>
// //                 <ProgressBar
// //                   current={usage?.resumes?.used || 0}
// //                   total={usage?.resumes?.limit || 15}
// //                   color="amber"
// //                 />
// //               </div>
// //               <div>
// //                 <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
// //                   Mock interviews
// //                 </div>
// //                 <ProgressBar
// //                   current={usage?.mockInterviews?.used || 0}
// //                   total={usage?.mockInterviews?.limit || 10}
// //                   color="emerald"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         <section className="grid gap-6 md:grid-cols-3">
// //           <MetricCard
// //             label="Reports created"
// //             value={reports.length}
// //             description="Total analyses stored in the workspace"
// //             icon={FileTextIcon}
// //           />
// //           <MetricCard
// //             label="Mock sessions"
// //             value={summary?.totalMockInterviews || 0}
// //             description="Completed interview runs"
// //             icon={MicIcon}
// //           />
// //           <MetricCard
// //             label="Average score"
// //             value={`${Math.round(summary?.averageScore || 0)}%`}
// //             description="Current overall interview trend"
// //             icon={TrendingUpIcon}
// //           />
// //         </section>

// //         <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
// //           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// //                   Recent reports
// //                 </div>
// //                 <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
// //                   Latest analysis output
// //                 </h3>
// //               </div>
// //               <Link
// //                 to="/reports"
// //                 className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
// //               >
// //                 View all
// //                 <ArrowRightIcon className="h-4 w-4" />
// //               </Link>
// //             </div>

// //             <div className="mt-8 space-y-4">
// //               {recentReports.length === 0 ? (
// //                 <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
// //                   No reports yet. Start with a new analysis and the rest of the workspace will fill in.
// //                 </div>
// //               ) : (
// //                 recentReports.map((report) => {
// //                   const badge = getRecommendationBadge(report.hiringRecommendation.decision);
// //                   return (
// //                     <Link
// //                       key={report._id}
// //                       to={`/reports/${report._id}`}
// //                       className="flex items-center justify-between rounded-2xl border border-slate-200 px-5 py-5 transition hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:hover:border-indigo-800 dark:hover:bg-slate-900"
// //                     >
// //                       <div>
// //                         <div className="text-base font-semibold text-slate-900 dark:text-white">
// //                           {report.jobRole}
// //                         </div>
// //                         <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
// //                           Created {formatDate(report.createdAt)}
// //                         </div>
// //                       </div>
// //                       <div className="flex items-center gap-3">
// //                         <div className="text-lg font-semibold text-slate-900 dark:text-white">
// //                           {report.matchScore.overall}%
// //                         </div>
// //                         <Badge variant={badge.variant}>{badge.text}</Badge>
// //                       </div>
// //                     </Link>
// //                   );
// //                 })
// //               )}
// //             </div>
// //           </div>

// //           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// //             <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// //               Improvement queue
// //             </div>
// //             <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
// //               Weak topics from completed sessions
// //             </h3>

// //             <div className="mt-8 space-y-4">
// //               {summary?.weakTopics?.length ? (
// //                 summary.weakTopics.slice(0, 5).map((topic, index) => (
// //                   <div
// //                     key={`${topic.topic}-${index}`}
// //                     className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900"
// //                   >
// //                     <div className="text-sm font-semibold text-slate-900 dark:text-white">
// //                       {topic.topic}
// //                     </div>
// //                     <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
// //                       Average score {Math.round(topic.averageScore || 0)}%
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
// //                   Complete a few mock sessions and the workspace will start surfacing repeated weak
// //                   areas here.
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </section>
// //       </div>
// //     </Layout>
// //   );
// // }










// // // import { useEffect, useMemo, useState } from "react";
// // // import { Link } from "react-router";
// // // import {
// // //     ArrowRightIcon,
// // //     FileTextIcon,
// // //     MicIcon,
// // //     TrendingUpIcon,
// // //     PlusIcon,
// // //     ChevronRightIcon,
// // //     ZapIcon,
// // // } from "lucide-react";
// // // import { toast } from "sonner";
// // // import { Layout } from "../components/Layout.jsx";
// // // import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
// // // import { analyticsService } from "../services/analytics.service.js";
// // // import { interviewService } from "../services/interview.service.js";
// // // import { getRecommendationBadge, formatDate } from "../utils/formatters.js";
// // // import { useAuth } from "../context/AuthContext.jsx";

// // // function ScorePill({ score }) {
// // //     const pct = Math.round(score ?? 0);
// // //     const color =
// // //         pct >= 80 ? "#22c55e" :
// // //         pct >= 60 ? "#f59e0b" : "#ef4444";
// // //     return (
// // //         <span style={{
// // //             fontVariantNumeric: "tabular-nums",
// // //             fontWeight: 700,
// // //             fontSize: 13,
// // //             color,
// // //             background: `${color}18`,
// // //             border: `1px solid ${color}30`,
// // //             borderRadius: 100,
// // //             padding: "2px 9px",
// // //             lineHeight: 1,
// // //             display: "inline-flex",
// // //             alignItems: "center",
// // //         }}>
// // //             {pct}%
// // //         </span>
// // //     );
// // // }

// // // function UsageBar({ label, used, limit, color }) {
// // //     const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
// // //     const isHigh = pct >= 85;
// // //     return (
// // //         <div>
// // //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
// // //                 <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-foreground)", textTransform: "capitalize" }}>
// // //                     {label}
// // //                 </span>
// // //                 <span style={{ fontSize: 12, fontFamily: "monospace", color: isHigh ? "#ef4444" : "var(--muted-foreground)" }}>
// // //                     {used} / {limit}
// // //                 </span>
// // //             </div>
// // //             <div style={{
// // //                 height: 4, borderRadius: 100,
// // //                 background: "var(--border)", overflow: "hidden",
// // //             }}>
// // //                 <div style={{
// // //                     height: "100%", borderRadius: 100,
// // //                     width: `${pct}%`,
// // //                     background: isHigh ? "#ef4444" : color,
// // //                     transition: "width 0.6s ease",
// // //                 }} />
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // export function Dashboard() {
// // //     const { user } = useAuth();
// // //     const [summary, setSummary] = useState(null);
// // //     const [usage, setUsage] = useState(null);
// // //     const [reports, setReports] = useState([]);
// // //     const [loading, setLoading] = useState(true);

// // //     useEffect(() => {
// // //         async function load() {
// // //             try {
// // //                 const [s, u, r] = await Promise.all([
// // //                     analyticsService.getSummary(),
// // //                     analyticsService.getUsage(),
// // //                     interviewService.getAllReports(),
// // //                 ]);
// // //                 setSummary(s);
// // //                 setUsage(u);
// // //                 setReports(r);
// // //             } catch {
// // //                 toast.error("Could not load dashboard.");
// // //             } finally {
// // //                 setLoading(false);
// // //             }
// // //         }
// // //         load();
// // //     }, []);

// // //     const recent = useMemo(() => reports.slice(0, 5), [reports]);

// // //     if (loading) return <LoadingSpinner fullScreen label="Loading dashboard" />;

// // //     const hour = new Date().getHours();
// // //     const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

// // //     return (
// // //         <Layout
// // //             title={`${greeting}, ${user?.username ?? "there"}`}
// // //             eyebrow="Workspace overview"
// // //             actions={
// // //                 <Link
// // //                     to="/reports/new"
// // //                     className="hidden md:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
// // //                 >
// // //                     <PlusIcon className="h-3.5 w-3.5" />
// // //                     New report
// // //                 </Link>
// // //             }
// // //         >
// // //             <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

// // //                 {/* ── HERO STAT ROW ── */}
// // //                 <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
// // //                     {[
// // //                         {
// // //                             label: "Reports",
// // //                             value: reports.length,
// // //                             sub: "Total analyses",
// // //                             icon: FileTextIcon,
// // //                             accent: "#6366f1",
// // //                         },
// // //                         {
// // //                             label: "Mock sessions",
// // //                             value: summary?.totalSessions ?? 0,
// // //                             sub: "Completed runs",
// // //                             icon: MicIcon,
// // //                             accent: "#10b981",
// // //                         },
// // //                         {
// // //                             label: "Avg score",
// // //                             value: summary?.overallAverageScore
// // //                                 ? `${Math.round(summary.overallAverageScore * 10)}%`
// // //                                 : "—",
// // //                             sub: "Interview performance",
// // //                             icon: TrendingUpIcon,
// // //                             accent: "#f59e0b",
// // //                         },
// // //                     ].map(({ label, value, sub, icon: Icon, accent }) => (
// // //                         <div key={label} style={{
// // //                             background: "var(--card)",
// // //                             border: "1px solid var(--border)",
// // //                             borderRadius: 20,
// // //                             padding: "22px 24px",
// // //                             position: "relative",
// // //                             overflow: "hidden",
// // //                         }}>
// // //                             <div style={{
// // //                                 position: "absolute", top: -20, right: -20,
// // //                                 width: 80, height: 80, borderRadius: "50%",
// // //                                 background: `${accent}12`,
// // //                             }} />
// // //                             <div style={{
// // //                                 width: 36, height: 36, borderRadius: 10,
// // //                                 background: `${accent}15`,
// // //                                 display: "flex", alignItems: "center", justifyContent: "center",
// // //                                 marginBottom: 14,
// // //                             }}>
// // //                                 <Icon size={16} style={{ color: accent }} />
// // //                             </div>
// // //                             <div style={{
// // //                                 fontSize: 32, fontWeight: 700,
// // //                                 color: "var(--foreground)", lineHeight: 1,
// // //                                 letterSpacing: "-0.02em", marginBottom: 4,
// // //                             }}>
// // //                                 {value}
// // //                             </div>
// // //                             <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
// // //                                 {sub}
// // //                             </div>
// // //                         </div>
// // //                     ))}
// // //                 </div>

// // //                 {/* ── MAIN CONTENT: Reports + Usage ── */}
// // //                 <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

// // //                     {/* Recent reports */}
// // //                     <div style={{
// // //                         background: "var(--card)",
// // //                         border: "1px solid var(--border)",
// // //                         borderRadius: 20,
// // //                         overflow: "hidden",
// // //                     }}>
// // //                         <div style={{
// // //                             display: "flex", alignItems: "center", justifyContent: "space-between",
// // //                             padding: "20px 24px 16px",
// // //                             borderBottom: "1px solid var(--border)",
// // //                         }}>
// // //                             <div>
// // //                                 <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 2 }}>
// // //                                     Recent
// // //                                 </div>
// // //                                 <div style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)" }}>
// // //                                     Your reports
// // //                                 </div>
// // //                             </div>
// // //                             <Link
// // //                                 to="/reports"
// // //                                 style={{
// // //                                     display: "flex", alignItems: "center", gap: 4,
// // //                                     fontSize: 12, fontWeight: 600, color: "var(--primary)",
// // //                                     textDecoration: "none",
// // //                                 }}
// // //                             >
// // //                                 View all <ChevronRightIcon size={13} />
// // //                             </Link>
// // //                         </div>

// // //                         {recent.length === 0 ? (
// // //                             <div style={{ padding: "48px 24px", textAlign: "center" }}>
// // //                                 <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
// // //                                 <div style={{ fontSize: 14, fontWeight: 500, color: "var(--foreground)", marginBottom: 6 }}>
// // //                                     No reports yet
// // //                                 </div>
// // //                                 <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 18 }}>
// // //                                     Generate your first interview report to get started
// // //                                 </div>
// // //                                 <Link
// // //                                     to="/reports/new"
// // //                                     style={{
// // //                                         display: "inline-flex", alignItems: "center", gap: 6,
// // //                                         background: "var(--primary)", color: "var(--primary-foreground)",
// // //                                         padding: "9px 18px", borderRadius: 12,
// // //                                         fontSize: 13, fontWeight: 600, textDecoration: "none",
// // //                                     }}
// // //                                 >
// // //                                     <PlusIcon size={13} /> New report
// // //                                 </Link>
// // //                             </div>
// // //                         ) : (
// // //                             <div>
// // //                                 {recent.map((r, i) => {
// // //                                     const badge = getRecommendationBadge(r.hiringRecommendation?.decision ?? r.hiringRecommendation);
// // //                                     return (
// // //                                         <Link
// // //                                             key={r._id}
// // //                                             to={`/reports/${r._id}`}
// // //                                             style={{
// // //                                                 display: "flex", alignItems: "center", gap: 16,
// // //                                                 padding: "16px 24px",
// // //                                                 borderBottom: i < recent.length - 1 ? "1px solid var(--border)" : "none",
// // //                                                 textDecoration: "none",
// // //                                                 transition: "background 0.12s",
// // //                                             }}
// // //                                             onMouseOver={e => e.currentTarget.style.background = "var(--muted)"}
// // //                                             onMouseOut={e => e.currentTarget.style.background = "transparent"}
// // //                                         >
// // //                                             <div style={{
// // //                                                 width: 40, height: 40, borderRadius: 12,
// // //                                                 background: "var(--muted)",
// // //                                                 display: "flex", alignItems: "center", justifyContent: "center",
// // //                                                 flexShrink: 0,
// // //                                             }}>
// // //                                                 <FileTextIcon size={16} style={{ color: "var(--muted-foreground)" }} />
// // //                                             </div>

// // //                                             <div style={{ flex: 1, minWidth: 0 }}>
// // //                                                 <div style={{
// // //                                                     fontSize: 14, fontWeight: 600,
// // //                                                     color: "var(--foreground)",
// // //                                                     whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
// // //                                                     marginBottom: 3,
// // //                                                 }}>
// // //                                                     {r.jobRole ?? r.title}
// // //                                                 </div>
// // //                                                 <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
// // //                                                     {formatDate(r.createdAt)}
// // //                                                 </div>
// // //                                             </div>

// // //                                             <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
// // //                                                 <ScorePill score={r.matchScore?.overall ?? r.matchScore} />
// // //                                                 <Link
// // //                                                     to={`/mock`}
// // //                                                     onClick={e => e.stopPropagation()}
// // //                                                     style={{
// // //                                                         display: "flex", alignItems: "center", gap: 5,
// // //                                                         fontSize: 12, fontWeight: 600,
// // //                                                         color: "var(--muted-foreground)",
// // //                                                         background: "var(--muted)",
// // //                                                         border: "1px solid var(--border)",
// // //                                                         borderRadius: 8, padding: "5px 10px",
// // //                                                         textDecoration: "none",
// // //                                                         transition: "color 0.12s",
// // //                                                     }}
// // //                                                 >
// // //                                                     <MicIcon size={11} /> Practice
// // //                                                 </Link>
// // //                                             </div>
// // //                                         </Link>
// // //                                     );
// // //                                 })}
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     {/* Right column */}
// // //                     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

// // //                         {/* Quick actions */}
// // //                         <div style={{
// // //                             background: "var(--card)",
// // //                             border: "1px solid var(--border)",
// // //                             borderRadius: 20,
// // //                             overflow: "hidden",
// // //                         }}>
// // //                             <div style={{ padding: "18px 20px 14px" }}>
// // //                                 <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 12 }}>
// // //                                     Quick actions
// // //                                 </div>
// // //                                 <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
// // //                                     {[
// // //                                         { label: "Create report", sub: "Upload resume + JD", to: "/reports/new", icon: "📄" },
// // //                                         { label: "Start practice", sub: "Voice mock interview", to: "/mock", icon: "🎤" },
// // //                                         { label: "View analytics", sub: "Score trends", to: "/analytics", icon: "📊" },
// // //                                     ].map(({ label, sub, to, icon }) => (
// // //                                         <Link
// // //                                             key={to}
// // //                                             to={to}
// // //                                             style={{
// // //                                                 display: "flex", alignItems: "center", gap: 12,
// // //                                                 padding: "11px 12px",
// // //                                                 borderRadius: 12,
// // //                                                 border: "1px solid var(--border)",
// // //                                                 textDecoration: "none",
// // //                                                 transition: "border-color 0.12s, background 0.12s",
// // //                                             }}
// // //                                             onMouseOver={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "var(--accent)"; }}
// // //                                             onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
// // //                                         >
// // //                                             <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
// // //                                             <div style={{ flex: 1 }}>
// // //                                                 <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{label}</div>
// // //                                                 <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{sub}</div>
// // //                                             </div>
// // //                                             <ArrowRightIcon size={13} style={{ color: "var(--muted-foreground)" }} />
// // //                                         </Link>
// // //                                     ))}
// // //                                 </div>
// // //                             </div>
// // //                         </div>

// // //                         {/* Usage */}
// // //                         {usage && (
// // //                             <div style={{
// // //                                 background: "var(--card)",
// // //                                 border: "1px solid var(--border)",
// // //                                 borderRadius: 20,
// // //                                 padding: "18px 20px",
// // //                             }}>
// // //                                 <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 16 }}>
// // //                                     Monthly usage
// // //                                 </div>
// // //                                 <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
// // //                                     {usage.map(u => (
// // //                                         <UsageBar
// // //                                             key={u.type}
// // //                                             label={u.type}
// // //                                             used={u.used}
// // //                                             limit={u.limit}
// // //                                             color={
// // //                                                 u.type === "report" ? "#6366f1" :
// // //                                                 u.type === "mock" ? "#10b981" : "#f59e0b"
// // //                                             }
// // //                                         />
// // //                                     ))}
// // //                                 </div>
// // //                                 <div style={{
// // //                                     marginTop: 14,
// // //                                     paddingTop: 12,
// // //                                     borderTop: "1px solid var(--border)",
// // //                                     fontSize: 11,
// // //                                     color: "var(--muted-foreground)",
// // //                                     display: "flex", alignItems: "center", gap: 4,
// // //                                 }}>
// // //                                     <ZapIcon size={11} />
// // //                                     Resets on 1st of next month
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         </Layout>
// // //     );
// // // }
















// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router";
// import {
//   ArrowRightIcon, BarChart3Icon, FileTextIcon, MicIcon,
//   SparklesIcon, TrendingUpIcon, GithubIcon, LinkedinIcon, ExternalLinkIcon,
// } from "lucide-react";
// import { toast } from "sonner";
// import { Layout } from "../components/Layout.jsx";
// import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
// import { ProgressBar } from "../components/ProgressBar.jsx";
// import { Badge } from "../components/Badge.jsx";
// import { analyticsService } from "../services/analytics.service.js";
// import { interviewService } from "../services/interview.service.js";
// import { getRecommendationBadge, formatDate } from "../utils/formatters.js";
// import { useAuth } from "../context/AuthContext.jsx";

// function MetricCard({ label, value, description, icon: Icon, color = "indigo" }) {
//   const colors = {
//     indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
//     emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
//     sky: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400",
//   };
//   return (
//     <div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
//       <div className="flex items-center justify-between">
//         <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
//         <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${colors[color]}`}>
//           <Icon className="h-5 w-5" />
//         </div>
//       </div>
//       <div className="mt-5 text-4xl font-semibold text-slate-900 dark:text-white">{value}</div>
//       <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</div>
//     </div>
//   );
// }

// // Resume/profile links card
// function ProfileLinksCard() {
//   const links = [
//     { label: "GitHub", icon: "🐙", href: "https://github.com/Md-Aman45", sub: "Md-Aman45" },
//     { label: "LinkedIn", icon: "💼", href: "https://linkedin.com/in/md-aman", sub: "md-aman" },
//     { label: "Portfolio", icon: "🌐", href: "https://md-aman.dev", sub: "md-aman.dev" },
//     { label: "LeetCode", icon: "🧩", href: "https://leetcode.com/md-aman", sub: "md-aman" },
//   ];
//   return (
//     <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
//       <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-2">
//         Your profiles
//       </div>
//       <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Resume links</h3>
//       <div className="space-y-3">
//         {links.map(link => (
//           <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
//             className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 transition hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 group"
//           >
//             <div className="flex items-center gap-3">
//               <span className="text-lg">{link.icon}</span>
//               <div>
//                 <div className="text-sm font-semibold text-slate-900 dark:text-white">{link.label}</div>
//                 <div className="text-xs text-slate-400">{link.sub}</div>
//               </div>
//             </div>
//             <ExternalLinkIcon className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-500 transition" />
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }

// export function Dashboard() {
//   const { user } = useAuth();
//   const [summary, setSummary] = useState(null);
//   const [usage, setUsage] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       try {
//         const [summaryRes, usageRes, reportsRes] = await Promise.all([
//           analyticsService.getSummary(),
//           analyticsService.getUsage(),
//           interviewService.getAllReports(),
//         ]);
//         setSummary(summaryRes); setUsage(usageRes); setReports(reportsRes);
//       } catch {
//         toast.error("Could not load your dashboard.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   const recentReports = useMemo(() => reports.slice(0, 4), [reports]);

//   if (loading) return <LoadingSpinner fullScreen label="Loading dashboard" />;

//   return (
//     <Layout
//       title={`Welcome back, ${user?.username || "Operator"}`}
//       eyebrow="Workspace overview"
//       actions={
//         <Link to="/reports/new" className="hidden rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 md:inline-flex">
//           New report
//         </Link>
//       }
//     >
//       <div className="space-y-6">

//         {/* Hero + Usage */}
//         <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
//           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
//             <div className="flex flex-wrap items-center gap-3 mb-6">
//               <Badge variant="info"><SparklesIcon className="mr-1.5 h-3 w-3" />InterviewAI</Badge>
//               <Badge variant="neutral">AI-powered prep</Badge>
//             </div>
//             <h2 className="max-w-xl text-3xl font-semibold text-slate-900 dark:text-white leading-tight">
//               Your AI interview coach, always ready.
//             </h2>
//             <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
//               Upload your resume, get a job match score, practice voice interviews, and track your progress — all from one workspace.
//             </p>
//             <div className="mt-8 grid gap-4 sm:grid-cols-3">
//               {[
//                 { to: "/reports/new", icon: FileTextIcon, label: "Create report", desc: "Analyze a new role", color: "hover:border-indigo-300 hover:bg-indigo-50 dark:hover:border-indigo-800", iconColor: "text-indigo-600" },
//                 { to: "/mock", icon: MicIcon, label: "Start practice", desc: "Voice mock interview", color: "hover:border-emerald-300 hover:bg-emerald-50 dark:hover:border-emerald-800", iconColor: "text-emerald-600" },
//                 { to: "/analytics", icon: BarChart3Icon, label: "Analytics", desc: "Track performance", color: "hover:border-sky-300 hover:bg-sky-50 dark:hover:border-sky-800", iconColor: "text-sky-600" },
//               ].map(item => (
//                 <Link key={item.to} to={item.to} className={`rounded-2xl border border-slate-200 bg-slate-50 p-5 transition dark:border-slate-800 dark:bg-slate-900 ${item.color}`}>
//                   <item.icon className={`h-5 w-5 ${item.iconColor}`} />
//                   <div className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{item.label}</div>
//                   <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Usage */}
//           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
//             <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-6">Monthly usage</div>
//             <div className="space-y-6">
//               {[
//                 { label: "Reports", current: usage?.reports?.used || 0, total: usage?.reports?.limit || 20, color: "indigo" },
//                 { label: "Resume exports", current: usage?.resumes?.used || 0, total: usage?.resumes?.limit || 15, color: "amber" },
//                 { label: "Mock interviews", current: usage?.mockInterviews?.used || 0, total: usage?.mockInterviews?.limit || 10, color: "emerald" },
//               ].map(item => (
//                 <div key={item.label}>
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</span>
//                     <span className="text-xs text-slate-500 dark:text-slate-400">{item.current}/{item.total}</span>
//                   </div>
//                   <ProgressBar current={item.current} total={item.total} color={item.color} />
//                 </div>
//               ))}
//             </div>
//             {usage?.resetDate && (
//               <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
//                 Resets on {formatDate(usage.resetDate)}
//               </p>
//             )}
//           </div>
//         </section>

//         {/* Metrics */}
//         <section className="grid gap-6 md:grid-cols-3">
//           <MetricCard label="Reports created" value={reports.length} description="Total analyses in workspace" icon={FileTextIcon} color="indigo" />
//           <MetricCard label="Mock sessions" value={summary?.totalMockInterviews || 0} description="Completed interview runs" icon={MicIcon} color="emerald" />
//           <MetricCard label="Average score" value={`${Math.round(summary?.averageScore || 0)}%`} description="Overall interview trend" icon={TrendingUpIcon} color="sky" />
//         </section>

//         {/* Recent reports + Links */}
//         <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
//           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Recent reports</div>
//                 <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Latest analysis</h3>
//               </div>
//               <Link to="/reports" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition">
//                 View all <ArrowRightIcon className="h-4 w-4" />
//               </Link>
//             </div>
//             <div className="space-y-3">
//               {recentReports.length === 0 ? (
//                 <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400 text-center">
//                   No reports yet.{" "}
//                   <Link to="/reports/new" className="font-semibold text-indigo-600 hover:text-indigo-500">Create your first one →</Link>
//                 </div>
//               ) : recentReports.map((report) => {
//                 const badge = getRecommendationBadge(report.hiringRecommendation.decision);
//                 return (
//                   <Link key={report._id} to={`/reports/${report._id}`}
//                     className="flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-4 transition hover:border-indigo-200 hover:bg-indigo-50/30 dark:border-slate-800 dark:hover:border-indigo-800 dark:hover:bg-slate-900 group"
//                   >
//                     <div>
//                       <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{report.jobRole}</div>
//                       <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{formatDate(report.createdAt)}</div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <span className="text-base font-semibold text-slate-900 dark:text-white">{report.matchScore.overall}%</span>
//                       <Badge variant={badge.variant}>{badge.text}</Badge>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>

//           <ProfileLinksCard />
//         </section>

//         {/* Weak topics */}
//         {summary?.weakTopics?.length > 0 && (
//           <section className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
//             <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-2">Improvement queue</div>
//             <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Topics to work on</h3>
//             <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//               {summary.weakTopics.slice(0, 6).map((topic, i) => (
//                 <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 px-4 py-4">
//                   <div className="text-sm font-semibold text-slate-900 dark:text-white">{topic.topic}</div>
//                   <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Avg score {Math.round(topic.averageScore || 0)}%</div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}
//       </div>
//     </Layout>
//   );
// }























// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router";
// import {
//   ArrowRightIcon,
//   BarChart3Icon,
//   FileTextIcon,
//   MicIcon,
//   SparklesIcon,
//   TrendingUpIcon,
// } from "lucide-react";
// import { toast } from "sonner";
// import { Layout } from "../components/Layout.jsx";
// import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
// import { ProgressBar } from "../components/ProgressBar.jsx";
// import { Badge } from "../components/Badge.jsx";
// import { analyticsService } from "../services/analytics.service.js";
// import { interviewService } from "../services/interview.service.js";
// import { getRecommendationBadge, formatDate } from "../utils/formatters.js";
// import { useAuth } from "../context/AuthContext.jsx";

// function MetricCard({ label, value, description, icon: Icon }) {
//   return (
//     <div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
//       <div className="flex items-center justify-between">
//         <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
//         <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
//           <Icon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
//         </div>
//       </div>
//       <div className="mt-6 text-4xl font-semibold text-slate-900 dark:text-white">{value}</div>
//       <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</div>
//     </div>
//   );
// }

// export function Dashboard() {
//   const { user } = useAuth();
//   const [summary, setSummary] = useState(null);
//   const [usage, setUsage] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       try {
//         const [summaryResponse, usageResponse, reportsResponse] = await Promise.all([
//           analyticsService.getSummary(),
//           analyticsService.getUsage(),
//           interviewService.getAllReports(),
//         ]);

//         setSummary(summaryResponse);
//         setUsage(usageResponse);
//         setReports(reportsResponse);
//       } catch (error) {
//         toast.error("Could not load your dashboard.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, []);

//   const recentReports = useMemo(() => reports.slice(0, 4), [reports]);

//   if (loading) {
//     return <LoadingSpinner fullScreen label="Loading dashboard" />;
//   }

//   return (
//     <Layout
//       title={`Welcome back, ${user?.username || "Operator"}`}
//       eyebrow="Workspace overview"
//       actions={
//         <Link
//           to="/reports/new"
//           className="hidden rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 md:inline-flex"
//         >
//           New report
//         </Link>
//       }
//     >
//       <div className="space-y-8">
//         <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
//           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
//             <div className="flex flex-wrap items-center gap-3">
//               <Badge variant="info">
//                 <SparklesIcon className="mr-2 h-3.5 w-3.5" />
//                 React frontend rebuild
//               </Badge>
//               <Badge variant="neutral">Backend-connected flow</Badge>
//             </div>
//             <h2 className="mt-6 max-w-2xl text-3xl font-semibold text-slate-900 dark:text-white">
//               Reports, practice, and analytics now sit in one cleaner operational shell.
//             </h2>
//             <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
//               The dashboard is now structured around actual product actions instead of decorative
//               blocks, with a report-first workflow that lines up better with your backend.
//             </p>

//             <div className="mt-8 grid gap-4 sm:grid-cols-3">
//               <Link
//                 to="/reports/new"
//                 className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 dark:hover:bg-slate-900"
//               >
//                 <FileTextIcon className="h-5 w-5 text-indigo-600" />
//                 <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
//                   Create report
//                 </div>
//                 <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                   Start a new role analysis.
//                 </div>
//               </Link>
//               <Link
//                 to="/mock"
//                 className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800 dark:hover:bg-slate-900"
//               >
//                 <MicIcon className="h-5 w-5 text-emerald-600" />
//                 <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
//                   Start practice
//                 </div>
//                 <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                   Launch a session from a report.
//                 </div>
//               </Link>
//               <Link
//                 to="/analytics"
//                 className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800 dark:hover:bg-slate-900"
//               >
//                 <BarChart3Icon className="h-5 w-5 text-sky-600" />
//                 <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
//                   Review analytics
//                 </div>
//                 <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                   Track progress and weak spots.
//                 </div>
//               </Link>
//             </div>
//           </div>

//           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
//             <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
//               Monthly usage
//             </div>
//             <div className="mt-6 space-y-6">
//               <div>
//                 <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
//                   Reports
//                 </div>
//                 <ProgressBar
//                   current={usage?.reports?.used || 0}
//                   total={usage?.reports?.limit || 20}
//                   color="indigo"
//                 />
//               </div>
//               <div>
//                 <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
//                   Resume exports
//                 </div>
//                 <ProgressBar
//                   current={usage?.resumes?.used || 0}
//                   total={usage?.resumes?.limit || 15}
//                   color="amber"
//                 />
//               </div>
//               <div>
//                 <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
//                   Mock interviews
//                 </div>
//                 <ProgressBar
//                   current={usage?.mockInterviews?.used || 0}
//                   total={usage?.mockInterviews?.limit || 10}
//                   color="emerald"
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="grid gap-6 md:grid-cols-3">
//           <MetricCard
//             label="Reports created"
//             value={reports.length}
//             description="Total analyses stored in the workspace"
//             icon={FileTextIcon}
//           />
//           <MetricCard
//             label="Mock sessions"
//             value={summary?.totalMockInterviews || 0}
//             description="Completed interview runs"
//             icon={MicIcon}
//           />
//           <MetricCard
//             label="Average score"
//             value={`${Math.round(summary?.averageScore || 0)}%`}
//             description="Current overall interview trend"
//             icon={TrendingUpIcon}
//           />
//         </section>

//         <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
//           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
//                   Recent reports
//                 </div>
//                 <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
//                   Latest analysis output
//                 </h3>
//               </div>
//               <Link
//                 to="/reports"
//                 className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
//               >
//                 View all
//                 <ArrowRightIcon className="h-4 w-4" />
//               </Link>
//             </div>

//             <div className="mt-8 space-y-4">
//               {recentReports.length === 0 ? (
//                 <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
//                   No reports yet. Start with a new analysis and the rest of the workspace will fill in.
//                 </div>
//               ) : (
//                 recentReports.map((report) => {
//                   const badge = getRecommendationBadge(report.hiringRecommendation.decision);
//                   return (
//                     <Link
//                       key={report._id}
//                       to={`/reports/${report._id}`}
//                       className="flex items-center justify-between rounded-2xl border border-slate-200 px-5 py-5 transition hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:hover:border-indigo-800 dark:hover:bg-slate-900"
//                     >
//                       <div>
//                         <div className="text-base font-semibold text-slate-900 dark:text-white">
//                           {report.jobRole}
//                         </div>
//                         <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                           Created {formatDate(report.createdAt)}
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <div className="text-lg font-semibold text-slate-900 dark:text-white">
//                           {report.matchScore.overall}%
//                         </div>
//                         <Badge variant={badge.variant}>{badge.text}</Badge>
//                       </div>
//                     </Link>
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
//             <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
//               Improvement queue
//             </div>
//             <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
//               Weak topics from completed sessions
//             </h3>

//             <div className="mt-8 space-y-4">
//               {summary?.weakTopics?.length ? (
//                 summary.weakTopics.slice(0, 5).map((topic, index) => (
//                   <div
//                     key={`${topic.topic}-${index}`}
//                     className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900"
//                   >
//                     <div className="text-sm font-semibold text-slate-900 dark:text-white">
//                       {topic.topic}
//                     </div>
//                     <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
//                       Average score {Math.round(topic.averageScore || 0)}%
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
//                   Complete a few mock sessions and the workspace will start surfacing repeated weak
//                   areas here.
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>
//       </div>
//     </Layout>
//   );
// }










// // import { useEffect, useMemo, useState } from "react";
// // import { Link } from "react-router";
// // import {
// //     ArrowRightIcon,
// //     FileTextIcon,
// //     MicIcon,
// //     TrendingUpIcon,
// //     PlusIcon,
// //     ChevronRightIcon,
// //     ZapIcon,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import { Layout } from "../components/Layout.jsx";
// // import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
// // import { analyticsService } from "../services/analytics.service.js";
// // import { interviewService } from "../services/interview.service.js";
// // import { getRecommendationBadge, formatDate } from "../utils/formatters.js";
// // import { useAuth } from "../context/AuthContext.jsx";

// // function ScorePill({ score }) {
// //     const pct = Math.round(score ?? 0);
// //     const color =
// //         pct >= 80 ? "#22c55e" :
// //         pct >= 60 ? "#f59e0b" : "#ef4444";
// //     return (
// //         <span style={{
// //             fontVariantNumeric: "tabular-nums",
// //             fontWeight: 700,
// //             fontSize: 13,
// //             color,
// //             background: `${color}18`,
// //             border: `1px solid ${color}30`,
// //             borderRadius: 100,
// //             padding: "2px 9px",
// //             lineHeight: 1,
// //             display: "inline-flex",
// //             alignItems: "center",
// //         }}>
// //             {pct}%
// //         </span>
// //     );
// // }

// // function UsageBar({ label, used, limit, color }) {
// //     const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
// //     const isHigh = pct >= 85;
// //     return (
// //         <div>
// //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
// //                 <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-foreground)", textTransform: "capitalize" }}>
// //                     {label}
// //                 </span>
// //                 <span style={{ fontSize: 12, fontFamily: "monospace", color: isHigh ? "#ef4444" : "var(--muted-foreground)" }}>
// //                     {used} / {limit}
// //                 </span>
// //             </div>
// //             <div style={{
// //                 height: 4, borderRadius: 100,
// //                 background: "var(--border)", overflow: "hidden",
// //             }}>
// //                 <div style={{
// //                     height: "100%", borderRadius: 100,
// //                     width: `${pct}%`,
// //                     background: isHigh ? "#ef4444" : color,
// //                     transition: "width 0.6s ease",
// //                 }} />
// //             </div>
// //         </div>
// //     );
// // }

// // export function Dashboard() {
// //     const { user } = useAuth();
// //     const [summary, setSummary] = useState(null);
// //     const [usage, setUsage] = useState(null);
// //     const [reports, setReports] = useState([]);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         async function load() {
// //             try {
// //                 const [s, u, r] = await Promise.all([
// //                     analyticsService.getSummary(),
// //                     analyticsService.getUsage(),
// //                     interviewService.getAllReports(),
// //                 ]);
// //                 setSummary(s);
// //                 setUsage(u);
// //                 setReports(r);
// //             } catch {
// //                 toast.error("Could not load dashboard.");
// //             } finally {
// //                 setLoading(false);
// //             }
// //         }
// //         load();
// //     }, []);

// //     const recent = useMemo(() => reports.slice(0, 5), [reports]);

// //     if (loading) return <LoadingSpinner fullScreen label="Loading dashboard" />;

// //     const hour = new Date().getHours();
// //     const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

// //     return (
// //         <Layout
// //             title={`${greeting}, ${user?.username ?? "there"}`}
// //             eyebrow="Workspace overview"
// //             actions={
// //                 <Link
// //                     to="/reports/new"
// //                     className="hidden md:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
// //                 >
// //                     <PlusIcon className="h-3.5 w-3.5" />
// //                     New report
// //                 </Link>
// //             }
// //         >
// //             <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

// //                 {/* ── HERO STAT ROW ── */}
// //                 <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
// //                     {[
// //                         {
// //                             label: "Reports",
// //                             value: reports.length,
// //                             sub: "Total analyses",
// //                             icon: FileTextIcon,
// //                             accent: "#6366f1",
// //                         },
// //                         {
// //                             label: "Mock sessions",
// //                             value: summary?.totalSessions ?? 0,
// //                             sub: "Completed runs",
// //                             icon: MicIcon,
// //                             accent: "#10b981",
// //                         },
// //                         {
// //                             label: "Avg score",
// //                             value: summary?.overallAverageScore
// //                                 ? `${Math.round(summary.overallAverageScore * 10)}%`
// //                                 : "—",
// //                             sub: "Interview performance",
// //                             icon: TrendingUpIcon,
// //                             accent: "#f59e0b",
// //                         },
// //                     ].map(({ label, value, sub, icon: Icon, accent }) => (
// //                         <div key={label} style={{
// //                             background: "var(--card)",
// //                             border: "1px solid var(--border)",
// //                             borderRadius: 20,
// //                             padding: "22px 24px",
// //                             position: "relative",
// //                             overflow: "hidden",
// //                         }}>
// //                             <div style={{
// //                                 position: "absolute", top: -20, right: -20,
// //                                 width: 80, height: 80, borderRadius: "50%",
// //                                 background: `${accent}12`,
// //                             }} />
// //                             <div style={{
// //                                 width: 36, height: 36, borderRadius: 10,
// //                                 background: `${accent}15`,
// //                                 display: "flex", alignItems: "center", justifyContent: "center",
// //                                 marginBottom: 14,
// //                             }}>
// //                                 <Icon size={16} style={{ color: accent }} />
// //                             </div>
// //                             <div style={{
// //                                 fontSize: 32, fontWeight: 700,
// //                                 color: "var(--foreground)", lineHeight: 1,
// //                                 letterSpacing: "-0.02em", marginBottom: 4,
// //                             }}>
// //                                 {value}
// //                             </div>
// //                             <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
// //                                 {sub}
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>

// //                 {/* ── MAIN CONTENT: Reports + Usage ── */}
// //                 <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

// //                     {/* Recent reports */}
// //                     <div style={{
// //                         background: "var(--card)",
// //                         border: "1px solid var(--border)",
// //                         borderRadius: 20,
// //                         overflow: "hidden",
// //                     }}>
// //                         <div style={{
// //                             display: "flex", alignItems: "center", justifyContent: "space-between",
// //                             padding: "20px 24px 16px",
// //                             borderBottom: "1px solid var(--border)",
// //                         }}>
// //                             <div>
// //                                 <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 2 }}>
// //                                     Recent
// //                                 </div>
// //                                 <div style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)" }}>
// //                                     Your reports
// //                                 </div>
// //                             </div>
// //                             <Link
// //                                 to="/reports"
// //                                 style={{
// //                                     display: "flex", alignItems: "center", gap: 4,
// //                                     fontSize: 12, fontWeight: 600, color: "var(--primary)",
// //                                     textDecoration: "none",
// //                                 }}
// //                             >
// //                                 View all <ChevronRightIcon size={13} />
// //                             </Link>
// //                         </div>

// //                         {recent.length === 0 ? (
// //                             <div style={{ padding: "48px 24px", textAlign: "center" }}>
// //                                 <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
// //                                 <div style={{ fontSize: 14, fontWeight: 500, color: "var(--foreground)", marginBottom: 6 }}>
// //                                     No reports yet
// //                                 </div>
// //                                 <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 18 }}>
// //                                     Generate your first interview report to get started
// //                                 </div>
// //                                 <Link
// //                                     to="/reports/new"
// //                                     style={{
// //                                         display: "inline-flex", alignItems: "center", gap: 6,
// //                                         background: "var(--primary)", color: "var(--primary-foreground)",
// //                                         padding: "9px 18px", borderRadius: 12,
// //                                         fontSize: 13, fontWeight: 600, textDecoration: "none",
// //                                     }}
// //                                 >
// //                                     <PlusIcon size={13} /> New report
// //                                 </Link>
// //                             </div>
// //                         ) : (
// //                             <div>
// //                                 {recent.map((r, i) => {
// //                                     const badge = getRecommendationBadge(r.hiringRecommendation?.decision ?? r.hiringRecommendation);
// //                                     return (
// //                                         <Link
// //                                             key={r._id}
// //                                             to={`/reports/${r._id}`}
// //                                             style={{
// //                                                 display: "flex", alignItems: "center", gap: 16,
// //                                                 padding: "16px 24px",
// //                                                 borderBottom: i < recent.length - 1 ? "1px solid var(--border)" : "none",
// //                                                 textDecoration: "none",
// //                                                 transition: "background 0.12s",
// //                                             }}
// //                                             onMouseOver={e => e.currentTarget.style.background = "var(--muted)"}
// //                                             onMouseOut={e => e.currentTarget.style.background = "transparent"}
// //                                         >
// //                                             <div style={{
// //                                                 width: 40, height: 40, borderRadius: 12,
// //                                                 background: "var(--muted)",
// //                                                 display: "flex", alignItems: "center", justifyContent: "center",
// //                                                 flexShrink: 0,
// //                                             }}>
// //                                                 <FileTextIcon size={16} style={{ color: "var(--muted-foreground)" }} />
// //                                             </div>

// //                                             <div style={{ flex: 1, minWidth: 0 }}>
// //                                                 <div style={{
// //                                                     fontSize: 14, fontWeight: 600,
// //                                                     color: "var(--foreground)",
// //                                                     whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
// //                                                     marginBottom: 3,
// //                                                 }}>
// //                                                     {r.jobRole ?? r.title}
// //                                                 </div>
// //                                                 <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
// //                                                     {formatDate(r.createdAt)}
// //                                                 </div>
// //                                             </div>

// //                                             <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
// //                                                 <ScorePill score={r.matchScore?.overall ?? r.matchScore} />
// //                                                 <Link
// //                                                     to={`/mock`}
// //                                                     onClick={e => e.stopPropagation()}
// //                                                     style={{
// //                                                         display: "flex", alignItems: "center", gap: 5,
// //                                                         fontSize: 12, fontWeight: 600,
// //                                                         color: "var(--muted-foreground)",
// //                                                         background: "var(--muted)",
// //                                                         border: "1px solid var(--border)",
// //                                                         borderRadius: 8, padding: "5px 10px",
// //                                                         textDecoration: "none",
// //                                                         transition: "color 0.12s",
// //                                                     }}
// //                                                 >
// //                                                     <MicIcon size={11} /> Practice
// //                                                 </Link>
// //                                             </div>
// //                                         </Link>
// //                                     );
// //                                 })}
// //                             </div>
// //                         )}
// //                     </div>

// //                     {/* Right column */}
// //                     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

// //                         {/* Quick actions */}
// //                         <div style={{
// //                             background: "var(--card)",
// //                             border: "1px solid var(--border)",
// //                             borderRadius: 20,
// //                             overflow: "hidden",
// //                         }}>
// //                             <div style={{ padding: "18px 20px 14px" }}>
// //                                 <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 12 }}>
// //                                     Quick actions
// //                                 </div>
// //                                 <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
// //                                     {[
// //                                         { label: "Create report", sub: "Upload resume + JD", to: "/reports/new", icon: "📄" },
// //                                         { label: "Start practice", sub: "Voice mock interview", to: "/mock", icon: "🎤" },
// //                                         { label: "View analytics", sub: "Score trends", to: "/analytics", icon: "📊" },
// //                                     ].map(({ label, sub, to, icon }) => (
// //                                         <Link
// //                                             key={to}
// //                                             to={to}
// //                                             style={{
// //                                                 display: "flex", alignItems: "center", gap: 12,
// //                                                 padding: "11px 12px",
// //                                                 borderRadius: 12,
// //                                                 border: "1px solid var(--border)",
// //                                                 textDecoration: "none",
// //                                                 transition: "border-color 0.12s, background 0.12s",
// //                                             }}
// //                                             onMouseOver={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "var(--accent)"; }}
// //                                             onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
// //                                         >
// //                                             <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
// //                                             <div style={{ flex: 1 }}>
// //                                                 <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{label}</div>
// //                                                 <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{sub}</div>
// //                                             </div>
// //                                             <ArrowRightIcon size={13} style={{ color: "var(--muted-foreground)" }} />
// //                                         </Link>
// //                                     ))}
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* Usage */}
// //                         {usage && (
// //                             <div style={{
// //                                 background: "var(--card)",
// //                                 border: "1px solid var(--border)",
// //                                 borderRadius: 20,
// //                                 padding: "18px 20px",
// //                             }}>
// //                                 <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 16 }}>
// //                                     Monthly usage
// //                                 </div>
// //                                 <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
// //                                     {usage.map(u => (
// //                                         <UsageBar
// //                                             key={u.type}
// //                                             label={u.type}
// //                                             used={u.used}
// //                                             limit={u.limit}
// //                                             color={
// //                                                 u.type === "report" ? "#6366f1" :
// //                                                 u.type === "mock" ? "#10b981" : "#f59e0b"
// //                                             }
// //                                         />
// //                                     ))}
// //                                 </div>
// //                                 <div style={{
// //                                     marginTop: 14,
// //                                     paddingTop: 12,
// //                                     borderTop: "1px solid var(--border)",
// //                                     fontSize: 11,
// //                                     color: "var(--muted-foreground)",
// //                                     display: "flex", alignItems: "center", gap: 4,
// //                                 }}>
// //                                     <ZapIcon size={11} />
// //                                     Resets on 1st of next month
// //                                 </div>
// //                             </div>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>
// //         </Layout>
// //     );
// // }
















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
const LINK_DEFS = [
  { key: "github",    label: "GitHub",     icon: "🐙", placeholder: "https://github.com/username" },
  { key: "linkedin",  label: "LinkedIn",   icon: "💼", placeholder: "https://linkedin.com/in/username" },
  { key: "portfolio", label: "Portfolio",  icon: "🌐", placeholder: "https://yoursite.com" },
  { key: "leetcode",  label: "LeetCode",   icon: "🧩", placeholder: "https://leetcode.com/username" },
  { key: "gfg",       label: "GeeksforGeeks", icon: "🟢", placeholder: "https://geeksforgeeks.org/user/username" },
];

const STORAGE_KEY = "interviewai_profile_links";

function loadLinks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function ProfileLinksCard() {
  const [links, setLinks] = useState(loadLinks);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});

  function openEdit() { setDraft({ ...links }); setEditing(true); }
  function save() {
    setLinks(draft);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setEditing(false);
  }

  const filledLinks = LINK_DEFS.filter(d => links[d.key]);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-1">Your profiles</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Resume links</h3>
        </div>
        <button onClick={openEdit}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 py-1.5">
          {filledLinks.length === 0 ? "Add links" : "Edit"}
        </button>
      </div>

      {filledLinks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center">
          <div className="text-2xl mb-2">🔗</div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Add your GitHub, LinkedIn, and portfolio links so they appear here.</p>
          <button onClick={openEdit} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition">
            Add profile links →
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filledLinks.map(def => (
            <a key={def.key} href={links[def.key]} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 transition hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{def.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{def.label}</div>
                  <div className="text-xs text-slate-400 truncate max-w-[140px]">{links[def.key].replace(/^https?:\/\/(www\.)?/, '')}</div>
                </div>
              </div>
              <ExternalLinkIcon className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-500 transition flex-shrink-0" />
            </a>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-7 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Edit profile links</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Your links are saved locally in this browser.</p>
            <div className="space-y-3 mb-6">
              {LINK_DEFS.map(def => (
                <div key={def.key}>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>{def.icon}</span> {def.label}
                  </label>
                  <input
                    type="url"
                    value={draft[def.key] || ""}
                    onChange={e => setDraft(d => ({ ...d, [def.key]: e.target.value }))}
                    placeholder={def.placeholder}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition dark:text-white placeholder:text-slate-400"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
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