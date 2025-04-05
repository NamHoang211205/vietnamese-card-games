import express from "express";
import { connectDB } from "./database/db";
import cookieParser from "cookie-parser";
import { log } from "./lib/utils";
import { config } from "dotenv";
import authRouter from "./routes/auth.routes"
import userRouter from "./routes/user.routes"

config({path: ".env.local"});

const app = express()

await connectDB();

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(process.env.PORT || 3000, () => {
  log("Server is listening on port 3000", "info");
})