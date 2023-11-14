import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import fileUpload from "express-fileupload";

import userAuth from "./routes/user/auth.js";
import course from "./routes/user/course.js";
import userBlog from "./routes/user/blog.js";
import user from "./routes/user/user.js";
import cart from "./routes/user/cart.js";
import exam from "./routes/user/exam.js";
import userBundle from "./routes/user/bundle.js";
import onGoingCourse from "./routes/user/onGoingCourse.js";

import adminAuth from "./routes/admin/auth.js";
import category from "./routes/admin/category.js";
import adminCourse from "./routes/admin/course.js";
import adminBlog from "./routes/admin/blog.js";
import adminExam from "./routes/admin/exam.js";
import admin from "./routes/admin/admin.js";
import bundle from "./routes/admin/bundle.js";
import adminCertificate from "./routes/admin/certificate.js";
import adminInvoice from "./routes/admin/invoice.js";

import subUserAuth from "./routes/subUser/auth.js";
import subUserCourse from "./routes/subUser/assigneCourse.js";
import subUserInfo from "./routes/subUser/subUser.js";

import subAdminAuth from "./routes/subAdmin/auth.js";

import { mySqlConnect } from "./conf/mysql.js";
import { s3Config } from "./conf/aws_s3.js";

import { cartController } from "./controllers/user/cartController.js";

const app = express();

dotenv.config();

s3Config();

// stripe checkout route
app.post("/stripe-checkout", express.raw({ type: "application/json" }), cartController.stripResponse);

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
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://admin.learnforcare.co.uk",
      "https://test.learnforcare.co.uk"
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
app.use("/api/user/exam", exam);
app.use("/api/user/bundle", userBundle);
app.use("/api/user/course", course);
app.use("/api/user/on-going-course", onGoingCourse);

app.use("/api/user/sub-user", subUserAuth);
app.use("/api/user/sub-user/course", subUserCourse);
app.use("/api/user/sub-user/info", subUserInfo);

// admin routes
app.use("/api/admin/auth", adminAuth);
app.use("/api/admin/category", category);
app.use("/api/admin/course", adminCourse);
app.use("/api/admin/blog", adminBlog);
app.use("/api/admin/exam", adminExam);
app.use("/api/admin/info", admin);
app.use("/api/admin/invoice", adminInvoice);
app.use("/api/admin/bundle", bundle);
app.use("/api/admin/certificate", adminCertificate);

app.use("/api/admin/sub-admin", subAdminAuth);

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
