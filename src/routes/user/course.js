import { Router } from "express";

import { validateUser } from "../../middlewares/userAuth.js";
import { courseController } from "../../controllers/user/courseController.js";

const route = Router();

route.get("/get-single-course/:id",courseController.getCourseById);
route.get("/get-all-course",courseController.getAllCourses);
route.get("/get-course-by-limit/:limit",courseController.getCoursesByLimit);
route.post("/get-course-by-category",courseController.getCourseByCategory);
route.get("/get-bought-course",validateUser, courseController.getBoughtCourses);
route.get("/get-all-bought-course",validateUser, courseController.getAllBoughtCourses);
route.get("/start-course/:id",validateUser, courseController.startCourse);

export default route;