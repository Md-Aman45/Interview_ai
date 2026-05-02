// import { useState } from "react";
// import { Link, useNavigate } from "react-router";
// import { BrainCircuitIcon } from "lucide-react";
// import { toast } from "sonner";
// import { useAuth } from "../context/AuthContext.jsx";
// import { validateEmail } from "../utils/validation.js";

// export function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   async function handleSubmit(event) {
//     event.preventDefault();

//     if (!validateEmail(email)) {
//       toast.error("Enter a valid email address.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await login(email, password);
//       toast.success("Welcome back.");
//       navigate("/dashboard");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Sign-in failed.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
//       <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_30%)]" />
//       <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
//         <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur md:p-10">
//           <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
//             <BrainCircuitIcon className="h-6 w-6" />
//           </div>
//           <h1 className="mt-8 text-4xl font-semibold">Sign in to your workspace</h1>
//           <p className="mt-4 text-sm leading-7 text-slate-300">
//             Access reports, live mock sessions, and analytics from one operational dashboard.
//           </p>

//           <div className="mt-10 space-y-4">
//             {[
//               "Resume-to-report workflow with job targeting",
//               "Structured mock sessions tied to report context",
//               "Usage tracking and analytics in one place",
//             ].map((item) => (
//               <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-slate-200">
//                 {item}
//               </div>
//             ))}
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-900 shadow-2xl md:p-10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
//         >
//           <div>
//             <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
//               Account Access
//             </div>
//             <h2 className="mt-3 text-3xl font-semibold">Welcome back</h2>
//           </div>

//           <div className="mt-10 space-y-6">
//             <label className="block space-y-2">
//               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(event) => setEmail(event.target.value)}
//                 className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-950"
//                 placeholder="you@example.com"
//               />
//             </label>

//             <label className="block space-y-2">
//               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//                 className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-950"
//                 placeholder="Enter your password"
//               />
//             </label>

//             <button
//               type="submit"
//               disabled={loading}
//               className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
//             >
//               {loading ? "Signing in..." : "Sign in"}
//             </button>
//           </div>

//           <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
//             Need an account?{" "}
//             <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
//               Create one
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }












// import { useState } from "react";
// import { Link, useNavigate } from "react-router";
// import { BrainCircuitIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
// import { toast } from "sonner";
// import { useAuth } from "../context/AuthContext.jsx";
// import { validateEmail } from "../utils/validation.js";
// import { authService } from "../services/auth.service.js";

// // ── FORGOT PASSWORD MODAL ──────────────────────────────
// function ForgotPasswordModal({ onClose }) {
//   const [step, setStep] = useState("email"); // email | sent
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!validateEmail(email)) { toast.error("Enter a valid email."); return; }
//     setLoading(true);
//     try {
//       await authService.forgotPassword(email);
//       setStep("sent");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to send reset link.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4">
//       <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950 shadow-2xl">
//         {step === "email" ? (
//           <>
//             <button onClick={onClose} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition">
//               <ArrowLeftIcon className="h-4 w-4" /> Back to login
//             </button>
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 mb-5">
//               <span className="text-2xl">🔑</span>
//             </div>
//             <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Reset your password</h2>
//             <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-6">
//               Enter your account email and we'll send a reset link.
//             </p>
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <label className="block space-y-2">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</span>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={e => setEmail(e.target.value)}
//                   className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
//                   placeholder="you@example.com"
//                   autoFocus
//                 />
//               </label>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
//               >
//                 {loading ? "Sending..." : "Send reset link"}
//               </button>
//             </form>
//           </>
//         ) : (
//           <div className="text-center py-4">
//             <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-950/40 mx-auto mb-5">
//               <CheckCircleIcon className="h-7 w-7 text-green-600 dark:text-green-400" />
//             </div>
//             <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Check your inbox</h2>
//             <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-6">
//               We sent a reset link to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>. Check your spam folder if you don't see it.
//             </p>
//             <button onClick={onClose} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition">
//               Back to login
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── LOGIN PAGE ─────────────────────────────────────────
// export function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showForgot, setShowForgot] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   async function handleSubmit(event) {
//     event.preventDefault();
//     if (!validateEmail(email)) { toast.error("Enter a valid email address."); return; }
//     setLoading(true);
//     try {
//       await login(email, password);
//       toast.success("Welcome back.");
//       navigate("/dashboard");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Sign-in failed.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
//       <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.28),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.15),transparent_35%)]" />

