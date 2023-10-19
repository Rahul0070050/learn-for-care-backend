import { Router } from "express";

import { validateUser } from "../../middlewares/userAuth.js";
import { userController } from "../../controllers/user/userController.js";

const route = Router();

route.get("/data",validateUser, userController.getUserData);

export default route;
