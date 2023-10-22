import { Router } from "express";
import { userAuthController } from "../../controllers/user/authController.js";
import { validateSubUser } from "../../middlewares/checkSubUser.js";

const route = Router();

// user auth routes
route.post("/registration", userAuthController.signup);
route.post("/login", validateSubUser, userAuthController.login);
route.post("/validate-otp", userAuthController.validateOtp);
route.patch("/resend-otp", userAuthController.resendOtp);

route.post("/sub-user-login", (req,res) => {
    console.log(req.path);
});

export default route;
