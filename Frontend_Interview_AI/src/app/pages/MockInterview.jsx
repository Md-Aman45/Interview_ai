// // // import { useEffect, useMemo, useState } from "react";
// // // import { PlayIcon, SendIcon, SquareIcon } from "lucide-react";
// // // import { toast } from "sonner";
// // // import { Layout } from "../components/Layout.jsx";
// // // import { Badge } from "../components/Badge.jsx";
// // // import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
// // // import { interviewService } from "../services/interview.service.js";
// // // import { mockService } from "../services/mock.service.js";
// // // import { formatDate, formatTime } from "../utils/formatters.js";

// // // export function MockInterview() {
// // //   const [reports, setReports] = useState([]);
// // //   const [sessions, setSessions] = useState([]);
// // //   const [selectedReportId, setSelectedReportId] = useState("");
// // //   const [activeSession, setActiveSession] = useState(null);
// // //   const [currentQuestion, setCurrentQuestion] = useState("");
// // //   const [currentAnswer, setCurrentAnswer] = useState("");
// // //   const [transcript, setTranscript] = useState([]);
// // //   const [timeRemaining, setTimeRemaining] = useState(30 * 60 * 1000);
// // //   const [loading, setLoading] = useState(true);
// // //   const [submitting, setSubmitting] = useState(false);

// // //   useEffect(() => {
// // //     async function load() {
// // //       try {
// // //         const [reportsResponse, sessionsResponse] = await Promise.all([
// // //           interviewService.getAllReports(),
// // //           mockService.getAllSessions(),
// // //         ]);
// // //         setReports(reportsResponse);
// // //         setSessions(sessionsResponse);
// // //       } catch (error) {
// // //         toast.error("Could not load mock interview data.");
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     }

// // //     load();
// // //   }, []);

// // //   useEffect(() => {
// // //     if (!activeSession) {
// // //       return undefined;
// // //     }

// // //     const interval = window.setInterval(() => {
// // //       const elapsed = Date.now() - new Date(activeSession.startedAt).getTime();
// // //       const limit = (activeSession.timeLimit || 30) * 60 * 1000;
// // //       setTimeRemaining(Math.max(0, limit - elapsed));
// // //     }, 1000);

// // //     return () => window.clearInterval(interval);
// // //   }, [activeSession]);

// // //   const selectedReport = useMemo(
// // //     () => reports.find((report) => report._id === selectedReportId),
// // //     [reports, selectedReportId],
// // //   );

// // //   async function startSession() {
// // //     if (!selectedReportId) {
// // //       toast.error("Choose a report first.");
// // //       return;
// // //     }

// // //     setSubmitting(true);
// // //     try {
// // //       const response = await mockService.startSession({ reportId: selectedReportId });
// // //       setActiveSession(response);
// // //       setCurrentQuestion(response.firstQuestion);
// // //       setTranscript([
// // //         {
// // //           type: "system",
// // //           title: "Opening",
// // //           body: response.message,
// // //         },
// // //       ]);
// // //       setTimeRemaining((response.timeLimit || 30) * 60 * 1000);
// // //       toast.success("Mock session started.");
// // //     } catch (error) {
// // //       toast.error(error.response?.data?.message || "Could not start session.");
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   }

// // //   async function submitAnswer() {
// // //     if (!activeSession || !currentQuestion || !currentAnswer.trim()) {
// // //       return;
// // //     }

// // //     setSubmitting(true);
// // //     try {
// // //       const response = await mockService.submitAnswer(activeSession.sessionId, {
// // //         question: currentQuestion,
// // //         answer: currentAnswer.trim(),
// // //       });

// // //       setTranscript((current) => [
// // //         ...current,
// // //         {
// // //           type: "answer",
// // //           question: currentQuestion,
// // //           answer: currentAnswer.trim(),
// // //           score: response.score,
// // //           feedback: response.feedback,
// // //           idealAnswer: response.idealAnswer,
// // //         },
// // //       ]);

// // //       setCurrentAnswer("");
// // //       setCurrentQuestion(response.nextQuestion || "");

// // //       if (response.minutesRemaining) {
// // //         setTimeRemaining(response.minutesRemaining * 60 * 1000);
// // //       }
// // //     } catch (error) {
// // //       toast.error(error.response?.data?.message || "Answer submission failed.");
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   }

// // //   async function endSession() {
// // //     if (!activeSession) {
// // //       return;
// // //     }

// // //     setSubmitting(true);
// // //     try {
// // //       const response = await mockService.endSession(activeSession.sessionId);
// // //       toast.success(
// // //         `Session completed. Average score ${Math.round(response.summary?.averageScore || 0)}%.`,
// // //       );
// // //       setActiveSession(null);
// // //       setCurrentQuestion("");
// // //       setCurrentAnswer("");
// // //       setTranscript([]);
// // //       setSessions(await mockService.getAllSessions());
// // //     } catch (error) {
// // //       toast.error(error.response?.data?.message || "Could not end session.");
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   }

// // //   if (loading) {
// // //     return <LoadingSpinner fullScreen label="Loading mock interview workspace" />;
// // //   }

// // //   return (
// // //     <Layout title="Mock interview" eyebrow="Practice workflow">
// // //       {!activeSession ? (
// // //         <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
// // //           <section className="space-y-6">
// // //             <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// // //               <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// // //                 Step 1
// // //               </div>
// // //               <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
// // //                 Pick a report as interview context
// // //               </h2>
// // //               <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
// // //                 Your backend mock flow is report-driven, so the UI now starts from the analysis
// // //                 artifact instead of a detached text form.
// // //               </p>

// // //               <div className="mt-8 space-y-4">
// // //                 {reports.length ? (
// // //                   reports.map((report) => (
// // //                     <button
// // //                       key={report._id}
// // //                       type="button"
// // //                       onClick={() => setSelectedReportId(report._id)}
// // //                       className={`w-full rounded-2xl border px-5 py-5 text-left transition ${
// // //                         selectedReportId === report._id
// // //                           ? "border-indigo-500 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40"
// // //                           : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
// // //                       }`}
// // //                     >
// // //                       <div className="text-lg font-semibold text-slate-900 dark:text-white">
// // //                         {report.jobRole}
// // //                       </div>
// // //                       <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
// // //                         {report.matchScore.overall}% match • created {formatDate(report.createdAt)}
// // //                       </div>
// // //                     </button>
// // //                   ))
// // //                 ) : (
// // //                   <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
// // //                     Create a report first. Mock sessions depend on one.
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </section>

// // //           <aside className="space-y-6">
// // //             <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// // //               <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// // //                 Step 2
// // //               </div>
// // //               <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
// // //                 Start live practice
// // //               </h3>
// // //               <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
// // //                 The selected report becomes the context for opening message, first question, and
// // //                 follow-up evaluation.
// // //               </p>

// // //               <button
// // //                 type="button"
// // //                 onClick={startSession}
// // //                 disabled={!selectedReport || submitting}
// // //                 className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
// // //               >
// // //                 <PlayIcon className="h-4 w-4" />
// // //                 {submitting ? "Starting..." : "Start mock session"}
// // //               </button>
// // //             </div>

// // //             <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// // //               <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// // //                 Recent sessions
// // //               </div>
// // //               <div className="mt-5 space-y-4">
// // //                 {sessions.length ? (
// // //                   sessions.slice(0, 5).map((session) => (
// // //                     <div
// // //                       key={session._id}
// // //                       className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900"
// // //                     >
// // //                       <div className="flex items-center justify-between gap-3">
// // //                         <div className="text-sm font-semibold text-slate-900 dark:text-white">
// // //                           {session.jobTitle}
// // //                         </div>
// // //                         <Badge variant={session.status === "completed" ? "success" : "warning"}>
// // //                           {session.status}
// // //                         </Badge>
// // //                       </div>
// // //                       <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
// // //                         {Math.round(session.averageScore || 0)}% average • {formatDate(session.createdAt)}
// // //                       </div>
// // //                     </div>
// // //                   ))
// // //                 ) : (
// // //                   <div className="text-sm text-slate-500 dark:text-slate-400">
// // //                     No sessions yet.
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </aside>
// // //         </div>
// // //       ) : (
// // //         <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
// // //           <aside className="space-y-6">
// // //             <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// // //               <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// // //                 Session status
// // //               </div>
// // //               <div className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">
// // //                 {formatTime(timeRemaining)}
// // //               </div>
// // //               <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
// // //                 {selectedReport?.jobRole}
// // //               </div>

// // //               <button
// // //                 type="button"
// // //                 onClick={endSession}
// // //                 disabled={submitting}
// // //                 className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900/70 dark:text-rose-400 dark:hover:bg-rose-950/40"
// // //               >
// // //                 <SquareIcon className="h-4 w-4" />
// // //                 End session
// // //               </button>
// // //             </div>

// // //             <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// // //               <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// // //                 Transcript
// // //               </div>
// // //               <div className="mt-5 space-y-4">
// // //                 {transcript.map((entry, index) => (
// // //                   <div
// // //                     key={`${entry.type}-${index}`}
// // //                     className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900"
// // //                   >
// // //                     {entry.type === "system" ? (
// // //                       <>
// // //                         <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// // //                           Opening
// // //                         </div>
// // //                         <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
// // //                           {entry.body}
// // //                         </p>
// // //                       </>
// // //                     ) : (
// // //                       <>
// // //                         <div className="text-sm font-semibold text-slate-900 dark:text-white">
// // //                           {entry.question}
// // //                         </div>
// // //                         <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
// // //                           {entry.answer}
// // //                         </p>
// // //                         <div className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
// // //                           Score {entry.score}/10
// // //                         </div>
// // //                         <p className="mt-1 text-sm leading-7 text-slate-500 dark:text-slate-400">
// // //                           {entry.feedback}
// // //                         </p>
// // //                       </>
// // //                     )}
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           </aside>

// // //           <section className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// // //             <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// // //               Current question
// // //             </div>
// // //             <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 dark:text-white">
// // //               {currentQuestion}
// // //             </h2>

