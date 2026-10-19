"use client";

import { memo } from "react";
import { getImageUrl } from "@/lib/api";
import { AvatarImage } from "@/components/AvatarImage";
import { BannerContainer } from "@/components/BannerContainer";
import type { FighterProfile } from "@/lib/types";

export const Fighter = memo(function Fighter({ profile, tone, alignRight = false }: { profile: FighterProfile; tone: "teal" | "red"; alignRight?: boolean }) {
  const color = tone === "teal" ? "from-teal-300 to-blue-400" : "from-red-400 to-amber-300";
  const avatar = profile.avatarUrl ? getImageUrl(profile.avatarUrl) : "";
  const banner = profile.bannerUrl ? getImageUrl(profile.bannerUrl) : "";
  const hp = Math.max(0, Math.min(100, profile.hp));

  return (
    <div className="relative min-w-0 overflow-hidden rounded-xl border border-white/[0.08] bg-slate-950/45 p-3 shadow-lg backdrop-blur-md sm:p-4">
      {banner && (
        <BannerContainer
          bannerUrl={profile.bannerUrl}
          className="absolute inset-0 bg-cover bg-center opacity-30"
        />
      )}
      <div className={`absolute inset-0 bg-gradient-to-t ${tone === "teal" ? "from-slate-950 via-slate-950/80" : "from-slate-950 via-slate-950/80"} to-slate-950/30`} />

      <div className={`relative z-10 flex ${alignRight ? "flex-row-reverse text-right" : "flex-row"} items-center gap-3`}>
        {avatar && (
          <AvatarImage
            username={profile.username || profile.name}
            avatarUrl={profile.avatarUrl}
            className="h-12 w-12 rounded-lg object-cover border border-white/10 shadow-md shrink-0 bg-slate-800"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className={`flex ${alignRight ? "flex-row-reverse" : "flex-row"} items-center justify-between gap-2`}>
            <div className={`flex ${alignRight ? "flex-row-reverse" : "flex-row"} items-center gap-1.5 min-w-0`}>
              <span className="truncate font-black text-xs uppercase tracking-wide text-slate-100 sm:text-sm">{profile.name}</span>
              {profile.name?.toLowerCase() === "weptune" && (
                <span className="shrink-0 rounded border border-purple-500/30 bg-purple-950/50 px-1 py-0.2 text-[8px] font-mono font-black text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.4)] animate-pulse">
                  CREATOR
                </span>
              )}
              <span className="shrink-0 rounded bg-slate-800 border border-slate-700 px-1 py-0.5 text-[8px] font-mono font-black text-amber-300">Lvl {profile.level || 1}</span>
            </div>
            <span className="font-mono text-[10px] font-black text-teal-300 shrink-0">{profile.elo} Elo</span>
          </div>
          <div className="mt-2.5">
            <div className="h-2.5 overflow-hidden rounded-full bg-black/60 border border-white/5">
              <div
                className={`h-full bg-gradient-to-r ${color} transition-[width] duration-300 ease-out ${hp < 30 ? "hp-bar-low" : ""}`}
                style={{ width: `${hp}%` }}
              />
            </div>
            <div className={`mt-1 flex ${alignRight ? "flex-row-reverse" : "flex-row"} items-center justify-between text-[9px] font-mono text-slate-400`}>
              <span>{hp} HP</span>
              <span>{hp} / 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
