// import { useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router";
// import { toast } from "sonner";
// import { useAuth } from "../context/AuthContext.jsx";
// import { validateEmail, validatePassword, validateUsername } from "../utils/validation.js";

// export function Register() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const passwordState = useMemo(() => validatePassword(password), [password]);

//   async function handleSubmit(event) {
//     event.preventDefault();

//     const usernameState = validateUsername(username);
//     if (!usernameState.isValid) {
//       toast.error(usernameState.error);
//       return;
//     }

//     if (!validateEmail(email)) {
//       toast.error("Enter a valid email address.");
//       return;
//     }

//     if (!passwordState.isValid) {
//       toast.error(passwordState.errors[0]);
//       return;
//     }

//     setLoading(true);
//     try {
//       await register(username.trim(), email.trim(), password);
//       toast.success("Account created.");
//       navigate("/dashboard");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Registration failed.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
//       <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
//         <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
//           <div className="rounded-t-[2rem] bg-slate-900 p-8 text-white lg:rounded-l-[2rem] lg:rounded-tr-none md:p-10">
//             <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
//               Workspace setup
//             </div>
//             <h1 className="mt-4 text-4xl font-semibold">Create your operator account</h1>
//             <p className="mt-4 text-sm leading-7 text-slate-300">
//               This frontend is now tuned for a more real product workflow, so the account setup is
//               clean, strict, and focused on getting you into the workspace fast.
//             </p>

//             <div className="mt-10 space-y-4">
//               {[
//                 "Secure account-based access",
//                 "Report-driven mock interview workflow",
//                 "Analytics and usage tracking from the same shell",
//               ].map((item) => (
//                 <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm">
//                   {item}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="p-8 md:p-10">
//             <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
//               Registration
//             </div>
//             <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
//               Set up your access
//             </h2>

//             <div className="mt-10 space-y-6">
//               <label className="block space-y-2">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</span>
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(event) => setUsername(event.target.value)}
//                   className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
//                   placeholder="irshad_ops"
//                 />
//               </label>

//               <label className="block space-y-2">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(event) => setEmail(event.target.value)}
//                   className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
//                   placeholder="you@example.com"
//                 />
//               </label>

//               <label className="block space-y-2">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(event) => setPassword(event.target.value)}
//                   className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
//                   placeholder="Use a strong password"
//                 />
//               </label>

//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
//                 {password ? (
//                   passwordState.isValid ? (
//                     <span className="text-emerald-600 dark:text-emerald-400">Password looks good.</span>
//                   ) : (
//                     passwordState.errors[0]
//                   )
//                 ) : (
//                   "Use at least 8 characters with upper, lower, and number."
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {loading ? "Creating account..." : "Create account"}
//               </button>
//             </div>

//             <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
//               Already have an account?{" "}
//               <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
//                 Sign in
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }












import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { BrainCircuitIcon, EyeIcon, EyeOffIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import { validateEmail, validatePassword, validateUsername } from "../utils/validation.js";

// OTP Input Component
function OtpInput({ value, onChange }) {
  const digits = value.split('');
  const refs = Array.from({ length: 6 }, () => null);

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1]?.focus();
    }
  };

  const handleChange = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = d;
    while (next.length < 6) next.push('');
    onChange(next.join('').slice(0, 6));
    if (d && i < 5) refs[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    refs[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => refs[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 border-slate-200 bg-slate-50 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
        />
      ))}
    </div>
  );
}

export function Register() {
  const [step, setStep] = useState('form'); // form | otp
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const passwordState = useMemo(() => validatePassword(password), [password]);

  const passwordChecks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Lowercase letter", pass: /[a-z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
  ];

  async function handleRegister(event) {
    event.preventDefault();
    const usernameState = validateUsername(username);
    if (!usernameState.isValid) { toast.error(usernameState.error); return; }
    if (!validateEmail(email)) { toast.error("Enter a valid email address."); return; }
    if (!passwordState.isValid) { toast.error(passwordState.errors[0]); return; }

    setLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
      toast.success("OTP sent to your email!");
      setStep('otp');
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    if (otp.length < 6) { toast.error("Enter the 6-digit OTP."); return; }
    setLoading(true);
    try {
      await verifyOtp(email.trim(), otp);
      toast.success("Account verified! Welcome.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_40%)]" />

      <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">

          {/* Left panel */}
          <div className="rounded-t-[2rem] bg-slate-900 p-8 text-white lg:rounded-l-[2rem] lg:rounded-tr-none md:p-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                <BrainCircuitIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">InterviewAI</div>
                <div className="text-sm font-semibold">Candidate Workspace</div>
              </div>
            </Link>

            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-4">
              Workspace setup
            </div>
            <h1 className="text-4xl font-semibold leading-tight mb-4">Create your account</h1>
            <p className="text-sm leading-7 text-slate-300 mb-10">
              Get AI-powered interview prep with resume analysis, mock sessions, and performance tracking.
            </p>

            <div className="space-y-3">
              {[
                { icon: "🎯", text: "Personalized job match score" },
                { icon: "🎤", text: "Voice-based mock interviews" },
                { icon: "📊", text: "Live scoring & feedback" },
                { icon: "📅", text: "5-day prep plans" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm text-slate-200">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="p-8 md:p-10">
            {step === 'form' ? (
              <>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Registration
                </div>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Set up your access</h2>

                <form onSubmit={handleRegister} className="mt-8 space-y-5">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</span>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                      placeholder="aman_dev"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                        placeholder="Strong password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </label>

                  {/* Password strength */}
                  {password && (
                    <div className="grid grid-cols-2 gap-2">
                      {passwordChecks.map(check => (
                        <div key={check.label} className={`flex items-center gap-2 text-xs rounded-xl px-3 py-2 transition ${check.pass ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-900'}`}>
                          <CheckIcon className={`h-3 w-3 flex-shrink-0 ${check.pass ? 'opacity-100' : 'opacity-30'}`} />
                          {check.label}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Creating account...
                      </span>
                    ) : "Create account →"}
                  </button>
                </form>

                <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign in</Link>
                </p>
              </>
            ) : (
              /* OTP STEP */
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 mb-6 text-3xl">
                  📬
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Verify your email</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 leading-6">
                  We sent a 6-digit OTP to
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-8">{email}</p>

                <form onSubmit={handleVerifyOtp} className="w-full max-w-sm space-y-6">
                  <OtpInput value={otp} onChange={setOtp} />

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Verifying...
                      </span>
                    ) : "Verify & continue"}
                  </button>
                </form>

                <p className="mt-6 text-sm text-slate-400">
                  Wrong email?{" "}
                  <button onClick={() => setStep('form')} className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
                    Go back
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}