import { Router } from "express";

import { validateUser } from "../../middlewares/userAuth.js";
import { courseController } from "../../controllers/user/courseController.js";

const route = Router();

route.get("/get-single-course/:id",courseController.getCourseById);
route.get("/get-all-course",courseController.getAllCourses);
route.post("/get-course-by-category",courseController.getCourseByCategory);

export default route;