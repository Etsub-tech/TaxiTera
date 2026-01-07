import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import terminalRoutes from "./routes/terminal.routes.js";
import historyRoutes from "./routes/history.routes.js";

connectDB();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/terminals", terminalRoutes);
app.use("/api/history", historyRoutes);

export default app;