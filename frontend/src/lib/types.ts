// Shared domain types for the Synapse GG client.

export type GameState = "menu" | "queue" | "versus_intro" | "initial_discard" | "drafting" | "battle" | "results";
export type Screen = "auth" | "play" | "profile" | "leaderboard" | "social";

export type Account = {
  id: string;
  username: string;
  elo: number;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  botWins?: number;
  botLosses?: number;
  botGamesPlayed?: number;
  winStreak?: number;
  flawlessWins?: number;
  loggedDays?: string[];
  bestElo: number;
  fieldElos?: Record<string, number>;
  fieldStats?: Record<string, { wins: number; losses: number }>;
  createdAt: string;
  level?: number;
  xp?: number;
  dailyStreak?: number;
  highestDailyStreak?: number;
  lastDailyChallengeAt?: string | null;
};

export type Friendship = {
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted';
  createdAt: string;
  isOutgoingRequest: boolean;
  isIncomingRequest: boolean;
  friend: {
    id: string;
    username: string;
    avatarUrl: string;
    bannerUrl: string;
    elo: number;
    wins: number;
    losses: number;
    bio: string;
    xp: number;
    level: number;
    isOnline?: boolean;
  };
};

export type ChatMessage = {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  bannerUrl: string;
  elo: number;
  level: number;
  message: string;
  timestamp: string;
};

export type DirectMessagePayload = {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  sender?: {
    id: string;
    username: string;
    avatarUrl: string;
  };
};

export type Achievement = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  progressText: string;
  color: string;
};

export type IncomingChallenge = {
  challengeId: string;
  challenger: Account;
  domain: string;
};

export type MatchData = {
  id?: string;
  draftTurn?: string;
  currentRound?: number;
  domain?: string;
};

export type RoundData = {
  round: number;
  question: {
    prompt: string;
    options: string[];
    timeLimit: number;
  };
};

export type RoundResult = {
  answers: Record<string, { answer: number; timeTaken: number }>;
  correctAnswer: number;
  hpData: Record<string, number>;
  damageDealt: Record<string, number>;
};

export type WinnerInfo = {
  winner: string;
  elo: number;
  eloDelta: number;
  domain?: string;
  reason?: string;
  roundsHistory?: any[];
};

export type FighterProfile = {
  id?: string;
  name: string;
  username?: string;
  elo: number;
  hp: number;
  avatarUrl?: string;
  bannerUrl?: string;
  level?: number;
};

export type LeaderboardEntry = {
  rank: number;
  user: Account;
};

export type MatchRecord = {
  id: string;
  winner_id?: string | null;
  loser_id?: string | null;
  winnerId?: string | null;
  loserId?: string | null;
  player_one_id?: string | null;
  player_two_id?: string | null;
  playerOneId?: string | null;
  playerTwoId?: string | null;
  player_one_name?: string;
  player_two_name?: string;
  playerOneName?: string;
  playerTwoName?: string;
  player_one_delta?: number;
  player_two_delta?: number;
  playerOneDelta?: number;
  playerTwoDelta?: number;
  rounds: number;
  finished_at?: string;
  finishedAt?: string;
  domain?: string;
  roundsHistory?: any[];
};

export type BracketPlayer = {
  userId: string;
  username: string;
  avatarUrl: string;
  elo?: number;
};

export type BracketMatch = {
  id: string;
  p1: BracketPlayer | null;
  p2: BracketPlayer | null;
  winner: BracketPlayer | null;
  status: 'scheduled' | 'playing' | 'completed';
  matchId: string | null;
  queued?: string[];
};

export type BracketRound = {
  roundIndex: number;
  name: string;
  matches: BracketMatch[];
};

export type TournamentBracket = {
  size: number;
  currentRound: number;
  roundDeadline: number;
  rounds: BracketRound[];
  champion?: BracketPlayer;
};

export type Tournament = {
  id: string;
  name: string;
  domain: string;
  starts_at: string;
  ends_at: string;
  status: string;
  bracket?: string;
};

export type TournamentParticipant = {
  tournament_id: string;
  user_id: string;
  wins: number;
  losses: number;
  points: number;
  username: string;
  avatar_url: string;
  level: number;
  elo: number;
};

export type TournamentHistoryEntry = {
  id: string;
  tournament_name: string;
  wins: number;
  losses: number;
  points: number;
  placed: number;
  total_participants: number;
  finished_at: string;
};
