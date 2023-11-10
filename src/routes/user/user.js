import { Router } from "express";

import { validateUser } from "../../middlewares/userAuth.js";
import { userController } from "../../controllers/user/userController.js";
import { validateCompanyUserUser } from "../../middlewares/compayUserAuth.js";

const route = Router();

route.get("/data", validateUser, userController.getUserData);
route.post("/create-sub-user", validateCompanyUserUser, userController.createSubUser);
route.get("/get-all-sub-users", validateCompanyUserUser, userController.getSubUser);
route.post("/assign-course-to-sub-user", validateCompanyUserUser, userController.assignCourseToSubUser);
route.post("/block-sub-user", validateCompanyUserUser, userController.blockSubUser);
route.post("/unblock-sub-user", validateCompanyUserUser, userController.unBlockSubUser);
route.get("/get-all-blocked-sub-user", validateCompanyUserUser, userController.getBlocked);

export default route;
