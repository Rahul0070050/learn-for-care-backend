import { Router } from "express";

import { examController } from "../../controllers/user/examController.js";
import { validateUser } from "../../middlewares/userAuth.js";

const route = Router();

route.post("/get-exam",validateUser, examController.getExam);

export default route;
