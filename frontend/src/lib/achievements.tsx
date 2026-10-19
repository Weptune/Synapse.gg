import { Trophy, Bot, Scale, GraduationCap, Users, Crown, Flame, Shield, Calendar, Award } from "lucide-react";
import type { Account, Achievement } from "@/lib/types";

export function getAchievementsForUser(user: Account | null, friendsCount: number): Achievement[] {
  if (!user) return [];

  const subjectWins = user.fieldStats ? Object.values(user.fieldStats).some((s: any) => (s.wins || 0) >= 25) : false;

  const totalDraws = Math.max(0, (user.gamesPlayed || 0) - (user.wins || 0) - (user.losses || 0)) +
                     Math.max(0, (user.botGamesPlayed || 0) - (user.botWins || 0) - (user.botLosses || 0));

  return [
    {
      id: "ranked_pioneer",
      title: "Ranked Veteran",
      desc: "Win 50 ranked duels in the global arena",
      icon: "Trophy",
      unlocked: (user.wins || 0) >= 50,
      progress: Math.min(100, Math.floor(((user.wins || 0) / 50) * 100)),
      progressText: `${user.wins || 0} / 50 Wins`,
      color: "from-amber-400 to-orange-500",
    },
    {
      id: "bot_buster",
      title: "Bot Decimator",
      desc: "Defeat the AI practice bot 100 times",
      icon: "Bot",
      unlocked: (user.botWins || 0) >= 100,
      progress: Math.min(100, Math.floor(((user.botWins || 0) / 100) * 100)),
      progressText: `${user.botWins || 0} / 100 Wins`,
      color: "from-blue-400 to-indigo-500",
    },
    {
      id: "equilibrium",
      title: "Equilibrium Master",
      desc: "Achieve 10 draw matches in duels",
      icon: "Scale",
      unlocked: totalDraws >= 10,
      progress: Math.min(100, Math.floor((totalDraws / 10) * 100)),
      progressText: `${totalDraws} / 10 Draws`,
      color: "from-purple-400 to-pink-500",
    },
    {
      id: "subject_expert",
      title: "Discipline Master",
      desc: "Win 25 ranked duels in a single discipline",
      icon: "GraduationCap",
      unlocked: subjectWins,
      progress: subjectWins ? 100 : 0,
      progressText: subjectWins ? "Unlocked" : "0 / 25 Wins in any discipline",
      color: "from-teal-400 to-emerald-500",
    },
    {
      id: "socialite",
      title: "Socialite Empire",
      desc: "Add 20 friends to your circle",
      icon: "Users",
      unlocked: friendsCount >= 20,
      progress: Math.min(100, Math.floor((friendsCount / 20) * 100)),
      progressText: `${friendsCount} / 20 Friends`,
      color: "from-fuchsia-400 to-purple-600",
    },
    {
      id: "grandmaster",
      title: "Genius Tier",
      desc: "Reach an elite peak rating of 1500 ELO",
      icon: "Crown",
      unlocked: (user.bestElo || 0) >= 1500,
      progress: Math.min(100, Math.floor(((user.bestElo || 1200) / 1500) * 100)),
      progressText: `${user.bestElo || 1200} / 1500 ELO`,
      color: "from-rose-400 to-red-600",
    },
    {
      id: "unstoppable",
      title: "Unstoppable",
      desc: "Achieve 10 ranked wins in a row",
      icon: "Flame",
      unlocked: (user.winStreak || 0) >= 10,
      progress: Math.min(100, Math.floor(((user.winStreak || 0) / 10) * 100)),
      progressText: `${user.winStreak || 0} / 10 Wins in a Row`,
      color: "from-orange-500 to-red-600 animate-pulse",
    },
    {
      id: "flawless",
      title: "Flawless Victory",
      desc: "Win 10 matches with a perfect 100-0 HP score",
      icon: "Shield",
      unlocked: (user.flawlessWins || 0) >= 10,
      progress: Math.min(100, Math.floor(((user.flawlessWins || 0) / 10) * 100)),
      progressText: `${user.flawlessWins || 0} / 10 Flawless Wins`,
      color: "from-cyan-400 to-teal-500",
    },
    {
      id: "chronos",
      title: "Chronos Scholar",
      desc: "Log on and battle for 30 different days",
      icon: "Calendar",
      unlocked: (user.loggedDays?.length || 0) >= 30,
      progress: Math.min(100, Math.floor(((user.loggedDays?.length || 0) / 30) * 100)),
      progressText: `${user.loggedDays?.length || 0} / 30 Days`,
      color: "from-emerald-400 to-yellow-500",
    }
  ];
}

export function renderAchievementIcon(iconName: string, className?: string) {
  const isSmall = className?.includes("h-4") || className?.includes("w-4");
  const size = isSmall ? 10 : 22;
  switch (iconName) {
    case "Trophy":
      return <Trophy className={className} size={size} />;
    case "Bot":
      return <Bot className={className} size={size} />;
    case "Scale":
      return <Scale className={className} size={size} />;
    case "GraduationCap":
      return <GraduationCap className={className} size={size} />;
    case "Users":
      return <Users className={className} size={size} />;
    case "Crown":
      return <Crown className={className} size={size} />;
    case "Flame":
      return <Flame className={className} size={size} />;
    case "Shield":
      return <Shield className={className} size={size} />;
    case "Calendar":
      return <Calendar className={className} size={size} />;
    default:
      return <Award className={className} size={size} />;
  }
}
