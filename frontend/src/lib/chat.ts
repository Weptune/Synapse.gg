import type { Account, ChatMessage, DirectMessagePayload } from "@/lib/types";

export function dmToChatMessage(msg: DirectMessagePayload, account: Account | null): ChatMessage {
  const isOwn = msg.senderId === account?.id;
  return {
    id: msg.id,
    userId: msg.senderId,
    username: isOwn ? (account?.username || "You") : (msg.sender?.username || "Unknown"),
    avatarUrl: isOwn ? (account?.avatarUrl || "") : (msg.sender?.avatarUrl || ""),
    bannerUrl: isOwn ? (account?.bannerUrl || "") : "",
    elo: isOwn ? (account?.elo || 0) : 0,
    level: isOwn ? (account?.level || 1) : 1,
    message: msg.message,
    timestamp: msg.createdAt || new Date().toISOString(),
  };
}
