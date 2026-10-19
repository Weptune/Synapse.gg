"use client";

import { motion } from "framer-motion";

export function Stat({ icon, label, value, type = "teal", delay = 0 }: { icon: React.ReactNode; label: string; value: string; type?: "teal" | "amber" | "purple" | "rose"; delay?: number }) {
  const cardClass =
    type === "teal" ? "border-teal-500/30 hover:border-teal-400/80 hover:shadow-[0_12px_30px_rgba(45,212,191,0.18)]" :
    type === "amber" ? "border-amber-500/30 hover:border-amber-400/80 hover:shadow-[0_12px_30px_rgba(245,158,11,0.18)]" :
    type === "purple" ? "border-purple-500/30 hover:border-purple-400/80 hover:shadow-[0_12px_30px_rgba(168,85,247,0.18)]" :
    "border-rose-500/30 hover:border-rose-400/80 hover:shadow-[0_12px_30px_rgba(244,63,94,0.18)]";

  const colorClass =
    type === "teal" ? "text-teal-400" :
    type === "amber" ? "text-amber-400" :
    type === "purple" ? "text-purple-400" :
    "text-rose-400";

  const glowTextClass =
    type === "teal" ? "group-hover:text-teal-200 text-teal-400" :
    type === "amber" ? "group-hover:text-amber-200 text-amber-400" :
    type === "purple" ? "group-hover:text-purple-200 text-purple-400" :
    "group-hover:text-rose-200 text-rose-400";

  const cornerBorderColor =
    type === "teal" ? "border-teal-400" :
    type === "amber" ? "border-amber-400" :
    type === "purple" ? "border-purple-400" :
    "border-rose-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className={`group relative rounded-xl border bg-slate-950/65 p-5 transition-all duration-300 overflow-hidden shadow-lg ${cardClass}`}
    >
      {/* Corner Brackets */}
      <div className={`absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 ${cornerBorderColor} pointer-events-none`} />
      <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 ${cornerBorderColor} pointer-events-none`} />

      <div className={`absolute -right-3 -bottom-3 opacity-[0.06] ${colorClass} group-hover:scale-125 transition-transform duration-500`}>
        {icon}
      </div>
      <div className="relative mb-3 flex items-center justify-between">
        <span className={`${colorClass} transition-colors`}>{icon}</span>
      </div>
      <p className="relative text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">{label}</p>
      <p className={`relative mt-1.5 font-mono text-2xl font-black ${glowTextClass} transition-colors tech-readout`}>{value}</p>
    </motion.div>
  );
}
