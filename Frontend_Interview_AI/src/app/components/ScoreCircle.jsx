export function ScoreCircle({ score, size = "md" }) {
  const sizes = {
    sm: "h-16 w-16 text-lg",
    md: "h-20 w-20 text-2xl",
    lg: "h-28 w-28 text-3xl",
  };

  const hue = score >= 80 ? "from-emerald-500 to-emerald-300" : score >= 60 ? "from-indigo-500 to-sky-400" : score >= 40 ? "from-amber-500 to-orange-400" : "from-rose-500 to-rose-300";

  return (
    <div className={`relative ${sizes[size] || sizes.md}`}>
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${hue} opacity-90`} />
      <div className="absolute inset-[6px] rounded-full bg-white dark:bg-slate-950" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold text-slate-900 dark:text-white">{score}</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Match
          </div>
        </div>
      </div>
    </div>
  );
}
