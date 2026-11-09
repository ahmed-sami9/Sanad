// Client-side checks for instant feedback only. The backend validates again and is the real gate.
// Each function returns a message key from messages/*.json (auth.errors.*), or null when valid.

export type AuthErrorKey =
  | "penNameRequired"
  | "penNameLength"
  | "emailRequired"
  | "emailInvalid"
  | "passwordRequired"
  | "passwordShort"
  | "passwordLong";

// Same limits the backend will enforce, kept in one place.
export const PEN_NAME_MIN = 2;
export const PEN_NAME_MAX = 40;
export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 128;

// Deliberately loose: "something@something.something". Real verification is the email itself.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function checkPenName(value: string): AuthErrorKey | null {
  const trimmed = value.trim();
  if (!trimmed) return "penNameRequired";
  if (trimmed.length < PEN_NAME_MIN || trimmed.length > PEN_NAME_MAX) return "penNameLength";
  return null;
}

export function checkEmail(value: string): AuthErrorKey | null {
  const trimmed = value.trim();
  if (!trimmed) return "emailRequired";
  if (!EMAIL_SHAPE.test(trimmed)) return "emailInvalid";
  return null;
}

// Sign-up enforces the length rules; sign-in only needs something typed.
export function checkNewPassword(value: string): AuthErrorKey | null {
  if (!value) return "passwordRequired";
  if (value.length < PASSWORD_MIN) return "passwordShort";
  if (value.length > PASSWORD_MAX) return "passwordLong";
  return null;
}

export function checkExistingPassword(value: string): AuthErrorKey | null {
  return value ? null : "passwordRequired";
}
