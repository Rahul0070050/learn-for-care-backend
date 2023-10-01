"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function mailer() {
    return nodemailer_1.default.createTransport({
        service: "Outlook",
        secure: false,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
}
exports.mailer = mailer;
