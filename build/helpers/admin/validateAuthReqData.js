"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidateOtpReqBody = exports.validateAdminLoginReqBody = void 0;
const yup_1 = require("yup");
function validateAdminLoginReqBody(info) {
    return new Promise((resolve, reject) => {
        let checkInfo = (0, yup_1.object)({
            email: (0, yup_1.string)().required("please enter email address").email(),
            password: (0, yup_1.string)().required("please enter password"),
        });
        try {
            checkInfo
                .validate(info)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err === null || err === void 0 ? void 0 : err.message);
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.validateAdminLoginReqBody = validateAdminLoginReqBody;
function checkValidateOtpReqBody(otpReqInfo) {
    return new Promise((resolve, reject) => {
        let otpInfo = (0, yup_1.object)({
            otp: (0, yup_1.number)().required("please provide otp"),
            email: (0, yup_1.string)().required("please provide email address").email(),
        });
        try {
            otpInfo
                .validate(otpReqInfo)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err === null || err === void 0 ? void 0 : err.message);
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.checkValidateOtpReqBody = checkValidateOtpReqBody;
