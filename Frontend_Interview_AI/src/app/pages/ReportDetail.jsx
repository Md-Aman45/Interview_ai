import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftIcon, DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Layout } from "../components/Layout.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import { Badge } from "../components/Badge.jsx";
import { ScoreCircle } from "../components/ScoreCircle.jsx";
import { interviewService } from "../services/interview.service.js";
import { getRecommendationBadge } from "../utils/formatters.js";

export function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        setReport(await interviewService.getReport(id));
      } catch (error) {
        toast.error("Could not load report.");
        navigate("/reports");
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [id, navigate]);

  async function handleResumeDownload() {
    try {
      const blob = await interviewService.generateResume(id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `resume-${id}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Resume generation failed.");
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading report" />;
  }

  if (!report) {
    return null;
  }

  const badge = getRecommendationBadge(report.hiringRecommendation.decision);
  const radarData = [
    { subject: "Technical", score: report.matchScore.technical },
    { subject: "Projects", score: report.matchScore.projects },
    { subject: "Problem Solving", score: report.matchScore.problemSolving },
    { subject: "Communication", score: report.matchScore.communication },
  ];

  return (
    <Layout
      title={report.jobRole}
      eyebrow="Report detail"
      actions={
        <button
          type="button"
          onClick={handleResumeDownload}
          className="hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 md:inline-flex dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          Download resume
        </button>
      }
    >
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/reports")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to reports
        </button>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={badge.variant}>{badge.text}</Badge>
              <Badge variant="neutral">
                Confidence {Math.round(report.hiringRecommendation.confidence || 0)}%
              </Badge>
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-slate-900 dark:text-white">
              Executive summary
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {report.overallAnalysis || report.hiringRecommendation.reasoning || "No summary available."}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col items-center gap-6 lg:flex-row">
              <ScoreCircle score={report.matchScore.overall} size="lg" />
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                {[
                  ["Technical", report.matchScore.technical],
                  ["Projects", report.matchScore.projects],
                  ["Problem solving", report.matchScore.problemSolving],
                  ["Communication", report.matchScore.communication],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                      {value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Score radar</h3>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Radar dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Skill gaps</h3>
            <div className="mt-6 space-y-4">
              {report.skillGaps.length ? (
                report.skillGaps.map((gap) => (
                  <div
                    key={`${gap.skill}-${gap.severity}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">
                        {gap.skill}
                      </div>
                      <Badge
                        variant={gap.severity === "high" ? "danger" : gap.severity === "medium" ? "warning" : "info"}
                      >
                        {gap.severity}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                      {gap.suggestion}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  No explicit skill gaps were returned for this report.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Interview questions</h3>
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            {[...report.technicalQuestions, ...report.behavioralQuestions].map((question, index) => (
              <div
                key={`${question.question}-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Question {index + 1}
                </div>
                <div className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {question.question}
                </div>
                <div className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  What it tests
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {question.intention}
                </p>
                <div className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Strong answer should cover
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {question.idealAnswer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Five-day preparation plan
          </h3>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {report.preparationPlan.map((day) => (
              <div
                key={day.day}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-semibold text-white">
                  {day.day}
                </div>
                <div className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {day.focus}
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {day.tasks.map((task, index) => (
                    <li key={`${task}-${index}`}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
