import { Link } from "react-router";

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-950">
      {Icon ? (
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <Icon className="h-8 w-8" />
        </div>
      ) : null}
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link
          to={actionHref}
          className="mt-6 inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
