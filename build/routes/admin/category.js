"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../../controllers/admin/categoryController");
const adminAuth_1 = require("../../middlewares/adminAuth");
const route = (0, express_1.Router)();
route.post("/create-category", adminAuth_1.validateAdmin, categoryController_1.categoryController.createCategory);
route.patch("/update-category", adminAuth_1.validateAdmin, categoryController_1.categoryController.updateCategory);
exports.default = route;
