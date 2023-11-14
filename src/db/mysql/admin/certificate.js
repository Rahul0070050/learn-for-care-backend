import { db } from "../../../conf/mysql.js";

export function insertNewCertificate(info) {
  return new Promise((resolve, reject) => {
    try {
      let { user_id, course_name, user_name, percentage } =
        info;
      let insertQuery =
        "INSERT INTO certificate (user_id, course_name, user_name, percentage) VALUES (?, ?, ?, ?);";
      db.query(
        insertQuery,
        [user_id, course_name, user_name, percentage],
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve();
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getCertificateByIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT * FROM certificate WHERE id = ?";
      db.query(getQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllCertificateFromDb() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT * FROM certificate";
      db.query(getQuery, (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
