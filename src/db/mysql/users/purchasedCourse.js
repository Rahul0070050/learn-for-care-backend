import { db } from "../../../conf/mysql.js";

export function saveToPurchasedCourse(course) {
  return new Promise((resolve, reject) => {
    try {
      let insertPurchasedCourseQuery =
        "INSERT INTO purchased_course(user_id, course_id, amount, course_count, fake_course_count, validity) VALUES (?,?,?,?,?,?);";
      let date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      let year = date.toLocaleDateString();
      db.query(
        insertPurchasedCourseQuery,
        [
          course.user_id,
          course.course_id,
          course.amount,
          course.course_count,
          course.course_count,
          year,
        ],
        (err, result) => {
          if (err) {
            return reject(err?.message);
          } else {
            return resolve(result);
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getPurchasedCourseById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery = `SELECT * FROM purchased_course WHERE id = ?;`;
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
