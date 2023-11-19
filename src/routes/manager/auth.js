import { Router } from "express";

import { managerController } from "../../controllers/manager/authController.js";

const route = Router();

// user auth routes
route.post("/login", managerController.login);

export default route;
