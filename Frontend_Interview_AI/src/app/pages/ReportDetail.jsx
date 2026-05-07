import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeftIcon, DownloadIcon, MicIcon, ChevronDownIcon, ChevronUpIcon,
  AlertTriangleIcon, InfoIcon, CheckCircle2Icon, TrendingUpIcon, BrainIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Layout } from "../components/Layout.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import { interviewService } from "../services/interview.service.js";
import { getRecommendationBadge } from "../utils/formatters.js";
import { useUsageLimit } from '../hooks/useLUsageimit.js';

// ── helpers ──────────────────────────────────────────────
function scoreColor(v) {
  return v >= 80 ? "#22c55e" : v >= 60 ? "#f59e0b" : "#ef4444";
}
function scoreLabel(v) {
  return v >= 80 ? "Strong" : v >= 60 ? "Fair" : "Weak";
}

// ── Sub-components ───────────────────────────────────────
function ScoreRing({ score, size = 120 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.26, fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.03em" }}>{score}</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-foreground)", marginTop: 2 }}>Match</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }) {
  const pct = Math.round(value ?? 0);
  const color = scoreColor(pct);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color, background: color + "18", padding: "2px 7px", borderRadius: 100 }}>{scoreLabel(pct)}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
        </div>
      </div>
      <div style={{ height: 6, borderRadius: 100, background: "var(--border)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 100, width: `${pct}%`, background: color, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

function QuestionCard({ q, index, type }) {
  const [open, setOpen] = useState(false);
  const isTech = type === "technical";
  const accent = isTech ? "#6366f1" : "#f59e0b";
  const label = isTech ? `T${index + 1}` : `B${index + 1}`;
  const tagLabel = isTech ? "Technical" : "Behavioral";

  return (
    <div style={{
      border: `1px solid ${open ? accent + "40" : "var(--border)"}`,
      borderRadius: 16, overflow: "hidden",
      background: open ? accent + "05" : "var(--card)",
      transition: "border-color 0.2s, background 0.2s",
    }}>
      <button type="button" onClick={() => setOpen(v => !v)} style={{
        width: "100%", padding: "16px 20px",
        display: "flex", alignItems: "flex-start", gap: 14,
        background: "none", border: "none", cursor: "pointer", textAlign: "left",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, flexShrink: 0, paddingTop: 2,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: accent,
          }}>{label}</div>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: accent, background: accent + "12", padding: "2px 7px", borderRadius: 100 }}>{tagLabel}</span>
        </div>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.6 }}>{q.question}</div>
        <div style={{ flexShrink: 0, color: "var(--muted-foreground)", marginTop: 4 }}>
          {open ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
        </div>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${accent}25`, padding: "16px 20px 20px" }}>
          {q.intention && (
            <div style={{ display: "flex", gap: 10, padding: "10px 14px", borderRadius: 10, background: accent + "0d", marginBottom: 14, borderLeft: `3px solid ${accent}` }}>
              <InfoIcon size={13} style={{ color: accent, marginTop: 2, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.65 }}>
                <strong style={{ color: "var(--foreground)" }}>Tests: </strong>{q.intention}
              </div>
            </div>
          )}
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", marginBottom: 8 }}>Strong answer covers</div>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.75, margin: 0 }}>{q.idealAnswer || q.answer}</p>
        </div>
      )}
    </div>
  );
}

function GapCard({ gap }) {
  const cfg = {
    high:   { color: "#ef4444", bg: "#ef444412", Icon: AlertTriangleIcon, label: "Critical gap" },
    medium: { color: "#f59e0b", bg: "#f59e0b12", Icon: InfoIcon,          label: "Moderate gap" },
    low:    { color: "#22c55e", bg: "#22c55e12", Icon: CheckCircle2Icon,   label: "Minor gap" },
  }[gap.severity] ?? { color: "#6366f1", bg: "#6366f112", Icon: InfoIcon, label: "Gap" };

  return (
    <div style={{
      display: "flex", gap: 14, padding: "16px 18px",
      border: "1px solid var(--border)", borderRadius: 14,
      borderLeft: `3px solid ${cfg.color}`,
      background: "var(--card)",
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <cfg.Icon size={15} style={{ color: cfg.color }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>{gap.skill}</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: cfg.color, background: cfg.bg, padding: "2px 8px", borderRadius: 100 }}>{cfg.label}</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.65, margin: 0 }}>{gap.suggestion || gap.recommendation}</p>
      </div>
    </div>
  );
}

function DayCard({ plan }) {
  const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];
  const color = colors[(plan.day - 1) % colors.length];
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", background: "var(--card)" }}>
      <div style={{ padding: "12px 16px", background: color + "0f", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
          {plan.day}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{plan.focus}</span>
      </div>
      <ul style={{ padding: "12px 16px", margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {plan.tasks?.map((task, i) => (
          <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, background: "var(--muted)" }}>
              <CheckCircle2Icon size={9} style={{ color }} />
            </span>
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── MAIN ────────────────────────────────────────────────
export function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { isLimitReached, getResetsOn } = useUsageLimit();
  const resumeLimitReached = isLimitReached('resume');
  const mockLimitReached = isLimitReached('mock');

  useEffect(() => {
    interviewService.getReport(id)
      .then(setReport)
      .catch(() => { toast.error("Could not load report."); navigate("/reports"); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleDownload() {
    setDownloading(true);
    try {
      const blob = await interviewService.generateResume(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `resume-${id}.pdf`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      toast.success("Resume downloaded!");
    } catch { toast.error("Resume generation failed."); }
    finally { setDownloading(false); }
  }

  if (loading) return <LoadingSpinner fullScreen label="Loading report" />;
  if (!report) return null;

  const badge = getRecommendationBadge(report.hiringRecommendation?.decision ?? report.hiringRecommendation);
  const radarData = [
    { subject: "Technical",      score: report.matchScore.technical },
    { subject: "Projects",       score: report.matchScore.projects },
    { subject: "Problem Solving",score: report.matchScore.problemSolving },
    { subject: "Communication",  score: report.matchScore.communication },
  ];

  const badgeColor = badge.variant === "success" ? "#22c55e" : badge.variant === "warning" ? "#f59e0b" : "#ef4444";
  const allQuestions = [...(report.technicalQuestions || []).map(q => ({ ...q, _type: "technical" })), ...(report.behavioralQuestions || []).map(q => ({ ...q, _type: "behavioral" }))];

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "questions", label: "Questions", count: allQuestions.length },
    { id: "gaps", label: "Skill gaps", count: report.skillGaps?.length || 0 },
    { id: "plan", label: "Prep plan", count: report.preparationPlan?.length || 0 },
  ];

  return (
    <Layout
      title={report.jobRole}
      eyebrow="Report detail"
      actions={
        <button type="button" onClick={handleDownload} disabled={downloading || resumeLimitReached}
          className="hidden md:inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 hover:opacity-80 disabled:opacity-50 transition">
          <DownloadIcon className="h-3.5 w-3.5" />
          {/* {downloading ? "Generating..." : "Download resume"}
           */}
           {resumeLimitReached
  ? `Limit reached • Resets ${getResetsOn('resume')}`
  : downloading
    ? "Generating..."
    : "Download resume"}
        </button>
      }
    >
      <div className="space-y-5">
        {/* Back */}
        <button type="button" onClick={() => navigate("/reports")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
          <ArrowLeftIcon className="h-4 w-4" /> Back to reports
        </button>

        {/* Hero row — score + summary */}
        <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
          {/* Score card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
              <ScoreRing score={report.matchScore.overall} size={110} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted-foreground)", marginBottom: 6 }}>Recommendation</div>
                <div style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: badgeColor, background: badgeColor + "18", padding: "4px 12px", borderRadius: 100, marginBottom: 6 }}>
                  {badge.text}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                  Confidence {Math.round(report.hiringRecommendation?.confidence || 0)}%
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ScoreBar label="Technical" value={report.matchScore.technical} />
              <ScoreBar label="Projects" value={report.matchScore.projects} />
              <ScoreBar label="Problem Solving" value={report.matchScore.problemSolving} />
              <ScoreBar label="Communication" value={report.matchScore.communication} />
            </div>
          </div>

          {/* Summary + radar */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex flex-col gap-5">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted-foreground)", marginBottom: 10 }}>Executive summary</div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--foreground)", margin: 0 }}>
                {report.overallAnalysis || report.hiringRecommendation?.reasoning || "No summary available."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link to="/mock"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition shadow-lg shadow-indigo-500/20">
                <MicIcon className="h-4 w-4" /> Practice this role
              </Link>
              <button onClick={handleDownload} disabled={downloading || resumeLimitReached}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition disabled:opacity-50">
                <DownloadIcon className="h-4 w-4" />
                {/* {downloading ? "Generating..." : "Download resume"}
                 */}
                 {resumeLimitReached
  ? `Limit reached • Resets ${getResetsOn('resume')}`
  : downloading
    ? "Generating..."
    : "Download resume"}
              </button>
            </div>
            {/* Mini radar */}
            <div className="h-44 mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius={60}>
                  <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 }} />
                  <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            {TABS.map(tab => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 18px", background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600,
                color: activeTab === tab.id ? "var(--foreground)" : "var(--muted-foreground)",
                borderBottom: activeTab === tab.id ? "2px solid #6366f1" : "2px solid transparent",
                marginBottom: -1, transition: "color 0.15s",
              }}>
                {tab.label}
                {tab.count !== undefined && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 100,
                    background: activeTab === tab.id ? "#6366f1" : "var(--muted)",
                    color: activeTab === tab.id ? "#fff" : "var(--muted-foreground)",
                    transition: "background 0.15s",
                  }}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === "overview" && (
            <div className="grid gap-5 md:grid-cols-2">
              {/* Top skill gaps preview */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted-foreground)", marginBottom: 14 }}>Top skill gaps</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(report.skillGaps || []).slice(0, 3).map((g, i) => <GapCard key={i} gap={g} />)}
                  {!report.skillGaps?.length && <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>No skill gaps identified.</p>}
                </div>
              </div>
              {/* Day 1 plan preview */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted-foreground)", marginBottom: 14 }}>Preparation highlights</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(report.preparationPlan || []).slice(0, 3).map((d, i) => <DayCard key={i} plan={d} />)}
                </div>
              </div>
            </div>
          )}

          {/* Questions tab */}
          {activeTab === "questions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {allQuestions.map((q, i) => (
                <QuestionCard key={i} q={q} index={q._type === "technical" ? report.technicalQuestions.indexOf(q) : report.behavioralQuestions.indexOf(q)} type={q._type} />
              ))}
            </div>
          )}

          {/* Gaps tab */}
          {activeTab === "gaps" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {report.skillGaps?.length
                ? report.skillGaps.map((g, i) => <GapCard key={i} gap={g} />)
                : <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>No skill gaps returned for this report.</p>
              }
            </div>
          )}

          {/* Plan tab */}
          {activeTab === "plan" && (
            <div className="grid gap-4 md:grid-cols-5">
              {report.preparationPlan?.map((day, i) => <DayCard key={i} plan={day} />)}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}