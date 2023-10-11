import { db } from "../../../conf/mysql.js";

export function insertNewCategory(category) {
  return new Promise((resolve, reject) => {
    try {
      let insertCategoryQuery = "INSERT INTO category(category) VALUES(?);";
      db.query(insertCategoryQuery, [category], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function updateCategory(categoryInfo) {
  return new Promise((resolve, reject) => {
    try {
      let insertCategoryQuery =
        "UPDATE category SET category = ? WHERE id = ?;";
      db.query(insertCategoryQuery, [categoryInfo.category,categoryInfo.id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
