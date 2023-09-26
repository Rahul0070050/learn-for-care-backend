import { db } from "../../../conf/mysql";
import { updateCategoryBody } from "../../../type/category";

export function insertNewCategory(category: string) {
  return new Promise((resolve, reject) => {
    try {
      let insertCategoryQuery = "INSERT INTO category(category) VALUES(?);";
      db.query(insertCategoryQuery, [category], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function updateCategory(categoryInfo: updateCategoryBody) {
  return new Promise((resolve, reject) => {
    try {
      let insertCategoryQuery =
        "UPDATE category SET category = ? WHERE id = ?;";
      db.query(insertCategoryQuery, [categoryInfo.category,categoryInfo.id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}
