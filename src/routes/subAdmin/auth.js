import { Router } from "express";
import { subAdminController } from "../../controllers/subAdmin/adminController.js";

const route = Router();

// user auth routes
route.post("/login", subAdminController.login);

export default route;
