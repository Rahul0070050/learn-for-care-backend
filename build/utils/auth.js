"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorOtp = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
function generatorOtp() {
    return otp_generator_1.default.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
    });
}
exports.generatorOtp = generatorOtp;
