import { Router } from "express";
import { subUserInfoController } from "../../controllers/subUser/subUserInfoController.js";
import { validateUser } from "../../middlewares/userAuth.js";

const route = Router();

// user auth routes
route.get(
  "/get-info",
  validateUser,
  subUserInfoController.getInfo
);

export default route;
