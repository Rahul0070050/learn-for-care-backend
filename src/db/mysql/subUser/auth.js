import { db } from "../../../conf/mysql.js";

export function getSubUserByEmail(email) {
    return new Promise((resolve, reject) => {
      try {
        let getQuery = `SELECT * FROM sub_user WHERE email = ?;`;
        db.query(getQuery, [email], (err, result) => {
          if (err) return reject(err.message);
          else return resolve(result);
        });
      } catch (error) {
        reject(error?.message);
      }
    });
  }