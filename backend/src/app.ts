import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { authRoutes } from "./modules/auth/auth.routes";

export const app = express();

// Behind Render's proxy, every request would otherwise share the proxy's IP, breaking rate limits.
if (env.NODE_ENV === "production") app.set("trust proxy", 1);

// credentials: true lets the browser send the auth cookie cross-origin.
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);
