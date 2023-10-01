"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthController = void 0;
const sendOtpEmail_1 = __importDefault(require("../../helpers/sendOtpEmail"));
const auth_1 = require("../../db/mysql/admin/auth");
const validatePasswords_1 = require("../../helpers/validatePasswords");
const jwt_1 = require("../../helpers/jwt");
const auth_2 = require("../../db/mysql/admin/auth");
const validateAuthReqData_1 = require("../../helpers/admin/validateAuthReqData");
exports.adminAuthController = {
    login: (req, res) => {
        try {
            (0, validateAuthReqData_1.validateAdminLoginReqBody)(req.body)
                .then((loginInfo) => {
                (0, auth_1.getAdminByEmail)(loginInfo === null || loginInfo === void 0 ? void 0 : loginInfo.email)
                    .then((adminData) => {
                    if ((adminData === null || adminData === void 0 ? void 0 : adminData.length) <= 0) {
                        res.status(404).json({
                            success: false,
                            errors: [
                                {
                                    code: 404,
                                    message: "this email is invalid please provide valid email",
                                    error: "email in incorrect",
                                },
                            ],
                            errorType: "client",
                        });
                    }
                    else {
                        adminData = adminData[0];
                        (0, validatePasswords_1.validatePassword)(loginInfo.password, adminData.password).then((result) => {
                            if (result) {
                                (0, jwt_1.createTokenForAdmin)(adminData)
                                    .then((token) => {
                                    res.status(200).json({
                                        success: true,
                                        data: {
                                            code: 200,
                                            jwt_access_token: token.accessToken,
                                            jwt_re_fresh_token: token.reFreshToken,
                                            message: "login successful",
                                        },
                                    });
                                })
                                    .catch((err) => {
                                    res.status(500).json({
                                        success: false,
                                        errors: [
                                            {
                                                code: 500,
                                                error: err,
                                                message: "some error occurred in the server try again after some times",
                                            },
                                        ],
                                        errorType: "server",
                                    });
                                });
                            }
                            else {
                                res.status(406).json({
                                    success: false,
                                    errors: [
                                        {
                                            code: 406,
                                            message: "the password is incorrect",
                                            error: "password not matching",
                                        },
                                    ],
                                    errorType: "client",
                                });
                            }
                        });
                    }
                })
                    .catch((err) => {
                    res.status(406).json({
                        success: false,
                        errors: [
                            {
                                code: 406,
                                message: "some error occurred in the server try again after some times",
                                error: err,
                            },
                        ],
                        errorType: "server",
                    });
                });
            })
                .catch((err) => {
                res.status(406).json({
                    success: false,
                    errors: [
                        {
                            code: 406,
                            message: "values not acceptable",
                            error: err,
                        },
                    ],
                    errorType: "client",
                });
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                errors: [
                    {
                        code: 500,
                        message: "some error occurred in the server try again after some times",
                        error: error === null || error === void 0 ? void 0 : error.message,
                    },
                ],
                errorType: "server",
            });
        }
    },
    resendOtp: (req, res) => {
        try {
            (0, auth_2.getAdminEmail)()
                .then((result) => {
                let email = result[0].email;
                (0, auth_1.saveOtpToDB)(email)
                    .then((result) => {
                    (0, sendOtpEmail_1.default)(email, result.otp)
                        .then(() => {
                        res.status(200).json({
                            success: true,
                            data: {
                                code: 200,
                                message: "OTP sent to the email",
                            },
                        });
                    })
                        .catch((err) => {
                        res.status(500).json({
                            success: false,
                            errors: [
                                {
                                    code: 500,
                                    message: "some error occurred please try again later",
                                    error: err,
                                },
                            ],
                            errorType: "server",
                        });
                    });
                })
                    .catch((err) => {
                    res.status(500).json({
                        success: false,
                        errors: [
                            {
                                code: 500,
                                message: "some error occurred please try again later",
                                error: err,
                            },
                        ],
                        errorType: "server",
                    });
                });
            })
                .catch((err) => {
                res.status(500).json({
                    success: false,
                    errors: [
                        {
                            code: 500,
                            message: "some error occurred please try again later",
                            error: err,
                        },
                    ],
                    errorType: "server",
                });
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                errors: [
                    {
                        code: 500,
                        message: "some error occurred in the server try again after some times",
                        error: error === null || error === void 0 ? void 0 : error.message,
                    },
                ],
                errorType: "server",
            });
        }
    },
    validateOtp: (req, res) => {
        try {
            (0, validateAuthReqData_1.checkValidateOtpReqBody)(req.body)
                .then((result) => {
                (0, auth_1.getOtpFromDB)(result === null || result === void 0 ? void 0 : result.email)
                    .then((otp) => {
                    var _a;
                    if (otp.length <= 0) {
                        return res.status(406).json({
                            success: false,
                            errors: [
                                {
                                    code: 406,
                                    message: "invalid email",
                                    error: "this email is not exist in our database",
                                },
                            ],
                            errorType: "client",
                        });
                    }
                    otp = (_a = otp[0]) === null || _a === void 0 ? void 0 : _a.otp;
                    if (otp == result.otp) {
                        (0, auth_1.activateAdmin)(result.email)
                            .then(() => {
                            res.status(202).json({
                                success: true,
                                data: {
                                    code: 202,
                                    message: "otp validation successful",
                                },
                            });
                        })
                            .catch((err) => {
                            res.status(500).json({
                                success: false,
                                errors: [
                                    {
                                        code: 500,
                                        message: "some error occurred in the server try again after some times",
                                        error: err,
                                    },
                                ],
                                errorType: "server",
                            });
                        });
                    }
                    else {
                        res.status(406).json({
                            success: false,
                            errors: [
                                {
                                    code: 406,
                                    message: "incorrect otp",
                                    error: "you provided otp is incorrect",
                                },
                            ],
                            errorType: "client",
                        });
                    }
                })
                    .catch((err) => {
                    res.status(500).json({
                        success: false,
                        errors: [
                            {
                                code: 500,
                                message: "some error occurred in the server try again after some times",
                                error: err,
                            },
                        ],
                        errorType: "server",
                    });
                });
            })
                .catch((err) => {
                res.status(406).json({
                    success: false,
                    errors: [
                        {
                            code: 406,
                            message: "values not acceptable",
                            error: err,
                        },
                    ],
                    errorType: "client",
                });
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                errors: [
                    {
                        code: 500,
                        message: "some error occurred in the server try again after some times",
                        response: error === null || error === void 0 ? void 0 : error.message,
                    },
                ],
                errorType: "server",
            });
        }
    },
};
