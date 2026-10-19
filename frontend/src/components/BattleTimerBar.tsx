"use client";

import { memo, useEffect, useState } from "react";

export const BattleTimerBar = memo(function BattleTimerBar({
  timeLimit,
  roundKey,
  paused,
}: {
  timeLimit: number;
  roundKey: string;
  paused: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setTimeLeft(timeLimit);
    if (paused) return;

    const tickMs = 250;
    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - tickMs / 1000));
    }, tickMs);

    return () => clearInterval(timer);
  }, [timeLimit, roundKey, paused]);

  const pct = Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100));
  const urgent = timeLeft < 5 && !paused;

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-black/50 border border-white/5 shadow-inner">
      <div
        className={`h-full rounded-full transition-[width] duration-200 ease-linear ${urgent ? "bg-gradient-to-r from-red-500 to-orange-400 hp-bar-low" : "bg-gradient-to-r from-teal-400 to-emerald-400"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
});
