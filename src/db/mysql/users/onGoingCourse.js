import { db } from "../../../conf/mysql.js";

export function getOnGoingCourseByIdFromDb(id, userId) {
  return new Promise((resolve, reject) => {
    try {
      let getOnGoingCourseByIdQuery = `
        SELECT enrolled_course.*, course.*, enrolled_course.id AS id FROM enrolled_course 
        INNER JOIN course ON course.id = enrolled_course.course_id
        WHERE enrolled_course.id = ? AND enrolled_course.user_id = ?;
      `;
      db.query(getOnGoingCourseByIdQuery, [id, userId], (err, result) => {
        console.log(err);
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllOnGoingCourseByUserIdFromDb(id, type) {
  return new Promise((resolve, reject) => {
    try {
      let getOnGoingCourseByIdQuery = `
          SELECT enrolled_course.id AS on_going_course_id, enrolled_course.*, 
          course.name AS name, course.category AS category, 
          enrolled_course.validity AS validity,
          course.description AS description
          FROM enrolled_course 
          INNER JOIN course ON course.id = enrolled_course.course_id
          WHERE enrolled_course.user_id = ? AND enrolled_course.user_type = ?;
        `;
      db.query(getOnGoingCourseByIdQuery, [id, type], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllFinishedCourseByUserIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getOnGoingCourseByIdQuery =
        "SELECT * FROM enrolled_course WHERE user_id = ?;";
      db.query(getOnGoingCourseByIdQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