// // //             <div className="mt-10">
// // //               <textarea
// // //                 value={currentAnswer}
// // //                 onChange={(event) => setCurrentAnswer(event.target.value)}
// // //                 rows={9}
// // //                 className="w-full rounded-[2rem] border border-slate-200 bg-slate-50 px-5 py-5 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
// // //                 placeholder="Write your answer as if you were speaking to an interviewer."
// // //               />

// // //               <button
// // //                 type="button"
// // //                 onClick={submitAnswer}
// // //                 disabled={submitting || !currentAnswer.trim()}
// // //                 className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
// // //               >
// // //                 <SendIcon className="h-4 w-4" />
// // //                 {submitting ? "Submitting..." : "Submit answer"}
// // //               </button>
// // //             </div>
// // //           </section>
// // //         </div>
// // //       )}
// // //     </Layout>
// // //   );
// // // }















// // import { useEffect, useRef, useState } from 'react';
// // import { useNavigate } from 'react-router';
// // import { toast } from 'sonner';
// // import { Layout } from '../components/Layout.jsx';
// // import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
// // import { interviewService } from '../services/interview.service.js';
// // import { mockService, getActiveSession, clearActiveSession } from '../services/mock.service.js';
// // import { formatDate, formatTime } from '../utils/formatters.js';

// // // ── INSTRUCTIONS SCREEN ──────────────────────────────
// // function InstructionsScreen({ onConfirm }) {
// //     return (
// //         <div className="mx-auto max-w-lg">
// //             <div className="rounded-[2rem] border border-slate-200 bg-white p-10 dark:border-slate-800 dark:bg-slate-950">
// //                 <div className="text-4xl mb-6">🎤</div>
// //                 <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
// //                     How mock interview works
// //                 </h2>
// //                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-7">
// //                     Read these rules carefully before starting.
// //                 </p>

// //                 <div className="space-y-4 mb-10">
// //                     {[
// //                         { icon: '⏱', title: '30 minute limit', desc: 'Session auto-ends when time runs out. Your score is saved.' },
// //                         { icon: '🎙', title: 'Voice powered', desc: 'Click the mic to speak. After 8 seconds of silence, your answer is automatically submitted.' },
// //                         { icon: '🚫', title: 'No going back', desc: 'Once you leave this page, your session ends. There is no way to resume.' },
// //                         { icon: '💬', title: 'Conversation style', desc: 'AI asks questions based on your report. Answer honestly like a real interview.' },
// //                         { icon: '📊', title: 'Scored live', desc: 'Every answer gets a score 0-10 with feedback. Final summary at the end.' },
// //                     ].map((rule, i) => (
// //                         <div key={i} className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
// //                             <span className="text-2xl flex-shrink-0">{rule.icon}</span>
// //                             <div>
// //                                 <div className="text-sm font-semibold text-slate-900 dark:text-white">{rule.title}</div>
// //                                 <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-6">{rule.desc}</div>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>

// //                 <div className="text-xs text-slate-400 dark:text-slate-500 mb-6 text-center">
// //                     Use Google Chrome for best voice support. Allow microphone when prompted.
// //                 </div>

// //                 <button
// //                     onClick={onConfirm}
// //                     className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
// //                 >
// //                     I understand — show me my reports
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // }

// // // ── REPORT PICKER SCREEN ─────────────────────────────
// // function ReportPicker({ reports, onStart, submitting }) {
// //     const [selected, setSelected] = useState('');
// //     const [showInstructions, setShowInstructions] = useState(false);

// //     return (
// //         <div className="mx-auto max-w-xl">
// //             <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// //                 <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-3">
// //                     Pick a report
// //                 </div>
// //                 <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
// //                     Which job are you practicing for?
// //                 </h2>
// //                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-6">
// //                     The AI will use your selected report to generate personalized questions.
// //                 </p>

// //                 <div className="space-y-3 mb-8">
// //                     {reports.length === 0 ? (
// //                         <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
// //                             No reports found. Generate a report first.
// //                         </div>
// //                     ) : reports.map((report) => (
// //                         <button
// //                             key={report._id}
// //                             type="button"
// //                             onClick={() => setSelected(report._id)}
// //                             className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
// //                                 selected === report._id
// //                                     ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40'
// //                                     : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
// //                             }`}
// //                         >
// //                             <div className="text-sm font-semibold text-slate-900 dark:text-white">
// //                                 {report.jobRole}
// //                             </div>
// //                             <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
// //                                 {report.matchScore?.overall ?? report.matchScore}% match • {formatDate(report.createdAt)}
// //                             </div>
// //                         </button>
// //                     ))}
// //                 </div>

// //                 {/* <button
// //                     type="button"
// //                     onClick={() => onStart(selected)}
// //                     disabled={!selected || submitting}
// //                     className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
// //                 >
// //                     {submitting ? 'Starting session...' : 'Start interview →'}
// //                 </button> */}


// //                 <button
// //     type="button"
// //     onClick={() => {
// //         if (!selected) { toast.error('Select a report first.'); return; }
// //         setShowInstructions(true);
// //     }}
// //     disabled={!selected || submitting}
// //     className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
// // >
// //     Start interview →
// // </button>

// // {showInstructions && (
// //     <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
// //         <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
// //             <div className="text-3xl mb-4">🎤</div>
// //             <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Before you start</h2>
// //             <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-7">Read these rules carefully.</p>
// //             <div className="space-y-3 mb-8">
// //                 {[
// //                     { icon: '⏱', title: '30 minute limit', desc: 'Session auto-ends when time runs out.' },
// //                     { icon: '🎙', title: 'Auto-submit on silence', desc: 'After 8 seconds of silence your answer is submitted automatically.' },
// //                     { icon: '🚫', title: 'No going back', desc: 'Once you leave this page your session ends permanently.' },
// //                     { icon: '📊', title: 'Scored live', desc: 'Every answer gets scored 0-10 with instant feedback.' },
// //                 ].map((rule, i) => (
// //                     <div key={i} className="flex gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4">
// //                         <span className="text-xl flex-shrink-0">{rule.icon}</span>
// //                         <div>
// //                             <div className="text-sm font-semibold text-slate-900 dark:text-white">{rule.title}</div>
// //                             <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{rule.desc}</div>
// //                         </div>
// //                     </div>
// //                 ))}
// //             </div>
// //             <div className="text-xs text-center text-slate-400 mb-5">
// //                 Use Google Chrome for best voice support. Allow microphone when prompted.
// //             </div>
// //             <div className="flex gap-3">
// //                 <button
// //                     type="button"
// //                     onClick={() => setShowInstructions(false)}
// //                     className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
// //                 >
// //                     Go back
// //                 </button>
// //                 <button
// //                     type="button"
// //                     onClick={() => { setShowInstructions(false); onStart(selected); }}
// //                     disabled={submitting}
// //                     className="flex-1 rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition"
// //                 >
// //                     {submitting ? 'Starting...' : "Let's go →"}
// //                 </button>
// //             </div>
// //         </div>
// //     </div>
// // )}
// //             </div>
// //         </div>
// //     );
// // }

// // // ── LIVE SESSION SCREEN ───────────────────────────────
// // function LiveSession({ session, onEnd }) {
// //     const [currentQuestion, setCurrentQuestion] = useState(session.firstQuestion || '');
// //     const [transcript, setTranscript] = useState('');
// //     const [isSpeaking, setIsSpeaking] = useState(false);
// //     const [isListening, setIsListening] = useState(false);
// //     const [submitting, setSubmitting] = useState(false);
// //     const [silenceCountdown, setSilenceCountdown] = useState(null);
// //     const [history, setHistory] = useState([
// //         { type: 'ai', text: session.message },
// //         { type: 'ai', text: session.firstQuestion },
// //     ]);
// //     const [timeRemaining, setTimeRemaining] = useState(
// //         (session.timeLimit || 30) * 60
// //     );
// //     const [sessionEnded, setSessionEnded] = useState(false);
// //     const [summary, setSummary] = useState(null);

// //     const recognitionRef = useRef(null);
// //     const silenceTimerRef = useRef(null);
// //     const synthRef = useRef(window.speechSynthesis);
// //     const historyEndRef = useRef(null);
// //     const isListeningRef = useRef(false);
// //     const [aiSpeaking, setAiSpeaking] = useState(false);
// // const [userSpeaking, setUserSpeaking] = useState(false);
    

// //     // Speak text
// //     const speak = (text, onDone) => {
// //         if (!window.speechSynthesis) return;
// //         synthRef.current.cancel();
// //         const utt = new SpeechSynthesisUtterance(text);
// //         utt.rate = 0.95;
// //         utt.onstart = () => setIsSpeaking(true);
// //         utt.onend = () => { setIsSpeaking(false); onDone?.(); };
// //         synthRef.current.speak(utt);
// //     };

// //     // Speak opening message on load
// //     useEffect(() => {
// //         setTimeout(() => {
// //             speak(session.message, () => {
// //                 setTimeout(() => speak(session.firstQuestion), 500);
// //             });
// //         }, 800);
// //         return () => synthRef.current?.cancel();
// //     }, []);

// //     // Timer
// //     useEffect(() => {
// //         if (session.startedAt) {
// //             const elapsed = Math.floor((Date.now() - new Date(session.startedAt)) / 1000);
// //             setTimeRemaining(Math.max(0, (session.timeLimit || 30) * 60 - elapsed));
// //         }

// //         const interval = setInterval(() => {
// //             setTimeRemaining(prev => {
// //                 if (prev <= 1) { clearInterval(interval); handleEnd(); return 0; }
// //                 return prev - 1;
// //             });
// //         }, 1000);

// //         return () => clearInterval(interval);
// //     }, []);

// //     // Prevent leaving mid-session
// //     useEffect(() => {
// //         const handler = (e) => {
// //             e.preventDefault();
// //             e.returnValue = 'Your interview session will end if you leave. Are you sure?';
// //         };
// //         window.addEventListener('beforeunload', handler);
// //         return () => window.removeEventListener('beforeunload', handler);
// //     }, []);

// //     // Auto-scroll history
// //     useEffect(() => {
// //         historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //     }, [history]);

// //     // Setup speech recognition
// //     useEffect(() => {
// //         const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
// //         if (!SR) return;

