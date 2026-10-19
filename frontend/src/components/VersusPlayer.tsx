"use client";

import { motion } from "framer-motion";
import { AvatarImage } from "@/components/AvatarImage";
import type { FighterProfile } from "@/lib/types";

export function VersusPlayer({ profile, side }: { profile: FighterProfile; side: "left" | "right" }) {
  const align = side === "left" ? "items-start text-left md:pl-16 md:pr-28" : "items-end text-right md:pl-28 md:pr-16";

  return (
    <div className={`absolute z-10 flex h-full w-full flex-col justify-center gap-4 p-8 ${align}`}>
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <AvatarImage
          username={profile.username || profile.name}
          avatarUrl={profile.avatarUrl}
          className="h-20 w-20 rounded-full border-4 border-white/80 bg-slate-900 object-cover shadow-2xl md:h-24 md:w-24"
        />
      </motion.div>
      <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="max-w-[min(28rem,78vw)] md:max-w-[22rem]">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="break-words text-3xl font-black uppercase leading-none tracking-normal text-white drop-shadow-lg md:text-4xl">{profile.name}</p>
          {profile.name?.toLowerCase() === "weptune" && (
            <span className="shrink-0 rounded border border-purple-500/30 bg-purple-950/50 px-2 py-0.8 text-[11px] font-mono font-black text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)] animate-pulse">
              CREATOR
            </span>
          )}
          <span className="rounded bg-gradient-to-r from-teal-400 to-emerald-400 border border-teal-300 px-2 py-0.5 text-xs font-mono font-black text-slate-950 shadow-[0_0_12px_rgba(45,212,191,0.25)]">Lvl {profile.level || 1}</span>
        </div>
        <p className="mt-2 font-mono text-lg text-white/80">Rating: {profile.elo.toLocaleString()}</p>
      </motion.div>
    </div>
  );
}
