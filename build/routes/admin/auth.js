"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../controllers/admin/authController");
const route = (0, express_1.Router)();
// admin auth routes
route.post("/login", authController_1.adminAuthController.login);
route.post("/validate-otp", authController_1.adminAuthController.validateOtp);
route.patch("/resend-otp", authController_1.adminAuthController.resendOtp);
exports.default = route;
