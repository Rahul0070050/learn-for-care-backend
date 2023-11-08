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
            INSERT INTO enrolled_course (user_id, course_id, progress, validity, color, user_type) VALUES (?,?,?,?,?,?); SELECT SCOPE_IDENTITY();
          `;

      let getId = "SELECT SCOPE_IDENTITY();";
      db.query(
        insertQuery,
        [userId, courseId, 30, validity, "orange", userType],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject(err?.message);
          } else {
            db.query(
              getId,
              (err,
              (result) => {
                if (err) reject(err);
                else resolve(result);
              })
            );
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}
