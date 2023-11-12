import { Router } from "express";
import { subUserController } from "../../controllers/subUser/authController.js";
import { validateUser } from "../../middlewares/userAuth.js";

const route = Router();

// user auth routes
route.get(
  "/get-assigned-course",
  validateUser,
  subUserController.getAssignedCourse
);
// route.post("/login", subUserController.login);

export default route;
