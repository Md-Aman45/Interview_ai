// import { useMemo, useState } from "react";
// import { useNavigate } from "react-router";
// import { UploadIcon, FileTextIcon, CheckIcon, Loader2Icon, SparklesIcon, ArrowLeftIcon } from "lucide-react";
// import { toast } from "sonner";
// import { Layout } from "../components/Layout.jsx";
// import { interviewService } from "../services/interview.service.js";
// import { validateFile } from "../utils/validation.js";

// export function NewReport() {
//   const [resume, setResume] = useState(null);
//   const [jobDescription, setJobDescription] = useState("");
//   const [selfDescription, setSelfDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [dragOver, setDragOver] = useState(false);
//   const navigate = useNavigate();

//   function handleFile(file) {
//     const v = validateFile(file);
//     if (!v.isValid) { toast.error(v.error); return; }
//     setResume(file);
//     toast.success("Resume attached.");
//   }

//   function handleDrop(e) {
//     e.preventDefault(); setDragOver(false);
//     const f = e.dataTransfer.files?.[0];
//     if (f) handleFile(f);
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!resume) { toast.error("Attach a PDF resume first."); return; }
//     if (!jobDescription.trim()) { toast.error("Paste the job description."); return; }
//     setLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append("resume", resume);
//       fd.append("jobDescription", jobDescription);
//       fd.append("selfDescription", selfDescription);
//       const data = await interviewService.generateReport(fd);
//       toast.success("Report created!");
//       navigate(`/reports/${data.report._id}`);
//     } catch (err) { toast.error(err?.response?.data?.message || "Report generation failed."); }
//     finally { setLoading(false); }
//   }

//   const outputPoints = [
//     "Job match score (0–100)",
//     "Skill gap analysis with severity",
//     "5 role-specific technical questions",
//     "3 behavioral questions",
//     "5-day preparation plan",
//     "Resume export aligned to role",
//   ];

//   return (
//     <Layout title="New report" eyebrow="Analysis workflow">
//       {loading ? (
//         // Full generating state
//         <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
//           <div className="relative mb-8">
//             <div className="h-20 w-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
//               <SparklesIcon className="h-9 w-9 text-indigo-600 dark:text-indigo-400 animate-pulse" />
//             </div>
//             <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center">
//               <Loader2Icon className="h-3 w-3 text-white animate-spin" />
//             </div>
//           </div>
//           <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Generating your report</h2>
//           <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-7">
//             Gemini AI is analyzing your resume against the job description. This usually takes 15–30 seconds.
//           </p>
//           <div className="mt-8 flex gap-1.5">
//             {[0,1,2].map(i => (
//               <div key={i} className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
//             ))}
//           </div>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_340px]">
//           <div className="space-y-5">
//             {/* Back */}
//             <button type="button" onClick={() => navigate("/reports")}
//               className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-medium">
//               <ArrowLeftIcon className="h-4 w-4" /> Back to reports
//             </button>

//             {/* Resume upload */}
//             <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
//               <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Step 1</div>
//               <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Upload your resume</h3>

//               <input id="resume-file" type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
//               <label htmlFor="resume-file"
//                 onDragOver={e => { e.preventDefault(); setDragOver(true); }}
//                 onDragLeave={() => setDragOver(false)}
//                 onDrop={handleDrop}
//                 className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all ${
//                   dragOver ? "border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20" :
//                   resume ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20" :
//                   "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-900"
//                 }`}
//               >
//                 {resume ? (
//                   <>
//                     <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/50">
//                       <CheckIcon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
//                     </div>
//                     <div className="text-center">
//                       <div className="text-sm font-semibold text-slate-900 dark:text-white">{resume.name}</div>
//                       <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{Math.round(resume.size / 1024)} KB · PDF · <button type="button" onClick={e => { e.preventDefault(); setResume(null); }} className="text-indigo-600 dark:text-indigo-400 hover:underline">Change file</button></div>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
//                       <UploadIcon className="h-6 w-6 text-slate-400" />
//                     </div>
//                     <div className="text-center">
//                       <div className="text-sm font-semibold text-slate-900 dark:text-white">Drop your PDF here</div>
//                       <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">or click to browse · Text-based PDF · Max 5MB</div>
//                     </div>
//                   </>
//                 )}
//               </label>
//             </div>

