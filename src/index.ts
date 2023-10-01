import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";

import { mySqlConnect } from "./conf/mysql";

import userAuth from "./routes/user/auth";
import adminAuth from "./routes/admin/auth";
import category from './routes/admin/category'
import course from './routes/admin/course'

const app = express();

dotenv.config();

// middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: ["http://localhost:3000", "https://test.learnforcare.com"],
    credentials: true,
  })
);

// mysql connection
mySqlConnect((err: Error) => {
  try {
    if (err) console.log(err);
    else console.log("mysql connected");
  } catch (error) {
    console.log(error);
  }
});

// user routes
app.use("/api/user/auth", userAuth);

// admin routes
app.use("/api/admin/auth", adminAuth);
app.use("/api/admin/category", category);
app.use("/api/admin/course", course);

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  
  res
    .status(500)
    .json({ ok: false, error: err?.message, message: "Something broke!" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server running on port ", PORT);
});
