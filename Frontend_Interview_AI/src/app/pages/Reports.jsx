import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { DownloadIcon, EyeIcon, FileTextIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "../components/Layout.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { Badge } from "../components/Badge.jsx";
import { ScoreCircle } from "../components/ScoreCircle.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import { interviewService } from "../services/interview.service.js";
import { formatDate, getRecommendationBadge } from "../utils/formatters.js";

export function Reports() {
  const [reports, setReports] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadReports() {
      try {
        setReports(await interviewService.getAllReports());
      } catch (error) {
        toast.error("Could not load reports.");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) {
      return reports;
    }
    return reports.filter((report) => report.jobRole.toLowerCase().includes(value));
  }, [query, reports]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this report from the workspace?")) {
      return;
    }

    try {
      await interviewService.deleteReport(id);
      setReports((current) => current.filter((report) => report._id !== id));
      toast.success("Report deleted.");
    } catch (error) {
      toast.error("Delete failed.");
    }
  }

  async function handleResumeDownload(reportId) {
    try {
      const blob = await interviewService.generateResume(reportId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `resume-${reportId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      toast.success("Resume downloaded.");
    } catch (error) {
      toast.error("Resume generation failed.");
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading reports" />;
  }

  return (
    <Layout
      title="Reports"
      eyebrow="Analysis archive"
      actions={
        <Link
          to="/reports/new"
          className="hidden rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 md:inline-flex"
        >
          New report
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
              placeholder="Search by role title"
            />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <EmptyState
            icon={FileTextIcon}
            title="No reports found"
            description="Create a report to seed the rest of the workspace, or adjust the search if you already have one."
            actionLabel="Create report"
            actionHref="/reports/new"
          />
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const badge = getRecommendationBadge(report.hiringRecommendation.decision);
              return (
                <div
                  key={report._id}
                  className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-indigo-800 lg:grid-cols-[auto_1fr_auto]"
                >
                  <div className="flex items-center justify-center">
                    <ScoreCircle score={report.matchScore.overall} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        {report.jobRole}
                      </h2>
                      <Badge variant={badge.variant}>{badge.text}</Badge>
                    </div>

                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Created {formatDate(report.createdAt)}
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-4">
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

                  <div className="flex flex-wrap items-start gap-3 lg:flex-col">
                    <button
                      type="button"
                      onClick={() => navigate(`/reports/${report._id}`)}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResumeDownload(report._id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Resume
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(report._id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/70 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    >
                      <Trash2Icon className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
