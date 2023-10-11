import { Router } from "express";

import { categoryController } from "../../controllers/admin/categoryController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/create-category",validateAdmin, categoryController.createCategory);
route.patch("/update-category",validateAdmin, categoryController.updateCategory);

export default route;
