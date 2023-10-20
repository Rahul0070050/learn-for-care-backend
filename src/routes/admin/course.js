import { Router } from "express";

import { courseController } from "../../controllers/admin/courseController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/create-course", validateAdmin, courseController.createCourse);
route.get("/get-single-course/:id",validateAdmin,courseController.getCourseById);
route.get("/get-all-course",validateAdmin,courseController.getAllCourses);
route.post("/get-course-by-category",validateAdmin,courseController.getCourseByCategory);
route.post("/update-course-video",validateAdmin,courseController.updateCourseVideo);
route.post("/update-course-ppt",validateAdmin,courseController.updateCoursePpt);
route.post("/update-course-resource",validateAdmin,courseController.updateCourseResource);
route.post("/update-course-intro-video",validateAdmin,courseController.updateCourseIntroVideo);
route.post("/update-course-thumbnail",validateAdmin,courseController.updateCourseThumbnail);
route.post("/update-course-data",validateAdmin,courseController.updateCourseData);

export default route;