//             {/* Job description */}
//             <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
//               <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Step 2</div>
//               <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Job description</h3>
//               <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Paste the full role requirements and tech stack</p>
//               <textarea
//                 value={jobDescription}
//                 onChange={e => setJobDescription(e.target.value)}
//                 rows={9}
//                 placeholder="Paste the job description here — responsibilities, required skills, tech stack, and any other details you want the AI to analyze against your resume..."
//                 className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3.5 text-sm leading-7 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 transition resize-none dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
//               />
//             </div>

//             {/* Self description */}
//             <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Step 3</div>
//                 {/* <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">Optional</span> */}
//               </div>
//               <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">About yourself</h3>
//               <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Add context your resume doesn't capture</p>
//               <textarea
//                 value={selfDescription}
//                 onChange={e => setSelfDescription(e.target.value)}
//                 rows={4}
//                 placeholder="E.g. I'm a backend developer transitioning to full-stack, with 2 years of freelancing. I'm particularly strong in Node.js and want to highlight my system design experience..."
//                 className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3.5 text-sm leading-7 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 transition resize-none dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
//               />
//             </div>

            
//           </div>

//           {/* Sidebar */}
//           <aside className="space-y-5">
//             <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sticky top-24">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 mb-5">
//                 <SparklesIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
//               </div>
//               <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">What you'll get</h3>
//               <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-6">
//                 Powered by Google Gemini with strict JSON schema validation.
//               </p>
//               <ul className="space-y-2.5 mb-7">
//                 {outputPoints.map(p => (
//                   <li key={p} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
//                     <div className="h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0">
//                       <CheckIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
//                     </div>
//                     {p}
//                   </li>
//                 ))}
//               </ul>
//               <button type="submit"
//                 className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
//                 <SparklesIcon className="h-4 w-4" />
//                 Generate report
//               </button>
//               <p className="mt-3 text-xs text-center text-slate-400 dark:text-slate-500">Takes ~15–30 seconds</p>
//             </div>
//           </aside>
//         </form>
//       )}
//     </Layout>
//   );
// }












