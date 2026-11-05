import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/errorHandler";

export const app = express();

// credentials: true lets the browser send the auth cookie cross-origin.
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Module routers get mounted here, e.g. app.use("/api/v1/auth", authRoutes)

app.use(notFound);
app.use(errorHandler);
