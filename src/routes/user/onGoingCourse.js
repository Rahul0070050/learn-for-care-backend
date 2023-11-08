
import { Router } from "express";

import { onGoingCourseController } from "../../controllers/user/courseLearnController.js";
import { validateUser } from "../../middlewares/userAuth.js";

const route = Router();

route.get("/get-on-going-course/:id",validateUser, onGoingCourseController.getOnGoingCourseById);

export default route;