import { Router } from "express";

import { validateUser } from "../../middlewares/userAuth.js";
import { courseController } from "../../controllers/user/courseController.js";

const route = Router();

route.get("/get-single-course/:id",courseController.getCourseById);
route.get("/get-all-course",courseController.getAllCourses);
route.get("/get-course-by-limit/:limit",courseController.getCoursesByLimit);
route.post("/get-course-by-category",courseController.getCourseByCategory);
route.get("/get-bought-course",validateUser, courseController.getBoughtCourses); // available course
route.get("/get-all-bought-course",validateUser, courseController.getAllBoughtCourses);
route.get("/get-all-assigned-course",validateUser, courseController.getAllAssignedCourses);
route.post("/start-course",validateUser, courseController.startCourse);
route.get("/get-manager-matrix-course", courseController.getManagerMatrix);
route.get("/get-manager-matrix-bundle",validateUser, courseController.getManagerMatrix);

export default route;