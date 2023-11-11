import { Router } from "express";
import { subUserController } from "../../controllers/subUser/authController.js";
import { validateSubUser } from "../../middlewares/checkSubUser.js";

const route = Router();

// user auth routes
route.get(
  "/get-assigned-course",
  validateSubUser,
  subUserController.getAssignedCourse
);
// route.post("/login", subUserController.login);

export default route;
