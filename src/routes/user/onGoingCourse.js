
import { Router } from "express";

import { onGoingCourseController } from "../../controllers/user/courseLearnController.js";
import { validateUser } from "../../middlewares/userAuth.js";

const route = Router();

route.get("/get-on-going-course/:id",validateUser, onGoingCourseController.getOnGoingCourseById);
route.get("/get-attempts/:id",validateUser, onGoingCourseController.getCourseAttemptsById);
route.get("/get-all-on-going-courses",validateUser, onGoingCourseController.getAllOnGoingCourseById);

export default route;