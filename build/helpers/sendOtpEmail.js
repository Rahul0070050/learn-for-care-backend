"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const nodeMailer_1 = require("../conf/nodeMailer");
const otpVerification_1 = require("../emailTemplates/otpVerification");
(0, dotenv_1.config)();
function sentOtpEmail(email, otp) {
    return new Promise((resolve, reject) => {
        try {
            const mailData = {
                from: process.env.EMAIL_ID,
                to: email,
                subject: "Learn For Care",
                text: "here is your otp",
                html: (0, otpVerification_1.otpEMail)(email, otp),
            };
            (0, nodeMailer_1.mailer)().sendMail(mailData, function (err, info) {
                if (err) {
                    reject(err.message);
                }
                else {
                    resolve({ accepted: info.accepted[0] });
                }
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.default = sentOtpEmail;
