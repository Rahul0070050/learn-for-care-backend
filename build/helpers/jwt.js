"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserJwtToken = exports.validateAdminJwtToken = exports.createTokenForAdmin = exports.createTokenForUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const createTokenForUser = (userData) => {
    return new Promise((resolve, reject) => {
        try {
            userData.password = "";
            jsonwebtoken_1.default.sign(Object.assign({}, userData), process.env.JWT_RF_KEY_FOR_USER || "", { expiresIn: "365d" }, (err, reFreshToken) => {
                if (err)
                    return reject(err === null || err === void 0 ? void 0 : err.message);
                jsonwebtoken_1.default.sign(Object.assign({}, userData), process.env.JWT_ACC_KEY_FOR_USER || "", { expiresIn: "15d" }, (err, accessToken) => {
                    if (err)
                        return reject(err === null || err === void 0 ? void 0 : err.message);
                    else
                        return resolve({ reFreshToken, accessToken });
                });
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
};
exports.createTokenForUser = createTokenForUser;
const createTokenForAdmin = (userData) => {
    return new Promise((resolve, reject) => {
        try {
            userData.password = "";
            jsonwebtoken_1.default.sign(Object.assign({}, userData), process.env.JWT_RF_KEY_FOR_ADMIN || "", { expiresIn: "365d" }, (err, reFreshToken) => {
                if (err)
                    return reject(err === null || err === void 0 ? void 0 : err.message);
                jsonwebtoken_1.default.sign(Object.assign({}, userData), process.env.JWT_ACC_KEY_FOR_ADMIN || "", { expiresIn: "15d" }, (err, accessToken) => {
                    if (err)
                        return reject(err === null || err === void 0 ? void 0 : err.message);
                    else
                        return resolve({ reFreshToken, accessToken });
                });
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
};
exports.createTokenForAdmin = createTokenForAdmin;
function validateAdminJwtToken(token) {
    return new Promise((resolve, reject) => {
        try {
            jsonwebtoken_1.default.verify(token, process.env.JWT_ACC_KEY_FOR_ADMIN || "", (err, result) => {
                if (err)
                    return reject(err === null || err === void 0 ? void 0 : err.message);
                else
                    return resolve({});
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.validateAdminJwtToken = validateAdminJwtToken;
function validateUserJwtToken(token) {
    return new Promise((resolve, reject) => {
        try {
            jsonwebtoken_1.default.verify(token, process.env.JWT_ACC_KEY_FOR_USER || "", (err, result) => {
                if (err)
                    return reject(err === null || err === void 0 ? void 0 : err.message);
                else
                    return resolve({});
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.validateUserJwtToken = validateUserJwtToken;
