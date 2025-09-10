import express from "express";
import type { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { PORT,NODE_ENV } from "./config";
import allRoutes from "./routes/router"

dotenv.config();

const app: Application = express();

app.use(express.json());

const corsOptions={
  origin: NODE_ENV === 'dev'?'http://localhost:3000':'https://w8w.rudrasankha.com',
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

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing DB connection...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing DB connection...');
  process.exit(0);
});