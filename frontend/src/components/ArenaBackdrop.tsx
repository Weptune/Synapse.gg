export function ArenaBackdrop() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Rich midnight sapphire background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#040822] via-[#080d2d] to-[#030310]" />

      {/* High-visibility glowing cosmic nebulas */}
      <div
        className="absolute inset-0 opacity-100 mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 25%, rgba(45, 212, 191, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 90% 20%, rgba(249, 115, 22, 0.24) 0%, transparent 45%),
            radial-gradient(circle at 50% 90%, rgba(168, 85, 247, 0.22) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(244, 63, 94, 0.18) 0%, transparent 45%)
          `
        }}
      />

      {/* Floating Orbs with custom glow colors */}
      <div className="arena-orb arena-orb-1 opacity-90" />
      <div className="arena-orb arena-orb-2 opacity-80" />
      <div className="arena-orb arena-orb-3 opacity-70" />

      {/* Grid pattern overlay */}
      <div className="arena-grid opacity-35" />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(3,3,16,0.55)_100%)]" />
    </div>
  );
}
