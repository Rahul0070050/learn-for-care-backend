"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUpdateCategoryReqBody = exports.checkCreateCategoryReqBody = void 0;
const yup_1 = require("yup");
function checkCreateCategoryReqBody(body) {
    return new Promise((resolve, reject) => {
        let bodyTemplate = (0, yup_1.object)({
            category: (0, yup_1.string)()
                .required("please enter category"),
        });
        try {
            bodyTemplate
                .validate(body)
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
exports.checkCreateCategoryReqBody = checkCreateCategoryReqBody;
function checkUpdateCategoryReqBody(body) {
    return new Promise((resolve, reject) => {
        let bodyTemplate = (0, yup_1.object)({
            category: (0, yup_1.string)()
                .required("please enter category"),
            id: (0, yup_1.number)().required("please enter category id"),
        });
        try {
            bodyTemplate
                .validate(body)
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
exports.checkUpdateCategoryReqBody = checkUpdateCategoryReqBody;
