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
exports.deleteInactivateUser = exports.getOtpFromDB = exports.saveOtpToDB = exports.activateUser = exports.getUserByEmail = exports.insertUser = void 0;
const mysql_1 = require("../../conf/mysql");
const auth_1 = require("../../utils/auth");
const insertUser = (user, otp) => {
    return new Promise((resolve, reject) => {
        try {
            let insertQuery = `INSERT INTO users (username, email, type_of_account, password, country, city, otp) VALUES (?,?,?,?,?,?,?);`;
            mysql_1.db.query(insertQuery, [
                user === null || user === void 0 ? void 0 : user.name,
                user === null || user === void 0 ? void 0 : user.email,
                user === null || user === void 0 ? void 0 : user.type_of_account,
                user === null || user === void 0 ? void 0 : user.password,
                user === null || user === void 0 ? void 0 : user.country,
                user === null || user === void 0 ? void 0 : user.city,
                otp,
            ], (err, result) => {
                if (err) {
                    if ((err === null || err === void 0 ? void 0 : err.message) === `ER_DUP_ENTRY: Duplicate entry '${user.email}' for key 'users.email'`) {
                        return reject("email already exist");
                    }
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
};
exports.insertUser = insertUser;
function getUserByEmail(info) {
    return new Promise((resolve, reject) => {
        try {
            let getQuery = `SELECT * FROM users WHERE email = ?;`;
            mysql_1.db.query(getQuery, [info.email], (err, result) => {
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
exports.getUserByEmail = getUserByEmail;
function activateUser(email) {
    return new Promise((resolve, reject) => {
        try {
            let updateQuery = `UPDATE users SET activate = ?, otp = ? WHERE email = ?;`;
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
exports.activateUser = activateUser;
function saveOtpToDB(email) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let otp = yield Number((0, auth_1.generatorOtp)());
            let setOtpQuery = `UPDATE users SET otp = ? WHERE email = ?;`;
            mysql_1.db.query(setOtpQuery, [otp, email], (err, result) => {
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
            let getQuery = `SELECT otp FROM users WHERE email = ? limit 1;`;
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
function deleteInactivateUser(email) {
    return new Promise((resolve, reject) => {
        try {
            const userDeleteQuery = `DELETE FROM users WHERE email=?;`;
            mysql_1.db.query(userDeleteQuery, [email], (err, result) => {
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
exports.deleteInactivateUser = deleteInactivateUser;
