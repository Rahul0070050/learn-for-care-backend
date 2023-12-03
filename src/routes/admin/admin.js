import { Router } from "express";

import { adminController } from "../../controllers/admin/adminController.js";
import { validateAdmin, validateAdminPrivilege } from "../../middlewares/adminAuth.js";
import { stripeObj } from "../../conf/stripe.js";

const route = Router();

route.post(
  "/create-sub-admin",
  validateAdminPrivilege,
  adminController.createSubAdmin
);
route.delete(
  "/delete-sub-admin",
  validateAdminPrivilege,
  adminController.deleteSubAdmin
);
// route.get(
//   "/list-all-managers",
//   validateAdmin,
//   adminController.listManagers
// );
route.post("/create-user", validateAdmin, adminController.createUser);
route.get("/get-all-users", validateAdmin, adminController.getAllUsers);
route.get("/get-user-data-by-id/:id", validateAdmin, adminController.getUserDataById);
route.get("/block-user/:id", validateAdmin, adminController.blockUser);
route.get("/unblock-user/:id", validateAdmin, adminController.unBlockUser);
route.get("/super-admin-dashboard-data", validateAdmin, adminController.superAdminDashboard);
route.get("/get-individuals-and-managers", validateAdmin, adminController.getINdividualsAndManagers);
route.put("/set-admin-info", validateAdmin, adminController.setAdminInfo);
route.get("/get-admin-info", validateAdmin, adminController.getAdminInfo);
route.get("/get-qualification", validateAdmin, adminController.getAdminQualification);
route.get("/get-experience", validateAdmin, adminController.getAdminExperience);
route.post("/set-staff-cv", validateAdmin, adminController.updateStaffCV);
route.post("/set-qualification", validateAdmin, adminController.setAdminQualification);
route.post("/set-experience", validateAdmin, adminController.setAdminExperience);
route.patch("/update-qualification/:id", validateAdmin, adminController.updateAdminQualificationDoc);
route.patch("/update-experience/:id", validateAdmin, adminController.updateAdminExperience);
route.patch("/update-experience-data", validateAdmin, adminController.updateAdminExperienceData);
route.patch("/update-qualification-data", validateAdmin, adminController.updateAdminQualificationData);

route.post("/update-admin-profile-banner", validateAdmin, adminController.updateAdminProfileBanner);
route.patch("/update-admin-profile-image", validateAdmin, adminController.updateAdminProfileImage);

route.delete("/delete-experience/:id", validateAdmin, adminController.delateAdminExperience);
route.delete("/delete-qualification/:id", validateAdmin, adminController.delateAdminQualification);

route.get("/get-manager-report", validateAdmin, adminController.getManagerReport);
route.get("/get-individual-report", validateAdmin, adminController.getIndividualReport);

route.post("/assign-bundle", validateAdmin, adminController.assignBundle);

export default route;
