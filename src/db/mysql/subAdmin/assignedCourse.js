import { db } from "../../../conf/mysql.js";

export function getAllAssignedCourses(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT assigned_course.id AS assigned_course_id, assigned_course.*, course.*  
      FROM assigned_course
      INNER JOIN course ON assigned_course.course_id = course.id
      WHERE assigned_course.sub_user_id = ?;`;
      db.query(getQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
