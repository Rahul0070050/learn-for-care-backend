"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthController = void 0;
const validateAuthReqData_1 = require("../../helpers/user/validateAuthReqData");
const sendOtpEmail_1 = __importDefault(require("../../helpers/sendOtpEmail"));
const users_1 = require("../../db/mysql/users");
const validatePasswords_1 = require("../../helpers/validatePasswords");
const jwt_1 = require("../../helpers/jwt");
const auth_1 = require("../../utils/auth");
exports.userAuthController = {
    signup: (req, res) => {
        try {
            (0, validateAuthReqData_1.validateUserInfo)(req.body)
                .then((result) => {
                (0, validatePasswords_1.hashPassword)(result.password)
                    .then((hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
                    let otp = yield Number((0, auth_1.generatorOtp)());
                    result.password = hashedPassword;
                    (0, users_1.insertUser)(result, otp)
                        .then(() => {
                        (0, sendOtpEmail_1.default)(result.email, otp)
                            .then((sentOtpRes) => {
                            res.status(200).json({
                                success: true,
                                data: {
                                    code: 200,
                                    message: "OTP sent check your email",
                                    response: sentOtpRes,
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
                }))
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
                res.status(406).json({
                    success: false,
                    errors: [
                        { code: 406, message: "values not acceptable", response: err },
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
    resendOtp: (req, res) => {
        try {
            (0, validateAuthReqData_1.checkReSendOtpInfo)(req.body)
                .then((result) => {
                (0, users_1.saveOtpToDB)(result === null || result === void 0 ? void 0 : result.email)
                    .then((result) => {
                    (0, sendOtpEmail_1.default)(result.email, result.otp)
                        .then(() => {
                        res.status(200).json({
                            success: true,
                            data: {
                                code: 200,
                                message: "OTP sent check your email",
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
                    res.status(406).json({
                        success: false,
                        errors: [
                            {
                                code: 406,
                                message: "value not acceptable",
                                error: err,
                            },
                        ],
                        errorType: "client",
                    });
                });
            })
                .catch((err) => {
                res.status(406).json({
                    success: false,
                    errors: [
                        {
                            code: 406,
                            message: "value not acceptable",
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
    validateOtp: (req, res) => {
        try {
            (0, validateAuthReqData_1.checkOtpInfo)(req.body)
                .then((result) => __awaiter(void 0, void 0, void 0, function* () {
                (0, users_1.getOtpFromDB)(result.email)
                    .then((otp) => {
                    var _a;
                    if (otp.length <= 0) {
                        return res.status(406).json({
                            success: false,
                            errors: [
                                {
                                    code: 406,
                                    message: "this user not exist",
                                    error: "this email is not exist in our database",
                                },
                            ],
                            errorType: "client",
                        });
                    }
                    otp = (_a = otp[0]) === null || _a === void 0 ? void 0 : _a.otp;
                    if (otp == result.otp) {
                        (0, users_1.activateUser)(result.email)
                            .then(() => {
                            res.status(202).json({
                                success: true,
                                data: { code: 202, message: "signup successful" },
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
                                    error: "you provided otp is not correct",
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
            }))
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
    login: (req, res) => {
        try {
            (0, validateAuthReqData_1.validateUserLoginData)(req.body)
                .then((loginInfo) => {
                (0, users_1.getUserByEmail)(loginInfo)
                    .then((userData) => {
                    if (userData.length <= 0) {
                        res.status(404).json({
                            success: false,
                            errors: [
                                {
                                    code: 404,
                                    message: "you provided an in valid email",
                                    error: "this email is not exist in our database",
                                },
                            ],
                            errorType: "client",
                        });
                    }
                    else {
                        userData = userData[0];
                        (0, validatePasswords_1.validatePassword)(loginInfo.password, userData.password)
                            .then((result) => {
                            if (result) {
                                (0, jwt_1.createTokenForUser)(userData).then((token) => {
                                    res.status(200).json({
                                        success: true,
                                        data: {
                                            code: 200,
                                            jwt_access_token: token.accessToken,
                                            jwt_refresh_token: token.reFreshToken,
                                            message: "login successful",
                                        },
                                    });
                                });
                            }
                            else {
                                res.status(406).json({
                                    success: false,
                                    errors: [
                                        {
                                            code: 406,
                                            message: "password is incorrect",
                                            error: "password is not matching",
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
                        error: error === null || error === void 0 ? void 0 : error.message,
                    },
                ],
                errorType: "server",
            });
        }
    },
};
