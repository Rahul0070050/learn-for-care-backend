import { db } from "../../../conf/mysql.js";

export function getSubUserById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT * FROM sub_user WHERE id = ?;`;
      db.query(getQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
