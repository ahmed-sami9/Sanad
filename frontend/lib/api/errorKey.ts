// Maps a backend error code to a translated message key (messages/*.json → auth.errors.*).
// Unknown codes get a generic message, so a new backend error can never show raw technical text to a user.
const known = [
  "EMAIL_TAKEN",
  "INVALID_CREDENTIALS",
  "RATE_LIMITED",
  "NETWORK_ERROR",
  "GOOGLE_FAILED",
  "GOOGLE_EMAIL_IN_USE",
  "GOOGLE_SIGNUP_EXPIRED",
] as const;
export type ApiErrorKey = (typeof known)[number] | "UNKNOWN_ERROR";

export function errorKeyFor(code: string | null): ApiErrorKey {
  return (known as readonly string[]).includes(code ?? "") ? (code as ApiErrorKey) : "UNKNOWN_ERROR";
}
