import { Link } from "react-router";
import {
  ArrowRightIcon,
  BarChart3Icon,
  BrainCircuitIcon,
  FileTextIcon,
  MicIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

const features = [
  {
    title: "Job-matched report generation",
    description:
      "Upload a resume, add the target role, and get structured analysis instead of vague AI fluff.",
    icon: FileTextIcon,
  },
  {
    title: "Practice built from your own reports",
    description:
      "Mock interviews spin up from the role and evidence already captured in your analysis workflow.",
    icon: MicIcon,
  },
  {
    title: "Operational analytics",
    description:
      "Track scores, weak topics, and usage in a workspace that feels like a real product surface.",
    icon: BarChart3Icon,
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_30%)]" />

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950">
              <BrainCircuitIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                InterviewAI
              </div>
              <div className="text-lg font-semibold">Frontend Rebuild</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <section className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
              <SparklesIcon className="h-4 w-4" />
              Real-world React workspace
            </div>
            <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
              A sharper frontend for interview intelligence, reports, and live practice.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              This rebuild keeps the app in React and pushes it toward a cleaner product feel:
              denser information, clearer actions, stronger workflows, and less design-export
              residue.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Start workspace
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/5"
              >
                Open existing account
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Workspace Preview
                  </div>
                  <div className="mt-2 text-2xl font-semibold">Candidate Operations</div>
                </div>
                <ShieldCheckIcon className="h-8 w-8 text-emerald-300" />
              </div>

              <div className="mt-8 grid gap-4">
                {[
                  ["Reports created", "12"],
                  ["Average score", "84%"],
                  ["Weak topics tracked", "5"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <span className="text-sm text-slate-300">{label}</span>
                    <span className="text-lg font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
                <feature.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