// //         const rec = new SR();
// //         rec.continuous = true;
// //         rec.interimResults = true;
// //         rec.lang = 'en-US';

// //         rec.onresult = (e) => {
// //             const text = Array.from(e.results).map(r => r[0].transcript).join('');
// //             setTranscript(text);
// //             // Reset 8-second silence timer on every word
// //             clearTimeout(silenceTimerRef.current);
// //             setSilenceCountdown(8);
// //             silenceTimerRef.current = setTimeout(() => {
// //                 setSilenceCountdown(null);
// //                 handleAutoSubmit(text);
// //             }, 8000);

// //             // Countdown display
// //             let count = 8;
// //             const countInterval = setInterval(() => {
// //                 count--;
// //                 setSilenceCountdown(count > 0 ? count : null);
// //                 if (count <= 0) clearInterval(countInterval);
// //             }, 1000);
// //         };

// //         rec.onerror = () => setIsListening(false);

// //         // const isListeningRef = useRef(false);

// //         // Update ref whenever isListening changes
// //         const toggleMic = () => {
// //             if (isListening) {
// //                 isListeningRef.current = false;
// //                 recognitionRef.current?.stop();
// //                 setIsListening(false);
// //             } else {
// //                 isListeningRef.current = true;
// //                 setTranscript('');
// //                 recognitionRef.current?.start();
// //                 setIsListening(true);
// //             }
// //         };

// //         rec.onend = () => {
// //             if (isListeningRef.current) {
// //                 try { rec.start(); } catch {}
// //             } 
// //             else {
// //                 setIsListening(false);
// //             }
// //         }
// //         recognitionRef.current = rec;
// //     }, [currentQuestion]);

// //     const handleAutoSubmit = async (text) => {
// //         if (!text?.trim() || submitting) return;
// //         recognitionRef.current?.stop();
// //         setIsListening(false);
// //         await doSubmit(text);
// //     };

// //     const toggleMic = () => {
// //         synthRef.current.cancel();
// //         if (isListening) {
// //             clearTimeout(silenceTimerRef.current);
// //             setSilenceCountdown(null);
// //             recognitionRef.current?.stop();
// //             setIsListening(false);
// //         } else {
// //             setTranscript('');
// //             recognitionRef.current?.start();
// //             setIsListening(true);
// //         }
// //     };

// //     const doSubmit = async (answerText) => {
// //         if (!answerText?.trim() || submitting) return;
// //         setSubmitting(true);
// //         synthRef.current.cancel();

// //         try {
// //             const res = await mockService.submitAnswer(session.sessionId, {
// //                 question: currentQuestion,
// //                 answer: answerText.trim(),
// //             });

// //             setHistory(prev => [
// //                 ...prev,
// //                 { type: 'user', text: answerText.trim() },
// //                 { type: 'feedback', score: res.score, feedback: res.feedback, idealAnswer: res.idealAnswer },
// //                 { type: 'ai', text: res.nextQuestion },
// //             ]);

// //             setTranscript('');
// //             setCurrentQuestion(res.nextQuestion || '');

// //             if (res.minutesRemaining) {
// //                 setTimeRemaining(Math.floor(res.minutesRemaining * 60));
// //             }

// //             if (res.timeUp) {
// //                 handleEnd();
// //                 return;
// //             }

// //             // speak(`Score: ${res.score} out of 10. ${res.feedback}`, () => {
// //             //     setTimeout(() => speak(res.nextQuestion), 500);
// //             // });

// //             speak(res.nextQuestion);

// //         } catch (err) {
// //             if (err?.response?.data?.timeUp) { handleEnd(); return; }
// //             toast.error('Submission failed. Please try again.');
// //         } finally {
// //             setSubmitting(false);
// //         }
// //     };

// //     const handleEnd = async () => {
// //         synthRef.current.cancel();
// //         clearTimeout(silenceTimerRef.current);
// //         recognitionRef.current?.stop();
// //         try {
// //             const res = await mockService.endSession(session.sessionId);
// //             setSummary(res.summary);
// //             setSessionEnded(true);
// //         } catch {
// //             setSummary(null);
// //             setSessionEnded(true);
// //         }
// //     };

// //     const formatSecs = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

// //     // ── SUMMARY SCREEN ──
// //     if (sessionEnded) {
// //         return (
// //             <div className="mx-auto max-w-xl">
// //                 <div className="rounded-[2rem] border border-slate-200 bg-white p-10 dark:border-slate-800 dark:bg-slate-950">
// //                     <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center text-2xl mb-6">✓</div>
// //                     <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">Interview complete</h2>
// //                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Here's how you performed</p>

// //                     <div className="grid grid-cols-2 gap-4 mb-8">
// //                         <div className="rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-5">
// //                             <div className="text-3xl font-semibold text-slate-900 dark:text-white">{summary?.totalQuestions || 0}</div>
// //                             <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Questions answered</div>
// //                         </div>
// //                         <div className="rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-5">
// //                             <div className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{summary?.averageScore ?? 0}/10</div>
// //                             <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Average score</div>
// //                         </div>
// //                     </div>

// //                     {summary?.answers?.map((a, i) => (
// //                         <div key={i} className="border-t border-slate-100 dark:border-slate-800 pt-5 mt-5">
// //                             <div className="flex justify-between items-start gap-3 mb-2">
// //                                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{a.question}</span>
// //                                 <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
// //                                     a.score >= 7 ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
// //                                     : a.score >= 5 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
// //                                     : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
// //                                 }`}>{a.score}/10</span>
// //                             </div>
// //                             <p className="text-sm text-slate-500 dark:text-slate-400 leading-6">{a.feedback}</p>
// //                         </div>
// //                     ))}

// //                     <button onClick={onEnd} className="w-full mt-8 rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition">
// //                         Back to dashboard
// //                     </button>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     // ── LIVE INTERVIEW SCREEN ──
// //     return (
// //         // <div className="flex gap-6 h-[calc(100vh-120px)]">
// //             <div style={{
// //                 position: 'fixed',
// //                 inset: 0,
// //                 zIndex: 100,
// //                 background: 'var(--background)',
// //                 display: 'flex',
// //                 gap: 0,
// //                 overflow: 'hidden',
// //             }}>



// //                 <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

// //     {/* 🤖 AI AVATAR */}
// //     <div className={`ai-avatar ${aiSpeaking ? "speaking" : ""}`}>
// //         <img src="/ai-avatar.png" alt="AI" />
// //     </div>

// //     {/* 🔊 SOUND WAVE */}
// //     {aiSpeaking && (
// //         <div className="wave">
// //             <span></span><span></span><span></span>
// //         </div>
// //     )}

// //     {/* 🧠 QUESTION TEXT */}
// //     <div style={{ marginTop: 20, fontSize: 18 }}>
// //         {currentQuestion}
// //     </div>

// // </div>

// // {/* 🧑 USER AVATAR (BOTTOM RIGHT) */}
// // <div className={`user-avatar ${userSpeaking ? "speaking" : ""}`}>
// //     <img src="/user-avatar.png" alt="User" />
// // </div>

// //             {/* LEFT — conversation history */}
// //             <div className="w-80 flex-shrink-0 rounded-[2rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 flex flex-col overflow-hidden">
// //                 <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
// //                     <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// //                         Conversation
// //                     </div>
// //                 </div>

// //                 <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
// //                     {history.map((item, i) => (
// //                         <div key={i}>
// //                             {item.type === 'ai' && item.text && (
// //                                 <div className="flex gap-2 items-start">
// //                                     <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">🤖</div>
// //                                     <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 dark:text-slate-300 leading-6 flex-1">
// //                                         {item.text}
// //                                     </div>
// //                                 </div>
// //                             )}
// //                             {item.type === 'user' && (
// //                                 <div className="flex gap-2 items-start flex-row-reverse">
// //                                     <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">🧑</div>
// //                                     <div className="bg-indigo-600 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white leading-6 flex-1">
// //                                         {item.text}
// //                                     </div>
// //                                 </div>
// //                             )}
// //                             {item.type === 'feedback' && (
// //                                 <div className="ml-9 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3">
// //                                     <div className={`text-xs font-semibold mb-1 ${
// //                                         item.score >= 7 ? 'text-green-600 dark:text-green-400'
// //                                         : item.score >= 5 ? 'text-amber-600 dark:text-amber-400'
// //                                         : 'text-red-600 dark:text-red-400'
// //                                     }`}>Score: {item.score}/10</div>
// //                                     <p className="text-xs text-slate-500 dark:text-slate-400 leading-5">{item.feedback}</p>
// //                                 </div>
// //                             )}
// //                         </div>
// //                     ))}
// //                     <div ref={historyEndRef} />
// //                 </div>
// //             </div>

// //             {/* CENTER — AI + mic */}
// //             <div className="flex-1 rounded-[2rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 flex flex-col">

// //                 {/* Top bar */}
// //                 <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
// //                     <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
// //                         Live session
// //                     </div>
// //                     <div className="flex items-center gap-3">
// //                         <div className={`flex items-center gap-2 text-sm font-semibold font-mono ${timeRemaining < 300 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
// //                             <div className={`w-2 h-2 rounded-full animate-pulse ${timeRemaining < 300 ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
// //                             {formatSecs(timeRemaining)}
// //                         </div>
// //                         <button
// //                             onClick={handleEnd}
// //                             disabled={submitting}
// //                             className="rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40 transition"
// //                         >
// //                             End session
// //                         </button>
// //                     </div>
// //                 </div>

// //                 {/* AI avatar + question */}
// //                 <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">

// //                     {/* Vibrating emoji avatar */}
// //                     <div className="relative">
// //                         <div className={`absolute inset-0 rounded-full border border-indigo-200 dark:border-indigo-800 ${isSpeaking ? 'animate-ping opacity-20' : 'opacity-0'}`} style={{ inset: '-12px' }}></div>
// //                         <div className={`w-28 h-28 rounded-full border-2 flex items-center justify-center text-5xl transition-all duration-200 ${
// //                             isSpeaking
// //                                 ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 animate-[vibrate_0.12s_infinite]'
// //                                 : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
// //                         }`}>
// //                             🤖
// //                         </div>
// //                     </div>

