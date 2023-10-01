import { Router } from "express";
import multer from "multer";

import { courseController } from "../../controllers/admin/courseController";
import { validateAdmin } from "../../middlewares/adminAuth";

const route = Router();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./uploads/");
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer();
let multerOption = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "intro_video", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "ppt", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);
route.post(
  "/create-course",
  validateAdmin,
  multerOption,
  courseController.createCourse
);
route.get("/get-single-course/:id",validateAdmin,courseController.getCourseById);

export default route;
