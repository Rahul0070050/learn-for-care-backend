import { Router } from "express";
import { adminAuthController } from "../../controllers/admin/adminAuthController";

const route = Router();

// admin auth routes
route.post("/login", adminAuthController.login);
route.post("/validate-otp", adminAuthController.validateOtp);
route.patch("/resend-otp", adminAuthController.resendOtp);

export default route;