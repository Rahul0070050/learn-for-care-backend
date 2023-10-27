import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import fileUpload from "express-fileupload";

import { mySqlConnect } from "./conf/mysql.js";
import userAuth from "./routes/user/auth.js";
import adminAuth from "./routes/admin/auth.js";
import category from "./routes/admin/category.js";
import adminCourse from "./routes/admin/course.js";
import course from "./routes/user/course.js";
import adminBlog from "./routes/admin/blog.js";
import userBlog from "./routes/user/blog.js";
import user from "./routes/user/user.js";
import cart from "./routes/user/cart.js";
import { s3Config } from "./conf/aws_s3.js";

const app = express();

dotenv.config();

s3Config();

// middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(helmet());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: [
      "*",
      "http://localhost:3000",
      "http://localhost:5173",
      "https://test.learnforcare.com",
      "https://admin.learnforcare.co.uk",
    ],
    credentials: true,
  })
);

// mysql connection
mySqlConnect((err) => {
  try {
    if (err) console.log(err);
    else console.log("mysql connected");
  } catch (error) {
    console.log(error);
  }
});

// user routes
app.use("/api/user/auth", userAuth);
app.use("/api/user/cart", cart);
app.use("/api/user/blog", userBlog);
app.use("/api/user/info", user);
app.use("/api/user/course", course);

// admin routes
app.use("/api/admin/auth", adminAuth);
app.use("/api/admin/category", category);
app.use("/api/admin/course", adminCourse);
app.use("/api/admin/blog", adminBlog);

// error handler
app.use((err, req, res, next) => {
  res
    .status(500)
    .json({ ok: false, error: err?.message, message: "Something broke!" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server running on port ", PORT);
});
