"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../controllers/user/authController");
const route = (0, express_1.Router)();
// user auth routes
route.post("/registration", authController_1.userAuthController.signup);
route.post("/login", authController_1.userAuthController.login);
route.post("/validate-otp", authController_1.userAuthController.validateOtp);
route.patch("/resend-otp", authController_1.userAuthController.resendOtp);
exports.default = route;
