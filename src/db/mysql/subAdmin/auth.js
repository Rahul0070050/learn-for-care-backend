import { db } from "../../../conf/mysql.js";

export function getSubAdminByEmail(email) {
    return new Promise((resolve, reject) => {
      try {
        console.log(email);
        let getQuery = `SELECT * FROM sub_admin WHERE email = ?;`;
        db.query(getQuery, [email], (err, result) => {
          if (err) return reject(err.message);
          else return resolve(result);
        });
      } catch (error) {
        reject(error?.message);
      }
    });
  }