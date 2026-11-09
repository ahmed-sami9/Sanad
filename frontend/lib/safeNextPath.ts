// Only allow redirects to paths on this site. "//evil.com" and "https://evil.com" would send
// a freshly signed-in user to another website (an open redirect), so they fall back to the default.
export function safeNextPath(next: string | null | undefined, fallback: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
