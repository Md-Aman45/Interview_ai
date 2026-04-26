import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { BrainCircuitIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import { validateEmail } from "../utils/validation.js";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_30%)]" />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur md:p-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
            <BrainCircuitIcon className="h-6 w-6" />
          </div>
          <h1 className="mt-8 text-4xl font-semibold">Sign in to your workspace</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Access reports, live mock sessions, and analytics from one operational dashboard.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Resume-to-report workflow with job targeting",
              "Structured mock sessions tied to report context",
              "Usage tracking and analytics in one place",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-900 shadow-2xl md:p-10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        >
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Account Access
            </div>
            <h2 className="mt-3 text-3xl font-semibold">Welcome back</h2>
          </div>

          <div className="mt-10 space-y-6">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-950"
                placeholder="you@example.com"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-950"
                placeholder="Enter your password"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
            Need an account?{" "}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
