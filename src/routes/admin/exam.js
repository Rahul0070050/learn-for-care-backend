import { Router } from "express";

import { examController } from "../../controllers/admin/examController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/create-exam",validateAdmin, examController.createExam);
route.get("/get-all-exam",validateAdmin, examController.getAllExam);
route.get("/get-exam/:id",validateAdmin, examController.getExam);
route.delete("/delete-exam/:id",validateAdmin, examController.deleteExam);

export default route;
