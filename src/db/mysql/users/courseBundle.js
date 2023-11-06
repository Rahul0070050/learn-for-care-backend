import { db } from "../../../conf/mysql.js";

export function getCourseBundleById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getOneBundleQuery = "SELECT * FROM course_bundle WHERE id = ?;";

      db.query(getOneBundleQuery, [id], (err, bundle) => {
        if (err) reject(err?.message);
        else resolve(bundle);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllBBundle() {
  return new Promise((resolve, reject) => {
    try {
      let getAllBundleQuery = "SELECT * FROM course_bundle;";

      db.query(getAllBundleQuery, (err, bundle) => {
        if (err) reject(err?.message);
        else resolve(bundle);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
