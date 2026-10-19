export function VsEmblem({ size = "lg" }: { size?: "sm" | "lg" }) {
  const isLarge = size === "lg";
  return (
    <div
      className={`vs-badge-glow relative flex items-center justify-center ${isLarge ? "h-24 w-24 md:h-28 md:w-28" : "h-11 w-11"}`}
      aria-hidden
    >
      <div
        className={`absolute inset-0 rotate-45 rounded-xl border border-teal-400/45 bg-gradient-to-br from-teal-400/30 via-slate-950/85 to-emerald-500/25 backdrop-blur-sm ${isLarge ? "" : "rounded-lg"}`}
      />
      <div className={`absolute inset-[3px] rotate-45 rounded-lg border border-white/10 bg-slate-950/75 ${isLarge ? "inset-[4px] rounded-[10px]" : ""}`} />
      <div className="absolute h-[85%] w-px bg-teal-400/25" />
      <div className="absolute w-[85%] h-px bg-teal-400/25" />
      <span
        className={`relative z-10 font-display font-black uppercase tracking-[0.18em] text-teal-100 text-glow-teal ${isLarge ? "text-3xl md:text-4xl" : "text-[10px]"}`}
      >
        VS
      </span>
    </div>
  );
}
