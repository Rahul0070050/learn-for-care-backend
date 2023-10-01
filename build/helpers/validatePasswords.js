"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            bcrypt_1.default.hash(password, 10, function (err, hash) {
                if (err)
                    return reject(err.message);
                else
                    return resolve(hash);
            });
        }
        catch (error) {
            reject(error.message);
        }
    });
};
exports.hashPassword = hashPassword;
const validatePassword = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {
        try {
            bcrypt_1.default.compare(password, hashedPassword, (err, result) => {
                if (err)
                    return reject(err.message);
                else
                    return resolve(result);
            });
        }
        catch (error) {
            reject(error.message);
        }
    });
};
exports.validatePassword = validatePassword;
