"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.insertNewCategory = void 0;
const mysql_1 = require("../../../conf/mysql");
function insertNewCategory(category) {
    return new Promise((resolve, reject) => {
        try {
            let insertCategoryQuery = "INSERT INTO category(category) VALUES(?);";
            mysql_1.db.query(insertCategoryQuery, [category], (err, result) => {
                if (err)
                    return reject(err === null || err === void 0 ? void 0 : err.message);
                else
                    return resolve(result);
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.insertNewCategory = insertNewCategory;
function updateCategory(categoryInfo) {
    return new Promise((resolve, reject) => {
        try {
            let insertCategoryQuery = "UPDATE category SET category = ? WHERE id = ?;";
            mysql_1.db.query(insertCategoryQuery, [categoryInfo.category, categoryInfo.id], (err, result) => {
                if (err)
                    return reject(err === null || err === void 0 ? void 0 : err.message);
                else
                    return resolve(result);
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.updateCategory = updateCategory;
