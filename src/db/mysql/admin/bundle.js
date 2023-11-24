import { db } from "../../../conf/mysql.js";

export function assignBundleToUser(data) {
  return new Promise((resolve, reject) => {
    try {
      const { user_id, bundle_id, adminId, type, count } = data;

      let validity = new Date();
      validity.setFullYear(validity.getFullYear() + 1);

      let insertQuery = `INSERT INTO assigned_course (owner, course_id, course_type, user_id, validity,count) VALUES (?,?,?,?,?,?);`;
      db.query(
        insertQuery,
        [adminId, bundle_id, type, user_id, new Date(validity),count],
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}
