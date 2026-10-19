export const getFontSize = (text: string) => {
  if (text.length > 25) return "text-xl sm:text-2xl";
  if (text.length > 15) return "text-2xl sm:text-3xl";
  return "text-3xl sm:text-4xl";
};

export function formatRelativeTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function formatMessageTimestamp(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (d.getFullYear() !== now.getFullYear()) {
    options.year = '2-digit';
  }
  return d.toLocaleDateString([], options) + ", " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
