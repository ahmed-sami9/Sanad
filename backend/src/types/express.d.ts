import type { SessionClaims } from "../modules/auth/auth.tokens";

// Set by requireAuth; only defined on routes that use it.
declare global {
  namespace Express {
    interface Request {
      auth?: SessionClaims;
    }
  }
}

export {};