// //                     {/* Status */}
// //                     <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
// //                         <div className={`w-2 h-2 rounded-full ${
// //                             isListening ? 'bg-red-500 animate-pulse'
// //                             : isSpeaking ? 'bg-indigo-500 animate-pulse'
// //                             : submitting ? 'bg-amber-500 animate-pulse'
// //                             : 'bg-slate-300 dark:bg-slate-600'
// //                         }`}></div>
// //                         {isListening ? `Listening... ${silenceCountdown !== null ? `auto-submit in ${silenceCountdown}s` : ''}`
// //                         : isSpeaking ? 'AI is speaking...'
// //                         : submitting ? 'Evaluating your answer...'
// //                         : 'Your turn'}
// //                     </div>

// //                     {/* Current question */}
// //                     <div className="max-w-lg text-center">
// //                         <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-3">
// //                             Current question
// //                         </div>
// //                         <p className="text-xl font-medium text-slate-900 dark:text-white leading-8">
// //                             {currentQuestion}
// //                         </p>
// //                     </div>

// //                     {/* Transcript box — shows while listening */}
// //                     {(isListening || transcript) && (
// //                         <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 px-5 py-4">
// //                             <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">Your answer</div>
// //                             <p className="text-sm text-slate-700 dark:text-slate-300 leading-6 min-h-[40px]">
// //                                 {transcript || <span className="text-slate-400 dark:text-slate-600">Listening...</span>}
// //                             </p>
// //                         </div>
// //                     )}

// //                     {/* Mic button */}
// //                     <button
// //                         onClick={toggleMic}
// //                         disabled={submitting || isSpeaking}
// //                         className={`flex items-center gap-3 rounded-2xl px-8 py-4 text-sm font-semibold transition ${
// //                             isListening
// //                                 ? 'bg-red-600 text-white hover:bg-red-500'
// //                                 : 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
// //                         }`}
// //                     >
// //                         <span className="text-xl">🎤</span>
// //                         {isListening
// //                             ? `Stop speaking ${silenceCountdown !== null ? `(auto in ${silenceCountdown}s)` : ''}`
// //                             : submitting ? 'Evaluating...'
// //                             : 'Click to speak'}
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // // ── MAIN PAGE ─────────────────────────────────────────
// // export function MockInterview() {
// //     const navigate = useNavigate();
// //     const [phase, setPhase] = useState('picker'); // instructions | picker | session
// //     const [reports, setReports] = useState([]);
// //     const [activeSession, setActiveSession] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [submitting, setSubmitting] = useState(false);

// //     useEffect(() => {
// //         async function load() {
// //             try {
// //                 // Check for existing ongoing session
// //                 const saved = getActiveSession();
// //                 if (saved) {
// //                     setActiveSession(saved);
// //                     setPhase('session');
// //                     setLoading(false);
// //                     return;
// //                 }
// //                 const reportsRes = await interviewService.getAllReports();
// //                 setReports(reportsRes);
// //             } catch {
// //                 toast.error('Could not load data.');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         }
// //         load();
// //     }, []);

// //     const handleStart = async (reportId) => {
// //         if (!reportId) { toast.error('Select a report first.'); return; }
// //         setSubmitting(true);
// //         try {
// //             const session = await mockService.startSession({ reportId });
// //             setActiveSession(session);
// //             setPhase('session');
// //         } catch (err) {
// //             toast.error(err?.response?.data?.message || 'Could not start session.');
// //         } finally {
// //             setSubmitting(false);
// //         }
// //     };

// //     const handleEnd = () => {
// //         clearActiveSession();
// //         setActiveSession(null);
// //         setPhase('instructions');
// //         navigate('/dashboard');
// //     };

// //     if (loading) return <LoadingSpinner fullScreen label="Loading mock interview" />;

// //     if (phase === 'session' && activeSession) {
// //         return (
// //             <LiveSession session={activeSession} onEnd={handleEnd} />
// //         );
// //     }


// //     // return (
// //     //     <Layout title="Mock interview" eyebrow="Practice workflow">
// //     //         {phase === 'instructions' && (
// //     //             <InstructionsScreen onConfirm={() => setPhase('picker')} />
// //     //         )}
// //     //         {phase === 'picker' && (
// //     //             <ReportPicker reports={reports} onStart={handleStart} submitting={submitting} />
// //     //         )}
// //     //         {phase === 'session' && activeSession && (
// //     //             <LiveSession session={activeSession} onEnd={handleEnd} />
// //     //         )}
// //     //     </Layout>
// //     // );


// //     return (
// //         <Layout title="Mock interview" eyebrow="Practice workflow">
// //             {phase === 'instructions' && (
// //                 <InstructionsScreen onConfirm={() => setPhase('picker')} />
// //             )}

// //             {phase === 'picker' && (
// //                 <ReportPicker
// //                     reports={reports}
// //                     onStart={handleStart}
// //                     submitting={submitting}
// //                 />
// //             )}
// //         </Layout>
// //     );
// // }
















// import { useEffect, useRef, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router';
// import { toast } from 'sonner';
// import { Layout } from '../components/Layout.jsx';
// import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
// import { interviewService } from '../services/interview.service.js';
// import { mockService, getActiveSession, clearActiveSession } from '../services/mock.service.js';
// import { formatDate } from '../utils/formatters.js';

// // ── INSTRUCTIONS SCREEN ──────────────────────────────────
// function InstructionsScreen({ onConfirm }) {
//   return (
//     <div className="mx-auto max-w-lg">
//       <div className="rounded-[2rem] border border-slate-200 bg-white p-10 dark:border-slate-800 dark:bg-slate-950">
//         <div className="text-4xl mb-6">🎤</div>
//         <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
//           How mock interview works
//         </h2>
//         <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-7">
//           Read these rules carefully before starting.
//         </p>
//         <div className="space-y-4 mb-10">
//           {[
//             { icon: '⏱', title: '30 minute limit', desc: 'Session auto-ends when time runs out. Your score is saved.' },
//             { icon: '🎙', title: 'Voice powered', desc: 'Click the mic to speak. After 8 seconds of silence your answer is submitted.' },
//             { icon: '🔇', title: 'No score reading', desc: 'The AI will only speak the next question — not your score or feedback.' },
//             { icon: '🚫', title: 'No going back', desc: 'Once you leave this page your session ends permanently.' },
//             { icon: '📊', title: 'Scored live', desc: 'Every answer gets a score 0–10 with feedback shown in the sidebar.' },
//           ].map((rule, i) => (
//             <div key={i} className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
//               <span className="text-2xl flex-shrink-0">{rule.icon}</span>
//               <div>
//                 <div className="text-sm font-semibold text-slate-900 dark:text-white">{rule.title}</div>
//                 <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-6">{rule.desc}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="text-xs text-slate-400 dark:text-slate-500 mb-6 text-center">
//           Use Google Chrome for best voice support. Allow microphone when prompted.
//         </div>
//         <button onClick={onConfirm} className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
//           I understand — show me my reports
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── REPORT PICKER ────────────────────────────────────────
// function ReportPicker({ reports, onStart, submitting }) {
//   const [selected, setSelected] = useState('');
//   const [showConfirm, setShowConfirm] = useState(false);

//   return (
//     <div className="mx-auto max-w-xl">
//       <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
//         <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-3">
//           Pick a report
//         </div>
//         <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
//           Which job are you practicing for?
//         </h2>
//         <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-6">
//           The AI will use your selected report to generate personalized questions.
//         </p>

//         <div className="space-y-3 mb-8">
//           {reports.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
//               No reports found. Generate a report first.
//             </div>
//           ) : reports.map((report) => (
//             <button
//               key={report._id}
//               type="button"
//               onClick={() => setSelected(report._id)}
//               className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
//                 selected === report._id
//                   ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40'
//                   : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
//               }`}
//             >
//               <div className="text-sm font-semibold text-slate-900 dark:text-white">{report.jobRole}</div>
//               <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//                 {report.matchScore?.overall ?? report.matchScore}% match • {formatDate(report.createdAt)}
//               </div>
//             </button>
//           ))}
//         </div>

//         <button
//           type="button"
//           onClick={() => { if (!selected) { toast.error('Select a report first.'); return; } setShowConfirm(true); }}
//           disabled={!selected || submitting}
//           className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           Start interview →
//         </button>

//         {showConfirm && (
//           <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
//             <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
//               <div className="text-3xl mb-4">🎤</div>
//               <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Ready to start?</h2>
//               <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-6">
//                 Once you start, the session runs for 30 minutes. Don't leave the page or your session will end.
//               </p>
//               <div className="flex gap-3">
//                 <button type="button" onClick={() => setShowConfirm(false)} className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition">
//                   Go back
//                 </button>
//                 <button type="button" onClick={() => { setShowConfirm(false); onStart(selected); }} disabled={submitting} className="flex-1 rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition">
//                   {submitting ? 'Starting...' : "Let's go →"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── LIVE SESSION (FULLSCREEN, NO SIDEBAR) ────────────────
// function LiveSession({ session, onEnd }) {
//   const [currentQuestion, setCurrentQuestion] = useState(session.firstQuestion || '');
//   const [transcript, setTranscript] = useState('');
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [silenceCountdown, setSilenceCountdown] = useState(null);
//   const [history, setHistory] = useState([
//     { type: 'ai', text: session.message },
//     { type: 'ai', text: session.firstQuestion },
//   ]);
//   const [timeRemaining, setTimeRemaining] = useState((session.timeLimit || 30) * 60);
//   const [sessionEnded, setSessionEnded] = useState(false);
//   const [summary, setSummary] = useState(null);

//   // Refs — avoid stale closures
//   const recognitionRef = useRef(null);
//   const silenceTimerRef = useRef(null);
//   const countdownIntervalRef = useRef(null);
//   const synthRef = useRef(window.speechSynthesis);
//   const historyEndRef = useRef(null);
//   const isListeningRef = useRef(false);
//   const submittingRef = useRef(false);
//   const transcriptRef = useRef('');

//   // Keep refs in sync
//   useEffect(() => { submittingRef.current = submitting; }, [submitting]);
//   useEffect(() => { transcriptRef.current = transcript; }, [transcript]);

