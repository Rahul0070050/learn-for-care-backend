import { Router } from "express";

import { validateUser } from "../../middlewares/userAuth.js";
import { userController } from "../../controllers/user/userController.js";

const route = Router();

route.get("/data", validateUser, userController.getUserData);
route.post("/create-sub-user", validateUser, userController.createSubUser);
route.get("/get-all-sub-users", validateUser, userController.getSubUser);
route.post("/assign-course-to-sub-user", validateUser, userController.assignCourseToSubUser);
route.post("/block-sub-user", validateUser, userController.blockSubUser);
route.post("/unblock-sub-user", validateUser, userController.unBlockSubUser);

export default route;