//       {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

//       <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
//         {/* Left panel */}
//         <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur md:p-10">
//           <Link to="/" className="inline-flex items-center gap-3 mb-10">
//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950">
//               <BrainCircuitIcon className="h-5 w-5" />
//             </div>
//             <div>
//               <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">InterviewAI</div>
//               <div className="text-sm font-semibold">Candidate Workspace</div>
//             </div>
//           </Link>

//           <h1 className="text-4xl font-semibold leading-tight mb-4">Sign in to your workspace</h1>
//           <p className="text-sm leading-7 text-slate-300 mb-10">
//             Resume analysis, mock interviews, and performance analytics — all in one place.
//           </p>

//           <div className="space-y-3">
//             {[
//               { icon: "📄", text: "Resume-to-report with job matching" },
//               { icon: "🎤", text: "AI voice mock interviews" },
//               { icon: "📊", text: "Score tracking and weak area analysis" },
//             ].map((item) => (
//               <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5">
//                 <span className="text-lg">{item.icon}</span>
//                 <span className="text-sm text-slate-200">{item.text}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right — form */}
//         <form
//           onSubmit={handleSubmit}
//           className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-900 shadow-2xl md:p-10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
//         >
//           <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
//             Account Access
//           </div>
//           <h2 className="mt-3 text-3xl font-semibold">Welcome back</h2>

//           <div className="mt-10 space-y-5">
//             <label className="block space-y-2">
//               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
//                 placeholder="you@example.com"
//               />
//             </label>

//             <label className="block space-y-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
//                 <button
//                   type="button"
//                   onClick={() => setShowForgot(true)}
//                   className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
//                 >
//                   {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
//                 </button>
//               </div>
//             </label>

//             <button
//               type="submit"
//               disabled={loading}
//               className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {loading ? (
//                 <span className="flex items-center gap-2">
//                   <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//                   Signing in...
//                 </span>
//               ) : "Sign in"}
//             </button>
//           </div>

//           <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
//             Need an account?{" "}
//             <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
//               Create one
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }
























import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { BrainCircuitIcon, EyeIcon, EyeOffIcon, SunIcon, MoonIcon, CheckCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { validateEmail } from "../utils/validation.js";
import { authService } from "../services/auth.service.js";

function ForgotModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!validateEmail(email)) { toast.error("Enter a valid email."); return; }
    setLoading(true);
    try { await authService.forgotPassword(email); setSent(true); }
    catch (err) { toast.error(err?.response?.data?.message || "Failed to send reset link."); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 shadow-2xl">
        {sent ? (
          <div className="text-center py-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50">
              <CheckCircleIcon className="h-7 w-7 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Email sent!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-6">
              Check your inbox at <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
            </p>
            <button onClick={onClose} className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300">
              Back to login
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Reset password</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">We'll send a reset link to your email.</p>
            <form onSubmit={submit} className="space-y-4">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoFocus
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition dark:text-white placeholder:text-slate-400" />
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 transition">
                {loading ? "Sending..." : "Send reset link"}
              </button>
              <button type="button" onClick={onClose} className="w-full py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateEmail(email)) { toast.error("Enter a valid email."); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Sign-in failed.";
      if (msg.toLowerCase().includes("verify")) toast.error("Email not verified — check your inbox for the OTP.", { duration: 5000 });
      else toast.error(msg);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 flex flex-col">
      {showForgot && <ForgotModal onClose={() => setShowForgot(false)} />}

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
            <BrainCircuitIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">InterviewAI</span>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition shadow-sm">
            {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>
          <Link to="/register" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
            Create account
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">

          {/* Left — branding */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 px-3 py-1.5 mb-8">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Powered by Gemini & Groq AI</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
              Your AI-powered<br />interview coach
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-7 mb-10">
              Upload your resume, get a match score, practice with voice AI, and track your progress.
            </p>
            <div className="space-y-3">
              {[
                { icon: "📄", label: "Resume analysis", desc: "Match score + skill gap report" },
                { icon: "🎤", label: "Voice mock interviews", desc: "Groq AI scores in under 1s" },
                { icon: "📊", label: "Performance analytics", desc: "Track weak areas over time" },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{f.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <div className="w-full">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/30">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to your workspace</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <button type="button" onClick={() => setShowForgot(true)} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 pr-12 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                      {showPw ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Signing in...</span>
                    : "Sign in →"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Don't have an account?{" "}
                  <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition">Create one</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}