//   // ── SPEAK — only speaks text, NEVER score ──
//   const speak = useCallback((text, onDone) => {
//     if (!window.speechSynthesis) { onDone?.(); return; }
//     synthRef.current.cancel();
//     const utt = new SpeechSynthesisUtterance(text);
//     utt.rate = 0.95;
//     utt.pitch = 1;
//     utt.onstart = () => setIsSpeaking(true);
//     utt.onend = () => { setIsSpeaking(false); onDone?.(); };
//     utt.onerror = () => { setIsSpeaking(false); onDone?.(); };
//     synthRef.current.speak(utt);
//   }, []);

//   // Speak opening on load
//   useEffect(() => {
//     const t = setTimeout(() => {
//       speak(session.message, () => {
//         const t2 = setTimeout(() => speak(session.firstQuestion), 600);
//         return () => clearTimeout(t2);
//       });
//     }, 800);
//     return () => { clearTimeout(t); synthRef.current?.cancel(); };
//   }, []); // eslint-disable-line

//   // Timer — sync from startedAt
//   useEffect(() => {
//     if (session.startedAt) {
//       const elapsed = Math.floor((Date.now() - new Date(session.startedAt)) / 1000);
//       setTimeRemaining(Math.max(0, (session.timeLimit || 30) * 60 - elapsed));
//     }
//     const interval = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev <= 1) { clearInterval(interval); handleEnd(); return 0; }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []); // eslint-disable-line

//   // Warn before leaving
//   useEffect(() => {
//     const handler = (e) => { e.preventDefault(); e.returnValue = 'Your interview will end if you leave. Sure?'; };
//     window.addEventListener('beforeunload', handler);
//     return () => window.removeEventListener('beforeunload', handler);
//   }, []);

//   // Auto-scroll
//   useEffect(() => { historyEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

//   // ── SETUP SPEECH RECOGNITION ──
//   useEffect(() => {
//     const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SR) { toast.error('Speech recognition not supported. Use Chrome.'); return; }

//     const rec = new SR();
//     rec.continuous = true;
//     rec.interimResults = true;
//     rec.lang = 'en-US';

//     rec.onresult = (e) => {
//       const text = Array.from(e.results).map(r => r[0].transcript).join('');
//       setTranscript(text);
//       transcriptRef.current = text;

//       // Clear previous timers
//       clearTimeout(silenceTimerRef.current);
//       clearInterval(countdownIntervalRef.current);

//       // 8-second silence countdown
//       setSilenceCountdown(8);
//       let count = 8;
//       countdownIntervalRef.current = setInterval(() => {
//         count--;
//         setSilenceCountdown(count > 0 ? count : null);
//         if (count <= 0) clearInterval(countdownIntervalRef.current);
//       }, 1000);

//       // Auto-submit after 8s silence
//       silenceTimerRef.current = setTimeout(() => {
//         setSilenceCountdown(null);
//         if (!submittingRef.current && transcriptRef.current?.trim()) {
//           handleAutoSubmit(transcriptRef.current);
//         }
//       }, 8000);
//     };

//     // KEY FIX: onend — restart only if still in listening mode
//     rec.onend = () => {
//       if (isListeningRef.current && !submittingRef.current) {
//         try { rec.start(); } catch (_) { /* already started */ }
//       } else {
//         setIsListening(false);
//       }
//     };

//     rec.onerror = (e) => {
//       if (e.error === 'no-speech') return; // ignore silence errors — don't restart
//       if (e.error === 'aborted') return;
//       setIsListening(false);
//       isListeningRef.current = false;
//     };

//     recognitionRef.current = rec;
//     return () => { rec.onend = null; rec.onerror = null; try { rec.stop(); } catch (_) {} };
//   }, []); // setup once

//   const handleAutoSubmit = async (text) => {
//     if (!text?.trim() || submittingRef.current) return;
//     // Stop mic first
//     isListeningRef.current = false;
//     clearTimeout(silenceTimerRef.current);
//     clearInterval(countdownIntervalRef.current);
//     setSilenceCountdown(null);
//     try { recognitionRef.current?.stop(); } catch (_) {}
//     setIsListening(false);
//     await doSubmit(text);
//   };

//   const toggleMic = () => {
//     synthRef.current.cancel();
//     if (isListening) {
//       isListeningRef.current = false;
//       clearTimeout(silenceTimerRef.current);
//       clearInterval(countdownIntervalRef.current);
//       setSilenceCountdown(null);
//       try { recognitionRef.current?.stop(); } catch (_) {}
//       setIsListening(false);
//     } else {
//       setTranscript('');
//       transcriptRef.current = '';
//       isListeningRef.current = true;
//       try { recognitionRef.current?.start(); } catch (_) {}
//       setIsListening(true);
//     }
//   };

//   const doSubmit = async (answerText) => {
//     if (!answerText?.trim() || submittingRef.current) return;
//     setSubmitting(true);
//     synthRef.current.cancel();

//     try {
//       const res = await mockService.submitAnswer(session.sessionId, {
//         question: currentQuestion,
//         answer: answerText.trim(),
//       });

//       setHistory(prev => [
//         ...prev,
//         { type: 'user', text: answerText.trim() },
//         { type: 'feedback', score: res.score, feedback: res.feedback, idealAnswer: res.idealAnswer },
//         ...(res.nextQuestion ? [{ type: 'ai', text: res.nextQuestion }] : []),
//       ]);

//       setTranscript('');
//       transcriptRef.current = '';
//       setCurrentQuestion(res.nextQuestion || '');

//       if (res.minutesRemaining) {
//         setTimeRemaining(Math.floor(res.minutesRemaining * 60));
//       }

//       if (res.timeUp) { handleEnd(); return; }

//       // ✅ ONLY speak the next question — not score or feedback
//       if (res.nextQuestion) {
//         speak(res.nextQuestion);
//       }

//     } catch (err) {
//       if (err?.response?.data?.timeUp) { handleEnd(); return; }
//       toast.error('Submission failed. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEnd = async () => {
//     synthRef.current.cancel();
//     isListeningRef.current = false;
//     clearTimeout(silenceTimerRef.current);
//     clearInterval(countdownIntervalRef.current);
//     try { recognitionRef.current?.stop(); } catch (_) {}
//     setIsListening(false);
//     try {
//       const res = await mockService.endSession(session.sessionId);
//       setSummary(res.summary);
//     } catch {
//       setSummary(null);
//     }
//     setSessionEnded(true);
//     clearActiveSession();
//   };

//   const formatSecs = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

//   // ── SUMMARY ──
//   if (sessionEnded) {
//     return (
//       <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--background)', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
//         <div className="w-full max-w-xl">
//           <div className="rounded-[2rem] border border-slate-200 bg-white p-10 dark:border-slate-800 dark:bg-slate-950">
//             <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center text-2xl mb-6">✓</div>
//             <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">Interview complete</h2>
//             <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Here's how you performed</p>

//             <div className="grid grid-cols-2 gap-4 mb-8">
//               <div className="rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-5">
//                 <div className="text-3xl font-semibold text-slate-900 dark:text-white">{summary?.totalQuestions || 0}</div>
//                 <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Questions answered</div>
//               </div>
//               <div className="rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-5">
//                 <div className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{summary?.averageScore ?? 0}/10</div>
//                 <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Average score</div>
//               </div>
//             </div>

//             {summary?.answers?.map((a, i) => (
//               <div key={i} className="border-t border-slate-100 dark:border-slate-800 pt-5 mt-5">
//                 <div className="flex justify-between items-start gap-3 mb-2">
//                   <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{a.question}</span>
//                   <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
//                     a.score >= 7 ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
//                     : a.score >= 5 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
//                     : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
//                   }`}>{a.score}/10</span>
//                 </div>
//                 <p className="text-sm text-slate-500 dark:text-slate-400 leading-6">{a.feedback}</p>
//               </div>
//             ))}

//             <button onClick={onEnd} className="w-full mt-8 rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition">
//               Back to dashboard
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── FULLSCREEN LIVE SESSION — no sidebar, no Layout ──
//   return (
//     <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--sb-bg, #f8fafc)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

//       {/* Top bar */}
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--sb-border)', background: 'var(--sb-bg)', flexShrink: 0 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <div style={{ width: 32, height: 32, borderRadius: 10, background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>AI</div>
//           <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sb-text, #0f172a)' }}>Mock Interview</div>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <div style={{
//             display: 'flex', alignItems: 'center', gap: 6,
//             fontSize: 15, fontWeight: 700, fontFamily: 'monospace',
//             color: timeRemaining < 300 ? '#ef4444' : 'var(--sb-text, #0f172a)',
//           }}>
//             <div style={{ width: 8, height: 8, borderRadius: '50%', background: timeRemaining < 300 ? '#ef4444' : '#4f46e5', animation: 'pulse 1.5s infinite' }} />
//             {formatSecs(timeRemaining)}
//           </div>
//           <button onClick={handleEnd} disabled={submitting} style={{ padding: '6px 14px', borderRadius: 10, border: '1px solid #fca5a5', background: 'transparent', color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
//             onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
//             onMouseOut={e => e.currentTarget.style.background = 'transparent'}
//           >
//             End session
//           </button>
//         </div>
//       </div>

//       {/* Body */}
//       <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

//         {/* Center — AI + mic */}
//         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 48px', gap: 32 }}>

//           {/* AI avatar */}
//           <div style={{ position: 'relative' }}>
//             {isSpeaking && (
//               <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '1px solid rgba(99,102,241,0.3)', animation: 'ping 1s infinite' }} />
//             )}
//             <div style={{
//               width: 112, height: 112, borderRadius: '50%',
//               border: isSpeaking ? '2px solid #818cf8' : '2px solid var(--sb-border, #e2e8f0)',
//               background: isSpeaking ? 'rgba(99,102,241,0.08)' : 'var(--sb-hover, #f1f5f9)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontSize: 44,
//               animation: isSpeaking ? 'vibrate 0.12s infinite' : 'none',
//               transition: 'border-color 0.2s, background 0.2s',
//             }}>
//               🤖
//             </div>
//           </div>

