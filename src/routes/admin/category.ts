import { Router } from "express";

import { categoryController } from "../../controllers/admin/categoryController";
import { validateAdmin } from "../../middlewares/adminAuth";

const route = Router();

route.post("/create-category",validateAdmin, categoryController.createCategory);
route.patch("/update-category",validateAdmin, categoryController.updateCategory);

export default route;
