import { Router } from "express";

import { subAdminController } from "../../controllers/admin/adminController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post(
  "/create-sub-admin",
  validateAdmin,
  subAdminController.createSubAdmin
);
route.delete(
  "/delete-sub-admin",
  validateAdmin,
  subAdminController.deleteSubAdmin
);
route.post(
  "/list-all-sub-admin",
  validateAdmin,
  subAdminController.listSubAdmin
);
route.post("/create-user", validateAdmin, subAdminController.createUser);
route.get("/block-user/:id", validateAdmin, subAdminController.blockUser);
route.get("/unblock-user/:id", validateAdmin, subAdminController.unBlockUser);

export default route;