//           {/* Status */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--sb-text3, #94a3b8)' }}>
//             <div style={{
//               width: 8, height: 8, borderRadius: '50%',
//               background: isListening ? '#ef4444' : isSpeaking ? '#4f46e5' : submitting ? '#f59e0b' : '#cbd5e1',
//               animation: (isListening || isSpeaking || submitting) ? 'pulse 1s infinite' : 'none',
//             }} />
//             {isListening
//               ? `Listening...${silenceCountdown !== null ? ` auto-submit in ${silenceCountdown}s` : ''}`
//               : isSpeaking ? 'AI is speaking...'
//               : submitting ? 'Evaluating your answer...'
//               : 'Your turn to speak'}
//           </div>

//           {/* Question */}
//           <div style={{ maxWidth: 520, textAlign: 'center' }}>
//             <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--sb-text3, #94a3b8)', marginBottom: 12 }}>Current question</div>
//             <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--sb-text, #0f172a)', lineHeight: 1.6 }}>{currentQuestion}</p>
//           </div>

//           {/* Transcript box */}
//           {(isListening || transcript) && (
//             <div style={{
//               width: '100%', maxWidth: 520,
//               borderRadius: 20, border: '1px solid var(--sb-border, #e2e8f0)',
//               background: 'var(--sb-hover, #f1f5f9)',
//               padding: '16px 20px',
//             }}>
//               <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sb-text3, #94a3b8)', marginBottom: 8 }}>Your answer</div>
//               <p style={{ fontSize: 13, color: 'var(--sb-text2, #475569)', lineHeight: 1.7, minHeight: 40 }}>
//                 {transcript || <span style={{ color: 'var(--sb-text3, #94a3b8)' }}>Listening...</span>}
//               </p>
//             </div>
//           )}

//           {/* Mic button */}
//           <button
//             onClick={toggleMic}
//             disabled={submitting || isSpeaking}
//             style={{
//               display: 'flex', alignItems: 'center', gap: 12,
//               padding: '14px 32px', borderRadius: 20,
//               background: isListening ? '#dc2626' : '#4f46e5',
//               color: '#fff', border: 'none', cursor: submitting || isSpeaking ? 'not-allowed' : 'pointer',
//               fontSize: 14, fontWeight: 600,
//               opacity: submitting || isSpeaking ? 0.5 : 1,
//               transition: 'background 0.15s, opacity 0.15s',
//             }}
//           >
//             <span style={{ fontSize: 20 }}>🎤</span>
//             {isListening
//               ? `Stop speaking${silenceCountdown !== null ? ` (auto in ${silenceCountdown}s)` : ''}`
//               : submitting ? 'Evaluating...'
//               : 'Click to speak'}
//           </button>
//         </div>

//         {/* Right — conversation history */}
//         <div style={{
//           width: 320, flexShrink: 0,
//           borderLeft: '1px solid var(--sb-border, #e2e8f0)',
//           display: 'flex', flexDirection: 'column',
//           background: 'var(--sb-bg, #f8fafc)',
//           overflow: 'hidden',
//         }}>
//           <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid var(--sb-border, #e2e8f0)', flexShrink: 0 }}>
//             <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--sb-text3, #94a3b8)' }}>Conversation</div>
//           </div>
//           <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
//             {history.map((item, i) => (
//               <div key={i}>
//                 {item.type === 'ai' && item.text && (
//                   <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
//                     <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, marginTop: 2 }}>🤖</div>
//                     <div style={{ flex: 1, background: 'var(--sb-card, #fff)', border: '1px solid var(--sb-border, #e2e8f0)', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', fontSize: 12, color: 'var(--sb-text2, #475569)', lineHeight: 1.6 }}>
//                       {item.text}
//                     </div>
//                   </div>
//                 )}
//                 {item.type === 'user' && (
//                   <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
//                     <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(100,116,139,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, marginTop: 2 }}>🧑</div>
//                     <div style={{ flex: 1, background: '#4f46e5', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', fontSize: 12, color: '#fff', lineHeight: 1.6 }}>
//                       {item.text}
//                     </div>
//                   </div>
//                 )}
//                 {item.type === 'feedback' && (
//                   <div style={{ marginLeft: 34, background: 'var(--sb-hover, #f1f5f9)', border: '1px solid var(--sb-border, #e2e8f0)', borderRadius: 14, padding: '10px 14px' }}>
//                     <div style={{
//                       fontSize: 11, fontWeight: 700, marginBottom: 4,
//                       color: item.score >= 7 ? '#16a34a' : item.score >= 5 ? '#d97706' : '#dc2626',
//                     }}>Score: {item.score}/10</div>
//                     <p style={{ fontSize: 11, color: 'var(--sb-text3, #94a3b8)', lineHeight: 1.5 }}>{item.feedback}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//             <div ref={historyEndRef} />
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
//         @keyframes ping { 0%{transform:scale(1);opacity:0.3}75%,100%{transform:scale(1.5);opacity:0} }
//         @keyframes vibrate {
//           0%,100%{transform:translate(0,0)}
//           20%{transform:translate(-2px,1px)}
//           40%{transform:translate(2px,-1px)}
//           60%{transform:translate(-1px,2px)}
//           80%{transform:translate(1px,-2px)}
//         }
//       `}</style>
//     </div>
//   );
// }

