import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import { validateEmail, validatePassword, validateUsername } from "../utils/validation.js";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordState = useMemo(() => validatePassword(password), [password]);

  async function handleSubmit(event) {
    event.preventDefault();

    const usernameState = validateUsername(username);
    if (!usernameState.isValid) {
      toast.error(usernameState.error);
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (!passwordState.isValid) {
      toast.error(passwordState.errors[0]);
      return;
    }

    setLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
      toast.success("Account created.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-t-[2rem] bg-slate-900 p-8 text-white lg:rounded-l-[2rem] lg:rounded-tr-none md:p-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Workspace setup
            </div>
            <h1 className="mt-4 text-4xl font-semibold">Create your operator account</h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              This frontend is now tuned for a more real product workflow, so the account setup is
              clean, strict, and focused on getting you into the workspace fast.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Secure account-based access",
                "Report-driven mock interview workflow",
                "Analytics and usage tracking from the same shell",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Registration
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
              Set up your access
            </h2>

            <div className="mt-10 space-y-6">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</span>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                  placeholder="irshad_ops"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                  placeholder="Use a strong password"
                />
              </label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {password ? (
                  passwordState.isValid ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Password looks good.</span>
                  ) : (
                    passwordState.errors[0]
                  )
                ) : (
                  "Use at least 8 characters with upper, lower, and number."
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>

            <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
