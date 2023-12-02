import { Router } from "express";

import { validateCompanyOrManagerUser, validateUser } from "../../middlewares/userAuth.js";
import { validateManagerUser } from "../../middlewares/managerUSerAuth.js";
import { userController } from "../../controllers/user/userController.js";
import { validateCompanyUserUser } from "../../middlewares/compayUserAuth.js";

const route = Router();

route.get("/data", validateUser, userController.getUserData);
route.post("/update-user-data", validateUser, userController.updateUserData);
route.post("/set-profile-image", validateUser, userController.setProfileImage);
route.get("/get-purchased-bundles", validateUser, userController.getPurchasedBundles);
route.get("/get-individual-assigned-bundles", validateUser, userController.getAllAssignedBundlesForIndividuals); // this also works fro company users because admin can assign bundles to the company and individual users
route.get("/get-assigned-bundles-for-company", validateUser, userController.getAllAssignedBundlesForCompany); // this also works fro company users because admin can assign bundles to the company and individual users
// sub-user
// route.post("/create-sub-user", validateCompanyUserUser, userController.createSubUser);
// route.get("/get-all-sub-users", validateCompanyUserUser, userController.getSubUser);
// route.post("/assign-course-to-sub-user", validateCompanyUserUser, userController.assignCourseToSubUser);
// route.post("/block-sub-user", validateCompanyUserUser, userController.blockSubUser);
// route.post("/unblock-sub-user", validateCompanyUserUser, userController.unBlockSubUser);
// route.get("/get-all-blocked-sub-user", validateCompanyUserUser, userController.getBlocked);
// route.get("/get-all-assigned-course-progress", validateCompanyUserUser, userController.getAllAssignedCourseProgress);

//company
route.get("/get-all-manager-individual", validateCompanyOrManagerUser, userController.getAllManagerIndividual);
route.get("/get-all-individuals-under-company", validateCompanyOrManagerUser, userController.getAllIndividualUnderCompany);
route.post("/assign-course-to-manager-individual", validateCompanyOrManagerUser, userController.assignCourseToManagerIndividual);
route.post("/assign-course-to-manager-individual-from-manager", validateCompanyOrManagerUser, userController.assignCourseToManagerIndividualFromManager);
route.post("/assign-course-to-manager", validateCompanyUserUser, userController.assignCourseToManager);
route.post("/assign-course-to-manager-from-assigned", validateCompanyUserUser, userController.assignCourseToManagerFromAssigned);
route.post("/assign-course-to-manager-individual-from-assigned", validateCompanyOrManagerUser, userController.assignCourseToManagerIndividualFromAssigned);
route.post("/assign-course-to-manager-individual-from-manager-assigned", validateCompanyOrManagerUser, userController.assignCourseToManagerIndividualFromManagerAssigned);

// manager
route.get("/get-assigned-course-for-manager", validateCompanyOrManagerUser, userController.getAssignedCourseForManager);
route.post("/create-manager-individual", validateCompanyOrManagerUser, userController.createManagerIndividual);
// route.post("/assign-course-to-manager-individual", validateCompanyUserUser, userController.assignCourseToManagerIndividual);
route.get("/get-assigned-bundle", validateCompanyOrManagerUser, userController.getAssignedBundles); // manager and company users
// route.get("/get-purchased-course", validateCompanyUserUser, userController.blockSubUser);
route.post("/block-user", validateCompanyOrManagerUser, userController.blockUser);
route.post("/unblock-user", validateCompanyOrManagerUser, userController.unBlockUser);
route.get("/get-all-blocked-sub-user", validateCompanyUserUser, userController.getBlocked);
route.get("/get-all-assigned-course-progress", validateCompanyUserUser, userController.getAllAssignedCourseProgress);

// manager
route.post("/create-manager", validateCompanyUserUser, userController.createManager);
route.get("/get-all-managers", validateCompanyUserUser, userController.getAllManagers);
// route.post("/assign-course-to-sub-user", validateCompanyUserUser, userController.assignCourseToSubUser);
route.get("/get-all-blocked-sub-user", validateCompanyUserUser, userController.getBlocked);
route.get("/get-all-assigned-course-progress", validateCompanyUserUser, userController.getAllAssignedCourseProgress);
route.post("/assign-course-or-bundle", validateCompanyOrManagerUser, userController.assignCourseOrBundle);

// individual reports
route.get("/get-all-transactions", validateUser, userController.getAllTransactions);
route.get("/get-all-transactions-by-month", validateUser, userController.getAllMonthlyTransactions);

// company reports
route.get("/get-all-manager-reports", validateUser, userController.getAllManagerReports);
route.get("/get-all-ind-reports", validateUser, userController.getAllIndReports);

route.post("/manager-self-assign-course", validateUser, userController.managerSelfAssignCourse);
route.get("/get-course-wise-manager-reports", validateUser, userController.getCourseWiseManagerReports);
route.get("/get-course-wise-individual-reports", validateUser, userController.getCourseWiseIndividualReports);

export default route;
