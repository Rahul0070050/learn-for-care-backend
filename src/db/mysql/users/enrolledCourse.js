import { db } from "../../../conf/mysql.js";
import {
  getAssignedCourseById,
  getAssignedCourseByUserId,
} from "./assignedCourse.js";
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
      let getQuery = `
      SELECT enrolled_course.*, course.name AS course_name 
      FROM enrolled_course
      INNER JOIN course ON course.id = enrolled_course.course_id
      WHERE enrolled_course.user_id = ?;`;
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
          let data = await getMatrixDataByUserId(item.id);
          let assigned = await getAssignedCourseByUserId(item.id);
          item["matrix"] = data;
          item["matrix_assigned"] = assigned;
          return item;
        })
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}
