import { db } from "../../../conf/mysql.js";
import { getAllManagerIndividualFromDb } from "./users.js";

export function addCourseToEnrolledCourse(
  courseId,
  userId,
  validity,
  userType
) {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery = `
            INSERT INTO enrolled_course (user_id, course_id, progress, validity, color, user_type) VALUES (?,?,?,?,?,?);
          `;

      db.query(
        insertQuery,
        [userId, courseId, 30, validity, "orange", userType],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject(err?.message);
          } else {
            return resolve({ id: result.insertId });
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getMatrixDataByUserId(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let getQuery = "SELECT * FROM enrolled_course WHERE user_id = ?;";
      db.query(getQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getManagerMatrixData(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await getAllManagerIndividualFromDb(id);
      Promise.all(
        users.map(async (item) => {
          let data = await getManagerMatrixData(item.id);
          item["matrix"] = data;
          return item;
        })
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
      //   let getQuery = "SELECT * FROM enrolled_course;";
      //   db.query(getQuery, [id], (err, result) => {
      //     if (err) return reject(err?.message);
      //     else return resolve(result);
      //   });
    } catch (error) {
      reject(error?.message);
    }
  });
}
