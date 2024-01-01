import { Router } from "express";
import { adminAuthController } from "../../controllers/admin/authController.js";

const route = Router();

// admin auth routes
route.post("/login", adminAuthController.login);
route.post("/validate-otp", adminAuthController.validateOtp);
route.patch("/resend-otp", adminAuthController.resendOtp);
route.patch("/update-password", adminAuthController.changePassword);

export default route;