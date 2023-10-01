"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReSendOtpInfo = exports.validateUserLoginData = exports.checkOtpInfo = exports.validateUserInfo = void 0;
const yup_1 = require("yup");
function validateUserInfo(userInfo) {
    return new Promise((resolve, reject) => {
        let user = (0, yup_1.object)({
            email: (0, yup_1.string)().required("please provide email address").email(),
            name: (0, yup_1.string)().required("please provide username"),
            password: (0, yup_1.string)().required("please provide password"),
            country: (0, yup_1.string)().required("please provide country"),
            type_of_account: (0, yup_1.string)().required("please provide type"),
            city: (0, yup_1.string)().required("please provide city"),
        });
        try {
            user
                .validate(userInfo)
                .then((res) => {
                resolve(res);
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
exports.validateUserInfo = validateUserInfo;
function checkOtpInfo(otpReqInfo) {
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
exports.checkOtpInfo = checkOtpInfo;
function validateUserLoginData(info) {
    return new Promise((resolve, reject) => {
        let checkInfo = (0, yup_1.object)({
            email: (0, yup_1.string)().required("please provide email address").email(),
            password: (0, yup_1.string)().required("please provide password"),
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
exports.validateUserLoginData = validateUserLoginData;
function checkReSendOtpInfo(info) {
    return new Promise((resolve, reject) => {
        let checkInfo = (0, yup_1.object)({
            email: (0, yup_1.string)().email().required("please provide email address")
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
        catch (error) { }
    });
}
exports.checkReSendOtpInfo = checkReSendOtpInfo;
