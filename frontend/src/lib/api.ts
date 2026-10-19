import { SOCKET_URL } from "@/lib/config";

export const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("/") && !url.startsWith("//")) {
    const baseUrl = SOCKET_URL.replace(/\/+$/, "");
    const cleanUrl = "/" + url.replace(/^\/+/, "");
    return `${baseUrl}${cleanUrl}`;
  }
  return url;
};

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  const baseUrl = SOCKET_URL.replace(/\/+$/, "");
  const cleanPath = "/" + path.replace(/^\/+/, "");

  try {
    response = await fetch(`${baseUrl}${cleanPath}`, options);
  } catch {
    throw new Error(`Cannot reach backend at ${baseUrl}. Make sure the updated backend server is running.`);
  }

  const text = await response.text();
  let data: { error?: string } = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Backend returned a non-JSON response for ${path}. You may be talking to an old server process.`);
  }

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}.`);
  }

  return data as T;
}
