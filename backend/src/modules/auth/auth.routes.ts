import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { createRateLimit } from "../../middleware/rateLimit";
import * as controller from "./auth.controller";

// Separate limits: failed sign-ins shouldn't block the demo, and each demo creates a database user.
const credentialsLimit = createRateLimit({ windowMinutes: 15, limit: 10 });
const demoLimit = createRateLimit({ windowMinutes: 60, limit: 5 });

export const authRoutes = Router();

authRoutes.post("/sign-up", credentialsLimit, controller.signUp);
authRoutes.post("/sign-in", credentialsLimit, controller.signIn);
authRoutes.post("/demo", demoLimit, controller.startDemo);
authRoutes.get("/me", requireAuth, controller.me);
authRoutes.post("/sign-out", controller.signOut);
