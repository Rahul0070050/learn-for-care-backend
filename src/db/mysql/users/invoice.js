import { db } from "../../../conf/mysql.js";

export function saveInvoiceToDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const { userId, image } = data;
      let insertQuery = "INSERT INTO invoice (user_id, img) VALUES (?,?);";
      db.query(insertQuery, [userId, image], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
