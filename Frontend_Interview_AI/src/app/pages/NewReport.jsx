import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon, FileTextIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "../components/Layout.jsx";
import { interviewService } from "../services/interview.service.js";
import { validateFile } from "../utils/validation.js";

export function NewReport() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fileLabel = useMemo(() => {
    if (!resume) {
      return "Upload your PDF resume";
    }
    return `${resume.name} • ${Math.round(resume.size / 1024)} KB`;
  }, [resume]);

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0];
    const validation = validateFile(nextFile);

    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setResume(nextFile);
    toast.success("Resume attached.");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!resume) {
      toast.error("Attach a PDF resume first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);
      formData.append("selfDescription", selfDescription);

      const data = await interviewService.generateReport(formData);
      toast.success("Report created.");
      navigate(`/reports/${data.report._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Report generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="New report" eyebrow="Analysis workflow">
      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => navigate("/reports")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to reports
            </button>

            <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="resume-upload" className="block cursor-pointer">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-indigo-600 shadow-sm dark:bg-slate-950">
                  <UploadIcon className="h-7 w-7" />
                </div>
                <div className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
                  {fileLabel}
                </div>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  The backend expects a text-based PDF under 5MB.
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Job description</div>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              rows={10}
              required
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
              placeholder="Paste the target role description, requirements, and the technical signals you want the AI to optimize against."
            />
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Candidate positioning</div>
            <textarea
              value={selfDescription}
              onChange={(event) => setSelfDescription(event.target.value)}
              rows={7}
              required
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
              placeholder="Summarize strengths, goals, domains, and the kind of story you want the report to reflect."
            />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
              <FileTextIcon className="h-5 w-5" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-slate-900 dark:text-white">
              Generate a structured report
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              This flow creates the analysis artifact that powers reports, resume export, and mock
              interviews later in the workspace.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating report..." : "Generate report"}
            </button>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Output
            </div>
            <ul className="mt-5 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li>Role match score and breakdown</li>
              <li>Technical and behavioral interview questions</li>
              <li>Skill gap analysis and 5-day preparation plan</li>
              <li>Resume export aligned to the report context</li>
            </ul>
          </div>
        </aside>
      </form>
    </Layout>
  );
}










// import { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router";
// import {
//     ArrowLeftIcon,
//     DownloadIcon,
//     MicIcon,
//     ChevronDownIcon,
//     ChevronUpIcon,
//     CheckCircleIcon,
//     AlertCircleIcon,
//     InfoIcon,
// } from "lucide-react";
// import { toast } from "sonner";
// import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
// import { Layout } from "../components/Layout.jsx";
// import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
// import { interviewService } from "../services/interview.service.js";
// import { getRecommendationBadge } from "../utils/formatters.js";

// function Section({ title, children }) {
//     return (
//         <div style={{ marginBottom: 32 }}>
//             <div style={{
//                 fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
//                 textTransform: "uppercase", color: "var(--muted-foreground)",
//                 marginBottom: 14,
//             }}>
//                 {title}
//             </div>
//             {children}
//         </div>
//     );
// }

// function ScoreBar({ label, value }) {
//     const pct = Math.round(value ?? 0);
//     const color = pct >= 80 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444";
//     return (
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{ fontSize: 13, color: "var(--muted-foreground)", width: 120, flexShrink: 0 }}>
//                 {label}
//             </div>
//             <div style={{ flex: 1, height: 6, borderRadius: 100, background: "var(--border)", overflow: "hidden" }}>
//                 <div style={{
//                     height: "100%", borderRadius: 100,
//                     width: `${pct}%`, background: color,
//                     transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
//                 }} />
//             </div>
//             <div style={{
//                 fontSize: 13, fontWeight: 700, width: 38, textAlign: "right",
//                 color,
//             }}>
//                 {pct}%
//             </div>
//         </div>
//     );
// }

// function QuestionCard({ q, index, type }) {
//     const [open, setOpen] = useState(false);
//     const accent = type === "technical" ? "#6366f1" : "#f59e0b";
//     const label = type === "technical" ? `Q${index + 1}` : `B${index + 1}`;

//     return (
//         <div style={{
//             border: "1px solid var(--border)",
//             borderRadius: 16,
//             overflow: "hidden",
//             transition: "border-color 0.15s",
//         }}>
//             <button
//                 type="button"
//                 onClick={() => setOpen(v => !v)}
//                 style={{
//                     width: "100%", padding: "16px 20px",
//                     display: "flex", alignItems: "flex-start", gap: 14,
//                     background: "none", border: "none", cursor: "pointer",
//                     textAlign: "left",
//                 }}
//             >
//                 <div style={{
//                     width: 28, height: 28, borderRadius: 8, flexShrink: 0,
//                     background: `${accent}15`,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontSize: 11, fontWeight: 700, color: accent,
//                 }}>
//                     {label}
//                 </div>
//                 <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "var(--foreground)", lineHeight: 1.55 }}>
//                     {q.question}
//                 </div>
//                 <div style={{ flexShrink: 0, color: "var(--muted-foreground)", marginTop: 2 }}>
//                     {open ? <ChevronUpIcon size={15} /> : <ChevronDownIcon size={15} />}
//                 </div>
//             </button>

//             {open && (
//                 <div style={{
//                     padding: "0 20px 18px 62px",
//                     borderTop: "1px solid var(--border)",
//                     paddingTop: 14,
//                 }}>
//                     {q.intention && (
//                         <div style={{
//                             display: "flex", gap: 8, marginBottom: 12,
//                             padding: "8px 12px", borderRadius: 10,
//                             background: "var(--muted)", borderLeft: `3px solid ${accent}`,
//                         }}>
//                             <InfoIcon size={13} style={{ color: accent, marginTop: 2, flexShrink: 0 }} />
//                             <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
//                                 <strong style={{ color: "var(--foreground)" }}>Tests:</strong> {q.intention}
//                             </div>
//                         </div>
//                     )}
//                     <div style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>
//                         <strong style={{ color: "var(--foreground)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
//                             Strong answer covers:
//                         </strong>
//                         <div style={{ marginTop: 6 }}>{q.answer}</div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// function SkillGapCard({ gap }) {
//     const cfg = {
//         high:   { color: "#ef4444", bg: "#ef444415", icon: AlertCircleIcon },
//         medium: { color: "#f59e0b", bg: "#f59e0b15", icon: InfoIcon },
//         low:    { color: "#22c55e", bg: "#22c55e15", icon: CheckCircleIcon },
//     }[gap.severity] ?? { color: "#6366f1", bg: "#6366f115", icon: InfoIcon };

//     const Icon = cfg.icon;

//     return (
//         <div style={{
//             display: "flex", gap: 14, padding: "16px 20px",
//             border: "1px solid var(--border)", borderRadius: 16,
//             borderLeft: `3px solid ${cfg.color}`,
//         }}>
//             <div style={{
//                 width: 32, height: 32, borderRadius: 8, flexShrink: 0,
//                 background: cfg.bg,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//             }}>
//                 <Icon size={14} style={{ color: cfg.color }} />
//             </div>
//             <div style={{ flex: 1 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
//                     <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>
//                         {gap.skill}
//                     </span>
//                     <span style={{
//                         fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
//                         color: cfg.color, background: cfg.bg, borderRadius: 100,
//                         padding: "2px 8px",
//                     }}>
//                         {gap.severity}
//                     </span>
//                 </div>
//                 <div style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
//                     {gap.recommendation}
//                 </div>
//             </div>
//         </div>
//     );
// }

// function DayCard({ plan }) {
//     return (
//         <div style={{
//             border: "1px solid var(--border)",
//             borderRadius: 16,
//             overflow: "hidden",
//         }}>
//             <div style={{
//                 padding: "12px 18px",
//                 display: "flex", alignItems: "center", gap: 12,
//                 borderBottom: "1px solid var(--border)",
//                 background: "var(--muted)",
//             }}>
//                 <div style={{
//                     width: 28, height: 28, borderRadius: 8,
//                     background: "var(--primary)",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontSize: 12, fontWeight: 700, color: "var(--primary-foreground)",
//                     flexShrink: 0,
//                 }}>
//                     {plan.day}
//                 </div>
//                 <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>
//                     {plan.focus}
//                 </span>
//             </div>
//             <ul style={{ padding: "12px 18px", margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
//                 {plan.tasks?.map((task, i) => (
//                     <li key={i} style={{
//                         display: "flex", gap: 10, alignItems: "flex-start",
//                         fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.55,
//                     }}>
//                         <span style={{
//                             width: 18, height: 18, borderRadius: 4, flexShrink: 0,
//                             background: "var(--accent)", border: "1px solid var(--border)",
//                             display: "inline-flex", alignItems: "center", justifyContent: "center",
//                             marginTop: 1,
//                         }}>
//                             <CheckCircleIcon size={10} style={{ color: "var(--primary)" }} />
//                         </span>
//                         {task}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export function ReportDetail() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [report, setReport] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [downloading, setDownloading] = useState(false);
//     const [activeTab, setActiveTab] = useState("questions");

//     useEffect(() => {
//         interviewService.getReport(id)
//             .then(setReport)
//             .catch(() => { toast.error("Could not load report."); navigate("/reports"); })
//             .finally(() => setLoading(false));
//     }, [id, navigate]);

//     async function handleDownload() {
//         setDownloading(true);
//         try {
//             const blob = await interviewService.generateResume(id);
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = url; a.download = `resume-${id}.pdf`;
//             document.body.appendChild(a); a.click();
//             document.body.removeChild(a); URL.revokeObjectURL(url);
//             toast.success("Resume downloaded.");
//         } catch { toast.error("Resume generation failed."); }
//         finally { setDownloading(false); }
//     }

//     if (loading) return <LoadingSpinner fullScreen label="Loading report" />;
//     if (!report) return null;

//     const badge = getRecommendationBadge(report.hiringRecommendation?.decision ?? report.hiringRecommendation);
//     const radarData = [
//         { subject: "Technical", score: report.matchScore.technical },
//         { subject: "Projects", score: report.matchScore.projects },
//         { subject: "Problem Solving", score: report.matchScore.problemSolving },
//         { subject: "Communication", score: report.matchScore.communication },
//     ];

//     const tabs = [
//         { id: "questions", label: "Questions", count: (report.technicalQuestions?.length ?? 0) + (report.behavioralQuestions?.length ?? 0) },
//         { id: "gaps", label: "Skill gaps", count: report.skillGaps?.length ?? 0 },
//         { id: "plan", label: "Prep plan", count: report.preparationPlan?.length ?? 0 },
//     ];

//     return (
//         <Layout
//             title={report.jobRole ?? report.title}
//             eyebrow="Report detail"
//             actions={
//                 <button
//                     type="button"
//                     onClick={handleDownload}
//                     disabled={downloading}
//                     className="hidden md:inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-80 disabled:opacity-50"
//                 >
//                     <DownloadIcon className="h-3.5 w-3.5" />
//                     {downloading ? "Generating..." : "Download resume"}
//                 </button>
//             }
//         >
//             <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

//                 {/* Back */}
//                 <button
//                     type="button"
//                     onClick={() => navigate("/reports")}
//                     style={{
//                         display: "inline-flex", alignItems: "center", gap: 6,
//                         fontSize: 13, fontWeight: 600,
//                         color: "var(--muted-foreground)", background: "none", border: "none",
//                         cursor: "pointer", alignSelf: "flex-start",
//                         transition: "color 0.12s",
//                     }}
//                     onMouseOver={e => e.currentTarget.style.color = "var(--foreground)"}
//                     onMouseOut={e => e.currentTarget.style.color = "var(--muted-foreground)"}
//                 >
//                     <ArrowLeftIcon size={14} /> Back to reports
//                 </button>

//                 {/* ── TOP: Score + Summary ── */}
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

//                     {/* Match score card */}
//                     <div style={{
//                         background: "var(--card)", border: "1px solid var(--border)",
//                         borderRadius: 20, padding: "24px",
//                     }}>
//                         <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 20 }}>
//                             Match score
//                         </div>

//                         {/* Big score + recommendation */}
//                         <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
//                             <div style={{
//                                 fontSize: 56, fontWeight: 800, lineHeight: 1,
//                                 letterSpacing: "-0.03em",
//                                 color: report.matchScore.overall >= 80 ? "#22c55e"
//                                     : report.matchScore.overall >= 60 ? "#f59e0b" : "#ef4444",
//                             }}>
//                                 {Math.round(report.matchScore.overall ?? 0)}
//                                 <span style={{ fontSize: 24, opacity: 0.5 }}>%</span>
//                             </div>
//                             <div>
//                                 <div style={{
//                                     display: "inline-block",
//                                     fontSize: 11, fontWeight: 700,
//                                     color: badge.variant === "success" ? "#22c55e" : badge.variant === "warning" ? "#f59e0b" : "#ef4444",
//                                     background: badge.variant === "success" ? "#22c55e15" : badge.variant === "warning" ? "#f59e0b15" : "#ef444415",
//                                     padding: "4px 12px", borderRadius: 100,
//                                     marginBottom: 4,
//                                 }}>
//                                     {badge.text}
//                                 </div>
//                                 <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
//                                     Confidence {Math.round(report.hiringRecommendation?.confidence ?? report.confidence ?? 0)}%
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Score breakdown bars */}
//                         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                             <ScoreBar label="Technical" value={report.matchScore.technical} />
//                             <ScoreBar label="Projects" value={report.matchScore.projects} />
//                             <ScoreBar label="Problem solving" value={report.matchScore.problemSolving} />
//                             <ScoreBar label="Communication" value={report.matchScore.communication} />
//                         </div>
//                     </div>

//                     {/* Radar + summary */}
//                     <div style={{
//                         background: "var(--card)", border: "1px solid var(--border)",
//                         borderRadius: 20, padding: "24px",
//                         display: "flex", flexDirection: "column", gap: 16,
//                     }}>
//                         <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
//                             Radar
//                         </div>
//                         <ResponsiveContainer width="100%" height={180}>
//                             <RadarChart data={radarData}>
//                                 <PolarGrid stroke="var(--border)" />
//                                 <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
//                                 <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.18} strokeWidth={2} />
//                             </RadarChart>
//                         </ResponsiveContainer>

//                         {/* Quick mock button */}
//                         <Link
//                             to="/mock"
//                             style={{
//                                 display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//                                 padding: "11px", borderRadius: 12,
//                                 background: "var(--accent)", border: "1px solid var(--border)",
//                                 color: "var(--accent-foreground)", textDecoration: "none",
//                                 fontSize: 13, fontWeight: 600,
//                                 transition: "opacity 0.15s",
//                             }}
//                             onMouseOver={e => e.currentTarget.style.opacity = "0.8"}
//                             onMouseOut={e => e.currentTarget.style.opacity = "1"}
//                         >
//                             <MicIcon size={14} /> Practice this role
//                         </Link>
//                     </div>
//                 </div>

//                 {/* Executive summary */}
//                 <div style={{
//                     background: "var(--card)", border: "1px solid var(--border)",
//                     borderRadius: 20, padding: "24px",
//                 }}>
//                     <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 12 }}>
//                         Executive summary
//                     </div>
//                     <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--foreground)", margin: 0 }}>
//                         {report.overallAnalysis ?? report.hiringRecommendation?.reasoning ?? "No summary available."}
//                     </p>
//                 </div>

//                 {/* ── TABS ── */}
//                 <div>
//                     {/* Tab bar */}
//                     <div style={{
//                         display: "flex", gap: 4,
//                         borderBottom: "1px solid var(--border)",
//                         marginBottom: 20,
//                     }}>
//                         {tabs.map(t => (
//                             <button
//                                 key={t.id}
//                                 type="button"
//                                 onClick={() => setActiveTab(t.id)}
//                                 style={{
//                                     display: "flex", alignItems: "center", gap: 7,
//                                     padding: "10px 16px",
//                                     background: "none", border: "none", cursor: "pointer",
//                                     fontSize: 13, fontWeight: 500,
//                                     color: activeTab === t.id ? "var(--foreground)" : "var(--muted-foreground)",
//                                     borderBottom: activeTab === t.id ? "2px solid var(--primary)" : "2px solid transparent",
//                                     marginBottom: -1,
//                                     transition: "color 0.12s",
//                                 }}
//                             >
//                                 {t.label}
//                                 <span style={{
//                                     fontSize: 11, fontWeight: 600,
//                                     background: activeTab === t.id ? "var(--primary)" : "var(--muted)",
//                                     color: activeTab === t.id ? "var(--primary-foreground)" : "var(--muted-foreground)",
//                                     borderRadius: 100, padding: "1px 7px",
//                                     transition: "background 0.12s",
//                                 }}>
//                                     {t.count}
//                                 </span>
//                             </button>
//                         ))}
//                     </div>

//                     {/* Tab content */}
//                     {activeTab === "questions" && (
//                         <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//                             <Section title="Technical questions">
//                                 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                                     {report.technicalQuestions?.map((q, i) => (
//                                         <QuestionCard key={i} q={q} index={i} type="technical" />
//                                     ))}
//                                 </div>
//                             </Section>
//                             <Section title="Behavioral questions">
//                                 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                                     {report.behavioralQuestions?.map((q, i) => (
//                                         <QuestionCard key={i} q={q} index={i} type="behavioral" />
//                                     ))}
//                                 </div>
//                             </Section>
//                         </div>
//                     )}

//                     {activeTab === "gaps" && (
//                         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                             {report.skillGaps?.map((gap, i) => (
//                                 <SkillGapCard key={i} gap={gap} />
//                             ))}
//                         </div>
//                     )}

//                     {activeTab === "plan" && (
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                             {report.preparationPlan?.map((plan, i) => (
//                                 <DayCard key={i} plan={plan} />
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </Layout>
//     );
// }