import { useState } from "react";
import { useNavigate } from "react-router";
import { UploadIcon, CheckIcon, Loader2Icon, SparklesIcon, ArrowLeftIcon, PlusIcon, XIcon, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "../components/Layout.jsx";
import { interviewService } from "../services/interview.service.js";
import { validateFile } from "../utils/validation.js";


const OUTPUT_POINTS = [
    "Job match score (0–100)",
    "Skill gap analysis with severity",
    "5 role-specific technical questions",
    "3 behavioral questions",
    "5-day preparation plan",
    "Resume export aligned to role",
];

const DEFAULT_LINKS = [
    { k: "linkedin",  label: "LinkedIn",       ph: "https://linkedin.com/in/username" },
    { k: "github",    label: "GitHub",          ph: "https://github.com/username" },
    { k: "leetcode",  label: "LeetCode",        ph: "https://leetcode.com/username" },
    { k: "gfg",       label: "GeeksforGeeks",   ph: "https://geeksforgeeks.org/user/username" },
    { k: "portfolio", label: "Portfolio",        ph: "https://yoursite.com" },
];

export function NewReport() {
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [links, setLinks] = useState({ linkedin: "", github: "", leetcode: "", gfg: "", portfolio: "" });
    const [extraLinks, setExtraLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

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

    function addExtraLink() {
        setExtraLinks(p => [...p, { label: "", url: "" }]);
    }

    function updateExtraLink(i, field, val) {
        setExtraLinks(p => p.map((l, j) => j === i ? { ...l, [field]: val } : l));
    }

    function removeExtraLink(i) {
        setExtraLinks(p => p.filter((_, j) => j !== i));
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
            fd.append("linkedin",  links.linkedin);
            fd.append("github",    links.github);
            fd.append("leetcode",  links.leetcode);
            fd.append("gfg",       links.gfg);
            fd.append("portfolio", links.portfolio);
            fd.append("extraLinks", JSON.stringify(
                extraLinks.filter(l => l.label.trim() && l.url.trim())
            ));
            const data = await interviewService.generateReport(fd);
            toast.success("Report created!");
            navigate(`/reports/${data.report._id}`);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Report generation failed.");
        } finally {
            setLoading(false);
        }
    }

    // ── LOADING STATE ──────────────────────────────────────────
    if (loading) {
        return (
            <Layout title="New report" eyebrow="Analysis workflow">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="relative mb-8">
                        <div className="h-20 w-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                            <SparklesIcon className="h-9 w-9 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                        </div>
                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center">
                            <Loader2Icon className="h-3 w-3 text-white animate-spin" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                        Generating your report
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-7">
                        Gemini AI is analyzing your resume against the job description. This usually takes 15–30 seconds.
                    </p>
                    <div className="mt-8 flex gap-1.5">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }

    // ── MAIN FORM ──────────────────────────────────────────────
    return (
        <Layout title="New report" eyebrow="Analysis workflow">
            <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_340px]">
                <div className="space-y-5">

                    {/* Back */}
                    <button type="button" onClick={() => navigate("/reports")}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-medium">
                        <ArrowLeftIcon className="h-4 w-4" /> Back to reports
                    </button>

                    {/* ── STEP 1: Resume upload ── */}
                    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Step 1</div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Upload your resume</h3>
                        <input id="resume-file" type="file" accept=".pdf" className="hidden"
                            onChange={e => handleFile(e.target.files?.[0])} />
                        <label htmlFor="resume-file"
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all ${
                                dragOver
                                    ? "border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20"
                                    : resume
                                    ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20"
                                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                            }`}>
                            {resume ? (
                                <>
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/50">
                                        <CheckIcon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{resume.name}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {Math.round(resume.size / 1024)} KB · PDF ·{" "}
                                            <button type="button"
                                                onClick={e => { e.preventDefault(); setResume(null); }}
                                                className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                                Change file
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                                        <UploadIcon className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">Drop your PDF here</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            or click to browse · Text-based PDF · Max 5MB
                                        </div>
                                    </div>
                                </>
                            )}
                        </label>
                    </div>

                    {/* ── STEP 2: Job description ── */}
                    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Step 2</div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Job description</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Paste the full role requirements and tech stack</p>
                        <textarea
                            value={jobDescription}
                            onChange={e => setJobDescription(e.target.value)}
                            rows={9}
                            placeholder="Paste the job description here — responsibilities, required skills, tech stack..."
                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3.5 text-sm leading-7 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 transition resize-none dark:text-white placeholder:text-slate-400"
                        />
                    </div>

                    {/* ── STEP 3: About yourself ── */}
                    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Step 3</div>
                            {/* <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">Optional</span> */}
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">About yourself</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Add context your resume doesn't capture</p>
                        <textarea
                            value={selfDescription}
                            onChange={e => setSelfDescription(e.target.value)}
                            rows={4}
                            placeholder="E.g. I'm a backend developer transitioning to full-stack, with 2 years of freelancing..."
                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3.5 text-sm leading-7 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 transition resize-none dark:text-white placeholder:text-slate-400"
                        />
                    </div>

                    {/* ── STEP 4: Profile links ── */}
                    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Step 4</div>
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">Optional</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <LinkIcon className="h-4 w-4 text-indigo-500" />
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Profile links</h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                            These appear in your downloaded resume PDF. Only fill what you have.
                        </p>

                        {/* Default platform links — table style */}
                        <div className="space-y-0 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                            {DEFAULT_LINKS.map(({ k, label, ph }, i) => (
                                <div key={k}
                                    className={`flex items-center gap-0 ${i < DEFAULT_LINKS.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                                    <div className="w-36 flex-shrink-0 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</span>
                                    </div>
                                    <input
                                        type="url"
                                        value={links[k]}
                                        onChange={e => setLinks(p => ({ ...p, [k]: e.target.value }))}
                                        placeholder={ph}
                                        className="flex-1 px-4 py-3 text-sm bg-white dark:bg-slate-950 outline-none text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Extra custom links */}
                        {extraLinks.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {extraLinks.map((link, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value={link.label}
                                            onChange={e => updateExtraLink(i, "label", e.target.value)}
                                            placeholder="Platform name"
                                            className="w-32 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:border-indigo-400 dark:text-white placeholder:text-slate-400"
                                        />
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={e => updateExtraLink(i, "url", e.target.value)}
                                            placeholder="https://..."
                                            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:border-indigo-400 dark:text-white placeholder:text-slate-400"
                                        />
                                        <button type="button" onClick={() => removeExtraLink(i)}
                                            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition">
                                            <XIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button type="button" onClick={addExtraLink}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition">
                            <PlusIcon className="h-3.5 w-3.5" />
                            Add another platform (CodeChef, Kaggle, Twitter...)
                        </button>
                    </div>
                </div>

                {/* ── SIDEBAR ── */}
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
                            {OUTPUT_POINTS.map(p => (
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
        </Layout>
    );
}