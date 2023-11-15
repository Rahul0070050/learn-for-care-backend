import { Router } from "express";

import { subAdminController } from "../../controllers/admin/adminController.js";
import { validateAdmin, validateAdminPrivilege } from "../../middlewares/adminAuth.js";
import { stripeObj } from "../../conf/stripe.js";

const route = Router();

route.post(
  "/create-sub-admin",
  validateAdminPrivilege,
  subAdminController.createSubAdmin
);
route.delete(
  "/delete-sub-admin",
  validateAdminPrivilege,
  subAdminController.deleteSubAdmin
);
route.get(
  "/list-all-sub-admin",
  validateAdmin,
  subAdminController.listSubAdmin
);
route.post("/create-user", validateAdmin, subAdminController.createUser);
route.get("/get-all-users", validateAdmin, subAdminController.getAllUsers);
route.get("/get-user-data-by-id/:id", validateAdmin, subAdminController.getUserDataById);
route.get("/block-user/:id", validateAdmin, subAdminController.blockUser);
route.get("/unblock-user/:id", validateAdmin, subAdminController.unBlockUser);
route.get("/super-admin-dashboard-data", validateAdmin, subAdminController.superAdminDashboard);
route.put("/set-admin-info", validateAdmin, subAdminController.setAdminInfo);


export default route;
