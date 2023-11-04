import { Router } from "express";

import { subAdminController } from "../../controllers/admin/adminController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post(
  "/create-sub-admin",
  validateAdmin,
  subAdminController.createSubAdmin
);

export default route;
