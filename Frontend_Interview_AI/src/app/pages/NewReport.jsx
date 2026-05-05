import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { UploadIcon, FileTextIcon, CheckIcon, Loader2Icon, SparklesIcon, ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "../components/Layout.jsx";
import { interviewService } from "../services/interview.service.js";
import { validateFile } from "../utils/validation.js";

export function NewReport() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  function handleFile(file) {
    const v = validateFile(file);
    if (!v.isValid) { toast.error(v.error); return; }
    setResume(file);
    toast.success("Resume attached.");
  }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!resume) { toast.error("Attach a PDF resume first."); return; }
    if (!jobDescription.trim()) { toast.error("Paste the job description."); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("resume", resume);
      fd.append("jobDescription", jobDescription);
      fd.append("selfDescription", selfDescription);
      const data = await interviewService.generateReport(fd);
      toast.success("Report created!");
      navigate(`/reports/${data.report._id}`);
    } catch (err) { toast.error(err?.response?.data?.message || "Report generation failed."); }
    finally { setLoading(false); }
  }

  const outputPoints = [
    "Job match score (0–100)",
    "Skill gap analysis with severity",
    "5 role-specific technical questions",
    "3 behavioral questions",
    "5-day preparation plan",
    "Resume export aligned to role",
  ];

  return (
    <Layout title="New report" eyebrow="Analysis workflow">
      {loading ? (
        // Full generating state
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="relative mb-8">
            <div className="h-20 w-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
              <SparklesIcon className="h-9 w-9 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center">
              <Loader2Icon className="h-3 w-3 text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Generating your report</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-7">
            Gemini AI is analyzing your resume against the job description. This usually takes 15–30 seconds.
          </p>
          <div className="mt-8 flex gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            {/* Back */}
            <button type="button" onClick={() => navigate("/reports")}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-medium">
              <ArrowLeftIcon className="h-4 w-4" /> Back to reports
            </button>

            {/* Resume upload */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Step 1</div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Upload your resume</h3>

              <input id="resume-file" type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
              <label htmlFor="resume-file"
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all ${
                  dragOver ? "border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20" :
                  resume ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20" :
                  "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                {resume ? (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/50">
                      <CheckIcon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{resume.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{Math.round(resume.size / 1024)} KB · PDF · <button type="button" onClick={e => { e.preventDefault(); setResume(null); }} className="text-indigo-600 dark:text-indigo-400 hover:underline">Change file</button></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                      <UploadIcon className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Drop your PDF here</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">or click to browse · Text-based PDF · Max 5MB</div>
                    </div>
                  </>
                )}
              </label>
            </div>

            {/* Job description */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Step 2</div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Job description</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Paste the full role requirements and tech stack</p>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={9}
                placeholder="Paste the job description here — responsibilities, required skills, tech stack, and any other details you want the AI to analyze against your resume..."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3.5 text-sm leading-7 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 transition resize-none dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            {/* Self description */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Step 3</div>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">Optional</span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">About yourself</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Add context your resume doesn't capture</p>
              <textarea
                value={selfDescription}
                onChange={e => setSelfDescription(e.target.value)}
                rows={4}
                placeholder="E.g. I'm a backend developer transitioning to full-stack, with 2 years of freelancing. I'm particularly strong in Node.js and want to highlight my system design experience..."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3.5 text-sm leading-7 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 transition resize-none dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sticky top-24">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 mb-5">
                <SparklesIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">What you'll get</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-6">
                Powered by Google Gemini with strict JSON schema validation.
              </p>
              <ul className="space-y-2.5 mb-7">
                {outputPoints.map(p => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <div className="h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {p}
                  </li>
                ))}
              </ul>
              <button type="submit"
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                <SparklesIcon className="h-4 w-4" />
                Generate report
              </button>
              <p className="mt-3 text-xs text-center text-slate-400 dark:text-slate-500">Takes ~15–30 seconds</p>
            </div>
          </aside>
        </form>
      )}
    </Layout>
  );
}