// // ── MAIN PAGE ────────────────────────────────────────────
// export function MockInterview() {
//   const navigate = useNavigate();
//   const [phase, setPhase] = useState('instructions');
//   const [reports, setReports] = useState([]);
//   const [activeSession, setActiveSession] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     async function load() {
//       try {
//         const saved = getActiveSession();
//         if (saved) { setActiveSession(saved); setPhase('session'); setLoading(false); return; }
//         const reportsRes = await interviewService.getAllReports();
//         setReports(reportsRes);
//       } catch {
//         toast.error('Could not load data.');
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   const handleStart = async (reportId) => {
//     if (!reportId) { toast.error('Select a report first.'); return; }
//     setSubmitting(true);
//     try {
//       const session = await mockService.startSession({ reportId });
//       setActiveSession(session);
//       setPhase('session');
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Could not start session.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEnd = () => {
//     clearActiveSession();
//     setActiveSession(null);
//     setPhase('instructions');
//     navigate('/dashboard');
//   };

//   if (loading) return <LoadingSpinner fullScreen label="Loading mock interview" />;

//   // Fullscreen session — skip Layout wrapper
//   if (phase === 'session' && activeSession) {
//     return <LiveSession session={activeSession} onEnd={handleEnd} />;
//   }

//   return (
//     <Layout title="Mock interview" eyebrow="Practice workflow">
//       {phase === 'instructions' && (
//         <InstructionsScreen onConfirm={() => setPhase('picker')} />
//       )}
//       {phase === 'picker' && (
//         <ReportPicker reports={reports} onStart={handleStart} submitting={submitting} />
//       )}
//     </Layout>
//   );
// }

































































import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Layout } from '../components/Layout.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { interviewService } from '../services/interview.service.js';
import { mockService, getActiveSession, clearActiveSession } from '../services/mock.service.js';
import { formatDate } from '../utils/formatters.js';

// ─────────────────────────────────────────────────────────
// INSTRUCTIONS
// ─────────────────────────────────────────────────────────
function InstructionsScreen({ onConfirm }) {
  const rules = [
    { icon: '⏱', title: '30-minute session', desc: 'Timer starts immediately. Session auto-ends and your score is saved.' },
    { icon: '🎤', title: 'Press mic → speak → submit', desc: 'An 8-second progress bar counts down after you stop speaking, then auto-submits your answer.' },
    { icon: '🔇', title: 'AI speaks questions only', desc: 'Scores and feedback appear in the sidebar — never read aloud.' },
    { icon: '⚡', title: 'Groq AI scores instantly', desc: 'Each answer is evaluated in under 1 second, scored out of 10.' },
    { icon: '🚫', title: 'Stay on the page', desc: 'If you navigate away 3 times, the session ends automatically as a cheat detection.' },
    { icon: '💡', title: '3 bad answers = pause', desc: 'Three consecutive 1/10 scores will pause your session so you can refocus.' },
  ];
  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="px-8 py-7 border-b border-slate-100 dark:border-slate-800" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">🎤</div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Voice Mock Interview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">AI-powered practice — read the rules below</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-5 space-y-2.5">
          {rules.map((r, i) => (
            <div key={i} className="flex gap-3.5 px-4 py-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition">
              <span className="text-lg flex-shrink-0 mt-0.5">{r.icon}</span>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{r.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-5">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-8 pb-8 pt-2">
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-4 py-3 text-xs text-amber-800 dark:text-amber-300 mb-5">
            ⚠️ Use <strong>Google Chrome</strong> for best voice support. Allow microphone when prompted.
          </div>
          <button onClick={onConfirm} className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3.5 text-sm font-bold text-white transition shadow-lg shadow-indigo-500/20">
            I understand — pick a report →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// REPORT PICKER
// ─────────────────────────────────────────────────────────
function ReportPicker({ reports, onStart, submitting }) {
  const [selected, setSelected] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Step 2 of 2</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Which role are you practicing?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-6">AI tailors questions to your selected resume report.</p>
        </div>
        <div className="px-8 py-5">
          {reports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center">
              <div className="text-3xl mb-3">📄</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No reports yet. Create one first.</p>
              <Link to="/reports/new" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition">Create a report</Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {reports.map(r => (
                <button key={r._id} type="button" onClick={() => setSelected(r._id)}
                  className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition ${selected === r._id ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-950/40' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{r.jobRole}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{formatDate(r.createdAt)}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">{r.matchScore?.overall ?? r.matchScore}%</div>
                        <div className="text-xs text-slate-400">match</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${selected === r._id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 dark:border-slate-600'}`}>
                        {selected === r._id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {reports.length > 0 && (
          <div className="px-8 pb-8">
            <button type="button" onClick={() => { if (!selected) { toast.error('Select a report first.'); return; } setShowConfirm(true); }}
              disabled={!selected || submitting}
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3.5 text-sm font-bold text-white transition shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed">
              {selected ? 'Start interview →' : 'Select a report above'}
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-2xl">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to begin?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-6">
              Your 30-minute session starts now. Leaving the page 3 times will auto-end the session. Use "End session" when done.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition">Cancel</button>
              <button type="button" onClick={() => { setShowConfirm(false); onStart(selected); }} disabled={submitting}
                className="flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-bold text-white transition shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                {submitting ? 'Starting...' : "Let's go 🚀"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LIVE SESSION
// ─────────────────────────────────────────────────────────
function LiveSession({ session, onEnd }) {
  const [currentQuestion, setCurrentQuestion] = useState(session.firstQuestion || '');
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [silenceCountdown, setSilenceCountdown] = useState(null); // 0–8
  const [history, setHistory] = useState([
    { type: 'ai', text: session.message },
    { type: 'ai', text: session.firstQuestion },
  ]);
  const [timeRemaining, setTimeRemaining] = useState((session.timeLimit || 30) * 60);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [summary, setSummary] = useState(null);
  const [quitModal, setQuitModal] = useState(false);       // back-button confirmation
  const [cheatModal, setCheatModal] = useState(false);     // cheat detection
  const [exhaustedModal, setExhaustedModal] = useState(false); // 3× 1/10
  const [visibilityWarnings, setVisibilityWarnings] = useState(0);
  const [consecutiveLow, setConsecutiveLow] = useState(0);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const historyEndRef = useRef(null);
  const isListeningRef = useRef(false);
  const submittingRef = useRef(false);
  const transcriptRef = useRef('');
  const visibilityRef = useRef(0);
  const consecutiveLowRef = useRef(0);

  useEffect(() => { submittingRef.current = submitting; }, [submitting]);
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);
  useEffect(() => { historyEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
  useEffect(() => { visibilityRef.current = visibilityWarnings; }, [visibilityWarnings]);
  useEffect(() => { consecutiveLowRef.current = consecutiveLow; }, [consecutiveLow]);

  const speak = useCallback((text, onDone) => {
    if (!window.speechSynthesis) { onDone?.(); return; }
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.92; utt.pitch = 1;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => { setIsSpeaking(false); onDone?.(); };
    utt.onerror = () => { setIsSpeaking(false); onDone?.(); };
    synthRef.current.speak(utt);
  }, []);

  // Speak on load
  useEffect(() => {
    const t = setTimeout(() => speak(session.message, () => { setTimeout(() => speak(session.firstQuestion), 600); }), 800);
    return () => { clearTimeout(t); synthRef.current?.cancel(); };
  }, []); // eslint-disable-line

  // Session timer
  useEffect(() => {
    if (session.startedAt) {
      const elapsed = Math.floor((Date.now() - new Date(session.startedAt)) / 1000);
      setTimeRemaining(Math.max(0, (session.timeLimit || 30) * 60 - elapsed));
    }
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) { clearInterval(interval); handleEnd('time'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  // ── CHEAT DETECTION: page visibility ──
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const next = visibilityRef.current + 1;
        setVisibilityWarnings(next);
        if (next >= 3) {
          setCheatModal(true);
        } else {
          toast.warning(`⚠️ Warning ${next}/3 — Switching tabs may end your session`, { duration: 4000 });
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // ── BACK BUTTON GUARD ──
  useEffect(() => {
    // Push a dummy state so we can catch popstate
    window.history.pushState({ mockSession: true }, '');
    const handlePop = () => {
      window.history.pushState({ mockSession: true }, ''); // re-push so they stay
      setQuitModal(true);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // ── beforeunload (refresh / close tab) ──
  useEffect(() => {
    const handler = e => { e.preventDefault(); e.returnValue = 'Your interview session will end if you leave.'; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // ── SPEECH RECOGNITION ──
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Use Chrome for voice support.'); return; }
    const rec = new SR();
    rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US';

    rec.onresult = e => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(text); transcriptRef.current = text;
      // reset silence countdown
      clearTimeout(silenceTimerRef.current); clearInterval(countdownIntervalRef.current);
      setSilenceCountdown(8);
      let count = 8;
      countdownIntervalRef.current = setInterval(() => {
        count--;
        setSilenceCountdown(count > 0 ? count : null);
        if (count <= 0) clearInterval(countdownIntervalRef.current);
      }, 1000);
      silenceTimerRef.current = setTimeout(() => {
        setSilenceCountdown(null);
        if (!submittingRef.current && transcriptRef.current?.trim()) handleAutoSubmit(transcriptRef.current);
      }, 8000);
    };

    // KEY: only restart if still in listening mode
    rec.onend = () => {
      if (isListeningRef.current && !submittingRef.current) {
        try { rec.start(); } catch (_) {}
      } else {
        setIsListening(false);
      }
    };
    rec.onerror = e => {
      if (e.error === 'no-speech' || e.error === 'aborted') return; // ignore — don't stop mic
      setIsListening(false); isListeningRef.current = false;
    };
    recognitionRef.current = rec;
    return () => { rec.onend = null; rec.onerror = null; try { rec.stop(); } catch (_) {} };
  }, []); // eslint-disable-line

  const stopMic = () => {
    isListeningRef.current = false;
    clearTimeout(silenceTimerRef.current); clearInterval(countdownIntervalRef.current);
    setSilenceCountdown(null);
    try { recognitionRef.current?.stop(); } catch (_) {}
    setIsListening(false);
  };

  const handleAutoSubmit = async text => {
    if (!text?.trim() || submittingRef.current) return;
    stopMic();
    await doSubmit(text);
  };

  const toggleMic = () => {
    synthRef.current.cancel();
    if (isListening) {
      stopMic();
    } else {
      setTranscript(''); transcriptRef.current = '';
      isListeningRef.current = true;
      try { recognitionRef.current?.start(); } catch (_) {}
      setIsListening(true);
    }
  };

  const doSubmit = async answerText => {
    if (!answerText?.trim() || submittingRef.current) return;
    setSubmitting(true); synthRef.current.cancel();
    try {
      const res = await mockService.submitAnswer(session.sessionId, { question: currentQuestion, answer: answerText.trim() });

      // Track consecutive low scores
      if (res.score <= 1) {
        const next = consecutiveLowRef.current + 1;
        setConsecutiveLow(next);
        if (next >= 3) { setExhaustedModal(true); return; }
      } else {
        setConsecutiveLow(0);
      }

      setHistory(prev => [
        ...prev,
        { type: 'user', text: answerText.trim() },
        { type: 'feedback', score: res.score, feedback: res.feedback },
        ...(res.nextQuestion ? [{ type: 'ai', text: res.nextQuestion }] : []),
      ]);
      setTranscript(''); transcriptRef.current = '';
      setCurrentQuestion(res.nextQuestion || '');
      if (res.minutesRemaining) setTimeRemaining(Math.floor(res.minutesRemaining * 60));
      if (res.timeUp) { handleEnd('time'); return; }
      if (res.nextQuestion) speak(res.nextQuestion);
    } catch (err) {
      if (err?.response?.data?.timeUp) { handleEnd('time'); return; }
      toast.error('Submission failed. Try again.');
    } finally { setSubmitting(false); }
  };

  const handleEnd = async (reason = 'manual') => {
    synthRef.current.cancel();
    stopMic();
    clearInterval(countdownIntervalRef.current);
    setQuitModal(false); setCheatModal(false); setExhaustedModal(false);
    try { const res = await mockService.endSession(session.sessionId); setSummary(res.summary); } catch { setSummary(null); }
    setSessionEnded(true); clearActiveSession();
  };

  const fmtTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const isUrgent = timeRemaining < 300;

  // ── SESSION ENDED SUMMARY ───────────────────────────────
  if (sessionEnded) {
    const avg = summary?.averageScore ?? 0;
    const avgColor = avg >= 7 ? '#22c55e' : avg >= 5 ? '#f59e0b' : '#ef4444';
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--background)', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 28, overflow: 'hidden' }}>
            <div style={{ padding: '32px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg,rgba(99,102,241,0.07)0%,transparent 60%)' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#22c55e15', border: '2px solid #22c55e40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>✓</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 4px' }}>Session complete</h2>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: 0 }}>Here's how you performed</p>
            </div>
            <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'var(--muted)', borderRadius: 16, padding: '16px 18px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--foreground)', lineHeight: 1 }}>{summary?.totalQuestions || 0}</div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 5 }}>Questions answered</div>
              </div>
              <div style={{ background: avgColor + '10', borderRadius: 16, padding: '16px 18px', border: `1px solid ${avgColor}30` }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: avgColor, lineHeight: 1 }}>{Number.isFinite(avg) ? avg.toFixed(1) : '—'}<span style={{ fontSize: 14, opacity: 0.5 }}>/10</span></div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 5 }}>Average score</div>
              </div>
            </div>
            {summary?.answers?.length > 0 && (
              <div style={{ padding: '0 32px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--muted-foreground)', marginBottom: 4 }}>Answer breakdown</div>
                {summary.answers.map((a, i) => {
                  const c = a.score >= 7 ? '#22c55e' : a.score >= 5 ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={i} style={{ padding: '12px 14px', background: 'var(--muted)', borderRadius: 14, border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.5, flex: 1 }}>{a.question}</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: c, background: c + '18', padding: '2px 9px', borderRadius: 100, flexShrink: 0 }}>{a.score}/10</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.6, margin: 0 }}>{a.feedback}</p>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ padding: '0 32px 32px' }}>
              <button onClick={onEnd} style={{ width: '100%', padding: 14, borderRadius: 16, background: '#6366f1', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Back to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MODALS ──────────────────────────────────────────────
  const Modal = ({ icon, title, desc, confirmLabel, confirmColor = '#6366f1', onConfirm, onCancel, cancelLabel = 'Stay in session' }) => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 24, padding: 32, boxShadow: '0 32px 64px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 8px' }}>{title}</h3>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.7, margin: '0 0 24px' }}>{desc}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {onCancel && (
            <button onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--muted)', color: 'var(--foreground)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {cancelLabel}
            </button>
          )}
          <button onClick={onConfirm} style={{ flex: 1, padding: '12px', borderRadius: 14, border: 'none', background: confirmColor, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  // ── FULLSCREEN LIVE UI ──────────────────────────────────
  const pct = silenceCountdown !== null ? ((8 - silenceCountdown) / 8) * 100 : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--background)', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'inherit' }}>

      {/* Modals */}
      {quitModal && (
        <Modal icon="🚪" title="Leave the interview?"
          desc="Going back will end your session permanently. Your answers so far will be saved and scored."
          confirmLabel="End session" confirmColor="#ef4444"
          onConfirm={() => handleEnd('quit')}
          onCancel={() => setQuitModal(false)} />
      )}
      {cheatModal && (
        <Modal icon="🚨" title="Session ended — tab switching detected"
          desc="You switched tabs or minimized the window 3 times. Your session has been ended to maintain fairness."
          confirmLabel="View my results" confirmColor="#ef4444"
          onConfirm={() => handleEnd('cheat')} />
      )}
      {exhaustedModal && (
        <Modal icon="💪" title="Take a breath — you're struggling"
          desc="You've scored 1/10 three times in a row. That's okay — take a break, review the material, and come back stronger."
          confirmLabel="End & see results" confirmColor="#f59e0b"
          onCancel={() => { setExhaustedModal(false); setConsecutiveLow(0); }}
          cancelLabel="Continue anyway"
          onConfirm={() => handleEnd('exhausted')} />
      )}

      {/* ── TOP BAR ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--card)', flexShrink: 0, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>AI</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>Mock Interview</div>
            <div style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 2 }}>
              {visibilityWarnings > 0 && <span style={{ color: '#f59e0b' }}>⚠ {visibilityWarnings}/3 tab-switch warnings · </span>}
              Live session
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: isUrgent ? '#ef444412' : 'var(--muted)', border: `1px solid ${isUrgent ? '#ef444430' : 'var(--border)'}`, transition: 'all 0.3s' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: isUrgent ? '#ef4444' : '#6366f1', animation: 'livePulse 1.5s infinite' }} />
            <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: isUrgent ? '#ef4444' : 'var(--foreground)', letterSpacing: '0.06em' }}>{fmtTime(timeRemaining)}</span>
          </div>
          <button onClick={() => setQuitModal(true)} disabled={submitting}
            style={{ padding: '7px 14px', borderRadius: 10, border: '1px solid #fca5a5', background: 'transparent', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = '#fef2f2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            End session
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* CENTER */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 36px', gap: 24, overflow: 'hidden' }}>

          {/* AI Avatar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isSpeaking && <>
              <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '1.5px solid rgba(99,102,241,0.25)', animation: 'ripple 2s ease-out infinite' }} />
              <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '1.5px solid rgba(99,102,241,0.4)', animation: 'ripple 2s ease-out infinite 0.5s' }} />
            </>}
            {isListening && <>
              <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', border: '1.5px solid rgba(239,68,68,0.25)', animation: 'ripple 1.5s ease-out infinite' }} />
              <div style={{ position: 'absolute', inset: -9, borderRadius: '50%', border: '1.5px solid rgba(239,68,68,0.4)', animation: 'ripple 1.5s ease-out infinite 0.4s' }} />
            </>}
            <div style={{
              width: 92, height: 92, borderRadius: '50%',
              border: `3px solid ${isSpeaking ? '#818cf8' : isListening ? '#f87171' : 'var(--border)'}`,
              background: isSpeaking ? 'rgba(99,102,241,0.07)' : isListening ? 'rgba(239,68,68,0.06)' : 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38,
              transition: 'border-color 0.25s, background 0.25s',
              animation: isSpeaking ? 'bobSpeak 0.6s ease-in-out infinite alternate' : 'none',
            }}>🤖</div>
          </div>

          {/* Status pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 100,
            background: isListening ? 'rgba(239,68,68,0.08)' : isSpeaking ? 'rgba(99,102,241,0.08)' : submitting ? 'rgba(245,158,11,0.08)' : 'var(--muted)',
            border: `1px solid ${isListening ? '#ef444425' : isSpeaking ? '#6366f125' : submitting ? '#f59e0b25' : 'var(--border)'}`,
            transition: 'all 0.25s',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: isListening ? '#ef4444' : isSpeaking ? '#6366f1' : submitting ? '#f59e0b' : 'var(--muted-foreground)',
              animation: (isListening || isSpeaking || submitting) ? 'livePulse 1s infinite' : 'none',
            }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: isListening ? '#ef4444' : isSpeaking ? '#6366f1' : submitting ? '#f59e0b' : 'var(--muted-foreground)' }}>
              {isListening
                ? silenceCountdown !== null ? `Listening — auto-submit in ${silenceCountdown}s` : 'Listening…'
                : isSpeaking ? 'AI is speaking…'
                : submitting ? 'Evaluating your answer…'
                : 'Press the mic to speak'}
            </span>
          </div>

          {/* Current question */}
          <div style={{ width: '100%', maxWidth: 560, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '18px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--muted-foreground)', marginBottom: 10 }}>Current question</div>
            <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.65, margin: 0 }}>{currentQuestion || 'Preparing first question…'}</p>
          </div>

          {/* Transcript + silence progress bar */}
          {(isListening || transcript) && (
            <div style={{ width: '100%', maxWidth: 560, background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 18px 10px', animation: 'fadeSlideIn 0.2s ease' }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--muted-foreground)', marginBottom: 8 }}>Your answer (live)</div>
              <p style={{ fontSize: 14, color: transcript ? 'var(--foreground)' : 'var(--muted-foreground)', lineHeight: 1.7, margin: '0 0 10px', fontStyle: transcript ? 'normal' : 'italic', minHeight: 32 }}>
                {transcript || 'Start speaking…'}
              </p>
              {/* 8-second countdown bar */}
              {silenceCountdown !== null && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b' }}>Auto-submitting in {silenceCountdown}s</span>
                    <span style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>silence detected</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 100, background: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 100, background: '#f59e0b', width: `${pct}%`, transition: 'width 1s linear' }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mic button */}
          <button onClick={toggleMic} disabled={submitting || isSpeaking} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 36px', borderRadius: 100,
            background: isListening ? '#dc2626' : '#6366f1',
            color: '#fff', border: 'none',
            cursor: submitting || isSpeaking ? 'not-allowed' : 'pointer',
            fontSize: 14, fontWeight: 800,
            opacity: submitting || isSpeaking ? 0.45 : 1,
            boxShadow: isListening ? '0 8px 28px rgba(220,38,38,0.35)' : '0 8px 28px rgba(99,102,241,0.35)',
            transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 20 }}>{isListening ? '🛑' : '🎤'}</span>
            {isListening
              ? silenceCountdown !== null ? `Stop (auto in ${silenceCountdown}s)` : 'Stop speaking'
              : submitting ? 'Evaluating…' : 'Click to speak'}
          </button>
        </div>

        {/* RIGHT PANEL — conversation */}
        <div style={{ width: 300, flexShrink: 0, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--card)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--muted-foreground)' }}>Conversation</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((item, i) => (
              <div key={i}>
                {item.type === 'ai' && item.text && (
                  <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, marginTop: 2 }}>🤖</div>
                    <div style={{ flex: 1, background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '13px 13px 13px 3px', padding: '8px 11px', fontSize: 12, color: 'var(--foreground)', lineHeight: 1.6 }}>{item.text}</div>
                  </div>
                )}
                {item.type === 'user' && (
                  <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(100,116,139,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, marginTop: 2 }}>🧑</div>
                    <div style={{ flex: 1, background: '#6366f1', borderRadius: '13px 13px 3px 13px', padding: '8px 11px', fontSize: 12, color: '#fff', lineHeight: 1.6 }}>{item.text}</div>
                  </div>
                )}
                {item.type === 'feedback' && (
                  <div style={{ marginLeft: 31 }}>
                    <div style={{
                      background: item.score >= 7 ? '#22c55e0c' : item.score >= 5 ? '#f59e0b0c' : '#ef44440c',
                      border: `1px solid ${item.score >= 7 ? '#22c55e25' : item.score >= 5 ? '#f59e0b25' : '#ef444425'}`,
                      borderRadius: 12, padding: '8px 11px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', background: item.score >= 7 ? '#22c55e' : item.score >= 5 ? '#f59e0b' : '#ef4444', padding: '1px 7px', borderRadius: 100 }}>{item.score}/10</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: item.score >= 7 ? '#16a34a' : item.score >= 5 ? '#d97706' : '#dc2626' }}>
                          {item.score >= 7 ? '✓ Strong' : item.score >= 5 ? '~ Fair' : '✗ Needs work'}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--muted-foreground)', lineHeight: 1.55, margin: 0 }}>{item.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={historyEndRef} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1}50%{opacity:0.25} }
        @keyframes ripple { 0%{transform:scale(1);opacity:0.5}100%{transform:scale(1.5);opacity:0} }
        @keyframes bobSpeak { 0%{transform:translateY(0)}100%{transform:translateY(-5px)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────
export function MockInterview() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('instructions');
  const [reports, setReports] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const saved = getActiveSession();
        if (saved) { setActiveSession(saved); setPhase('session'); setLoading(false); return; }
        setReports(await interviewService.getAllReports());
      } catch { toast.error('Could not load data.'); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleStart = async reportId => {
    setSubmitting(true);
    try {
      const session = await mockService.startSession({ reportId });
      setActiveSession(session); setPhase('session');
    } catch (err) { toast.error(err?.response?.data?.message || 'Could not start session.'); }
    finally { setSubmitting(false); }
  };

  const handleEnd = () => {
    clearActiveSession(); setActiveSession(null); setPhase('instructions');
    navigate('/dashboard');
  };

  if (loading) return <LoadingSpinner fullScreen label="Loading mock interview" />;
  if (phase === 'session' && activeSession) return <LiveSession session={activeSession} onEnd={handleEnd} />;

  return (
    <Layout title="Mock interview" eyebrow="Practice">
      {phase === 'instructions' && <InstructionsScreen onConfirm={() => setPhase('picker')} />}
      {phase === 'picker' && <ReportPicker reports={reports} onStart={handleStart} submitting={submitting} />}
    </Layout>
  );
}