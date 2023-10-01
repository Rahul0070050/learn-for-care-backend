"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const courseController_1 = require("../../controllers/admin/courseController");
const adminAuth_1 = require("../../middlewares/adminAuth");
const route = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination(req, file, callback) {
        callback(null, "./uploads/");
    },
    filename(req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)();
let multerOption = upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "intro_video", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "ppt", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
]);
route.post("/create-course", adminAuth_1.validateAdmin, multerOption, courseController_1.courseController.createCourse);
route.get("/get-single-course/:id", adminAuth_1.validateAdmin, courseController_1.courseController.getCourseById);
exports.default = route;
