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

export function getCountOfAssignedBundleByOwnerId(id) {
    return new Promise((resolve, reject) => {
        try {
          let insertQuery = "SELECT fake_count FROM course_assigned_manager WHERE manager_id = ?;"
          db.query(
            insertQuery,
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

export function getCountOfBundleByOwnerId(id) {
    return new Promise((resolve, reject) => {
        try {
          let insertQuery = "SELECT fake_course_count FROM purchased_course WHERE user_id = ?;"
          db.query(
            insertQuery,
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
