import { rateLimit } from "express-rate-limit";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

// Per-IP limit; answers with the same { code, message } shape as every other error.
export function createRateLimit({ windowMinutes, limit }: { windowMinutes: number; limit: number }) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: () => env.NODE_ENV === "test",
    handler: (_req, _res, next) => next(new AppError(429, "RATE_LIMITED", "Too many attempts, try again later")),
  });
}
