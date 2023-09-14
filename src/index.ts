import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";

import { mySqlConnect } from "./db/mysql";
import userRouter from "./routes/userRouter";
import { getRedisConnection } from "./db/redis";
const app = express();

dotenv.config();

// middleware
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: ["*"],
    credentials: true,
  })
);

// mysql connection
mySqlConnect((err: Error) => {
  try {
    if (err) throw err;
    console.log("mysql connected");
  } catch (error) {
    console.log(error);
  }
});

//redis connection
getRedisConnection((err: Error) => {
  try {
    if (err) throw err;
    console.log("redis connection successful");
  } catch (error) {
    console.log(error);
  }
});

// routes
app.use("/api/user", userRouter);

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server running on port ", PORT);
});
