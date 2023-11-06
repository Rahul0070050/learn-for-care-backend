import { Router } from "express";

import { bundleController } from "../../controllers/admin/bundleController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/create-bundle", validateAdmin, bundleController.createBundle);
// route.delete("/delete-bundle", validateAdmin, bundleController.createBlog);

export default route;
