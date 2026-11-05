import http from "node:http";
import { Server } from "socket.io";
import { app } from "./app";
import { env } from "./config/env";
import { connectDB, disconnectDB } from "./config/db";

// Express and Socket.IO share one HTTP server, so one port serves both.
const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: { origin: env.CLIENT_ORIGIN, credentials: true },
});

io.on("connection", (socket) => {
  console.log(`socket connected: ${socket.id}`);
});

async function start() {
  await connectDB();
  httpServer.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`);
  });
}

async function shutdown() {
  io.close();
  await disconnectDB();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
