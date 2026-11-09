import type { AuthUser, SignInInput, SignUpInput } from "@/types/auth";
import { apiRequest } from "./client";

// The contract the auth module on the backend will implement. Every call sets or reads the
// httpOnly session cookie, so the frontend never stores a token itself.

export function signUp(input: SignUpInput) {
  return apiRequest<{ user: AuthUser }>("/auth/sign-up", { method: "POST", body: JSON.stringify(input) });
}

export function signIn(input: SignInInput) {
  return apiRequest<{ user: AuthUser }>("/auth/sign-in", { method: "POST", body: JSON.stringify(input) });
}

// Creates a temporary demo account seeded with sample data, and signs it in.
export function startDemo() {
  return apiRequest<{ user: AuthUser }>("/auth/demo", { method: "POST" });
}

// Google sign-in is a full-page redirect: the backend sends the browser to Google and back.
export function googleAuthUrl() {
  return `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
}
