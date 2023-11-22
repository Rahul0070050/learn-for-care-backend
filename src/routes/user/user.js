import { Router } from "express";

import { validateUser } from "../../middlewares/userAuth.js";
import { userController } from "../../controllers/user/userController.js";
import { validateCompanyUserUser } from "../../middlewares/compayUserAuth.js";

const route = Router();

route.get("/data", validateUser, userController.getUserData);
route.post("/update-user-data", validateUser, userController.updateUserData);
route.post("/set-profile-image", validateUser, userController.setProfileImage);
route.get("/get-purchased-bundles", validateUser, userController.getPurchasedBundles);
// sub-user
route.post("/create-sub-user", validateCompanyUserUser, userController.createSubUser);
route.get("/get-all-sub-users", validateCompanyUserUser, userController.getSubUser);
route.post("/assign-course-to-sub-user", validateCompanyUserUser, userController.assignCourseToSubUser);
route.post("/block-sub-user", validateCompanyUserUser, userController.blockSubUser);
route.post("/unblock-sub-user", validateCompanyUserUser, userController.unBlockSubUser);
route.get("/get-all-blocked-sub-user", validateCompanyUserUser, userController.getBlocked);
route.get("/get-all-assigned-course-progress", validateCompanyUserUser, userController.getAllAssignedCourseProgress);

// manager-individual
route.post("/create-manager-individual", validateCompanyUserUser, userController.createManagerIndividual);
route.get("/get-all-sub-users", validateCompanyUserUser, userController.getSubUser);
route.post("/assign-course-to-sub-user", validateCompanyUserUser, userController.assignCourseToSubUser);
route.post("/block-sub-user", validateCompanyUserUser, userController.blockSubUser);
route.post("/unblock-sub-user", validateCompanyUserUser, userController.unBlockSubUser);
route.get("/get-all-blocked-sub-user", validateCompanyUserUser, userController.getBlocked);
route.get("/get-all-assigned-course-progress", validateCompanyUserUser, userController.getAllAssignedCourseProgress);

// manager
route.post("/create-manager", validateCompanyUserUser, userController.createManager);
route.get("/get-all-managers", validateCompanyUserUser, userController.getAllManagers);
route.post("/assign-course-to-sub-user", validateCompanyUserUser, userController.assignCourseToSubUser);
route.post("/block-sub-user", validateCompanyUserUser, userController.blockSubUser);
route.post("/unblock-sub-user", validateCompanyUserUser, userController.unBlockSubUser);
route.get("/get-all-blocked-sub-user", validateCompanyUserUser, userController.getBlocked);
route.get("/get-all-assigned-course-progress", validateCompanyUserUser, userController.getAllAssignedCourseProgress);


export default route;
