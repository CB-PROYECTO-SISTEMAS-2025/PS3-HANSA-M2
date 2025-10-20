/* eslint-disable prettier/prettier */
// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import { logger } from "./utils/logger";
import { corsOptions } from "./config/cors";

// Rutas
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import fileRoutes from "./routes/fileRoutes";
import repositoryRoutes from "./routes/repositoryRoutes";

const app = express();

// Seguridad y parsers
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logs HTTP
app.use(
  morgan("combined", {
    stream: { write: (msg: string) => logger.http(msg.trim()) },
  })
);

// Healthcheck

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/repositorios", repositoryRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Handler de errores
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
