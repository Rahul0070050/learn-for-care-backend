import { db } from "../../../conf/mysql.js";

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
