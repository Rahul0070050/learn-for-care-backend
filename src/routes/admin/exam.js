import { Router } from "express";

import { examController } from "../../controllers/admin/examController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/create-exam",validateAdmin, examController.createExam);
// route.post("/create-exam",validateAdmin, examController.getExam);

export default route;
