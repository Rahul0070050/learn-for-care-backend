import { db } from "../../../conf/mysql.js";

export function getAllCertificatesByUserId(id) {
    return new Promise((resolve, reject) => {
      try {
        let getQuery = "SELECT * FROM certificate WHERE user_id = ?";
        db.query(getQuery, [id], (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result);
        });
      } catch (error) {
        reject(error?.message);
      }
    });
  }
