import { Router } from "express";
import { userAuthController } from "../../controllers/user/authController.js";

const route = Router();

// user auth routes
route.post("/registration", userAuthController.signup);
route.post("/login", userAuthController.login);
route.post("/validate-otp", userAuthController.validateOtp);
route.patch("/resend-otp", userAuthController.resendOtp);

export default route;