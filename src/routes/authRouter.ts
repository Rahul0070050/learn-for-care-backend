import { Router } from "express";
import { userController } from "../controllers/userAuthController";

const route = Router();

// user auth routes
route.post("/registration", userController.signup);
route.post("/login", userController.login);
route.post("/validate-otp", userController.validateOtp);
route.patch("/resend-otp", userController.resentOtp);

export default route;