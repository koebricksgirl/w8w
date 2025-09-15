import express from "express";
import type { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { PORT,NODE_ENV, FRONTEND_URL } from "./config";
import allRoutes from "./routes/router"
import webHookRouter from "./routes/webhook"
import prisma from "@w8w/db";

dotenv.config();

const app: Application = express();

app.use(express.json());

const corsOptions={
  origin: NODE_ENV === 'dev'?'http://localhost:5173': FRONTEND_URL,
  method:['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:true
}

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


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