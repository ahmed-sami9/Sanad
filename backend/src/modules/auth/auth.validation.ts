import { z } from "zod";

// Limits match frontend/lib/validation/auth.ts; the server re-checks because the browser can be bypassed.
const email = z.string().trim().toLowerCase().max(254).pipe(z.email());

export const signUpSchema = z.object({
  penName: z.string().trim().min(2).max(40),
  email,
  password: z.string().min(12).max(128),
});

// No minimum length on sign-in: a rule change later must not lock out accounts made under the old rule.
export const signInSchema = z.object({
  email,
  password: z.string().min(1).max(128),
});

export type SignUpInput = z.output<typeof signUpSchema>;
export type SignInInput = z.output<typeof signInSchema>;
