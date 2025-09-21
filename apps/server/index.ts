import express from "express";
import type { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { PORT,NODE_ENV, FRONTEND_URL } from "./config";
import allRoutes from "./routes/router"
import webHookRouter from "./routes/webhook"
import prisma from "@w8w/db";
import { globalLimiter } from "./utils/rate-limiter";
import morgan from "morgan";
import helmet from "helmet";

dotenv.config();

const app: Application = express();

app.use(express.json({ limit: "20kb" }));

const corsOptions={
  origin: NODE_ENV === 'dev'?'http://localhost:5173': FRONTEND_URL,
  method:['GET','POST','PUT','DELETE',"PATCH"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:true
}

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(globalLimiter);
app.use(morgan(NODE_ENV === "dev" ? "dev" : "combined")); 
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.json({});
});

app.use("/api/v1",allRoutes);
app.use("/",webHookRouter);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
    try {
        await Promise.all([
            prisma.$disconnect()
        ]);
        console.log('Server closed');
        process.exit(0);
    } catch (error) {
        console.error('Server error:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    try {
        await Promise.all([
            prisma.$disconnect()
        ]);
        console.log('Server closed');
        process.exit(0);
    } catch (error) {
        console.error('Server error:', error);
        process.exit(1);
    }
});