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
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeEmail = exports.activateAdmin = exports.getOtpFromDB = exports.saveOtpToDB = exports.getAdminEmail = exports.getAdminByEmail = void 0;
const mysql_1 = require("../../../conf/mysql");
const auth_1 = require("../../../utils/auth");
function getAdminByEmail(email) {
    return new Promise((resolve, reject) => {
        try {
            let getQuery = `SELECT * FROM admin WHERE email = ?;`;
            mysql_1.db.query(getQuery, [email], (err, result) => {
                if (err)
                    return reject(err.message);
                else
                    return resolve(result);
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.getAdminByEmail = getAdminByEmail;
function getAdminEmail() {
    return new Promise((resolve, reject) => {
        try {
            let getQuery = `SELECT email FROM admin;`;
            mysql_1.db.query(getQuery, (err, result) => {
                if (err)
                    return reject(err.message);
                else
                    return resolve(result);
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.getAdminEmail = getAdminEmail;
function saveOtpToDB(email) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let otp = yield Number((0, auth_1.generatorOtp)());
            let setOtpQuery = `UPDATE admin SET otp = ?, activate = ? WHERE email = ?;`;
            mysql_1.db.query(setOtpQuery, [otp, false, email], (err, result) => {
                if (err)
                    return reject(err.message);
                else
                    return resolve({ otp, email });
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    }));
}
exports.saveOtpToDB = saveOtpToDB;
function getOtpFromDB(email) {
    return new Promise((resolve, reject) => {
        try {
            let getQuery = `SELECT otp FROM admin WHERE email = ?;`;
            mysql_1.db.query(getQuery, [email], (err, result) => {
                if (err) {
                    reject(err.message);
                }
                else {
                    resolve(result);
                }
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.getOtpFromDB = getOtpFromDB;
function activateAdmin(email) {
    return new Promise((resolve, reject) => {
        try {
            let updateQuery = `UPDATE admin SET activate = ?, otp = ? WHERE email = ?;`;
            mysql_1.db.query(updateQuery, [true, null, email], (err, result) => {
                if (err) {
                    reject(err === null || err === void 0 ? void 0 : err.message);
                }
                else {
                    resolve(result);
                }
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.activateAdmin = activateAdmin;
const changeEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            let insertQuery = `INSERT INTO admin (email) VALUES (?);`;
            mysql_1.db.query(insertQuery, [email], (err, result) => {
                if (err) {
                    return reject(err === null || err === void 0 ? void 0 : err.message);
                }
                else {
                    resolve(result);
                }
            });
        }
        catch (error) {
            console.log(error);
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
};
exports.changeEmail = changeEmail;
