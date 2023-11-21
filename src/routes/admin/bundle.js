import { Router } from "express";

import { bundleController } from "../../controllers/admin/bundleController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/create-bundle", validateAdmin, bundleController.createBundle);
route.get("/get-all-course-bundles", validateAdmin, bundleController.getAllCourseBundles);
route.delete("/delete-bundle/:id", validateAdmin, bundleController.deleteBundle);

export default route;
