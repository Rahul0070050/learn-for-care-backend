import { db } from "../../../conf/mysql.js";

export function getAssignedCourseById(id) {
    return new Promise((resolve, reject) => {
      try {
        let getCourseByIdQuery = `
        SELECT assigned_course.*, course_bundle.name AS name, course_bundle.courses AS courses
        FROM assigned_course 
        INNER JOIN course_bundle ON course_bundle.id = assigned_course.course_id
        WHERE assigned_course.id = ?;`;
        db.query(
          getCourseByIdQuery,
          [id],
          (err, result) => {
            if (err) return reject(err.message);
            else return resolve(result);
          }
        );
      } catch (error) {
        reject(error?.message);
      }
    });
  }

  export function getAssignedCourseByUserId(id) {
    return new Promise((resolve, reject) => {
      try {
        let getCourseByIdQuery = `
        SELECT assigned_course.*, course.name as course_name, 0 AS progress, 'red' AS color
        FROM assigned_course 
        INNER JOIN course ON course.id = assigned_course.course_id
        WHERE user_id = ? AND count >= 1 AND course_type = 'course';`;
        db.query(
          getCourseByIdQuery,
          [id],
          (err, result) => {
            if (err) return reject(err.message);
            else return resolve(result);
          }
        );
      } catch (error) {
        reject(error?.message);
      }
    });
  }

  export function getManagerAssignedCourseById(id) {
    return new Promise((resolve, reject) => {
      try {
        let getCourseByIdQuery = `SELECT * FROM course_assigned_manager WHERE id = ?;`;
        db.query(
          getCourseByIdQuery,
          [id],
          (err, result) => {
            if (err) return reject(err.message);
            else return resolve(result);
          }
        );
      } catch (error) {
        reject(error?.message);
      }
    });
  }