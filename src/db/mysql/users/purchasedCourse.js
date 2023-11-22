import { db } from "../../../conf/mysql.js";

export function saveToPurchasedCourse(course) {
  return new Promise((resolve, reject) => {
    try {
      let insertPurchasedCourseQuery =
        "INSERT INTO purchased_course(user_id, course_id, amount, course_count, fake_course_count, validity, course_type) VALUES (?,?,?,?,?,?,?);";
      let date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      // TODO: year: 1/5/2023 to 01/05/2023 // add '0' to frond of everyone
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
          course.type,
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

export function getPurchasedCourseFromDbByUserId(id) {
  return new Promise((resolve, reject) => { 
    try {
      let getQuery = `
          SELECT purchased_course.* , course.name AS course_name 
          FROM purchased_course
          INNER JOIN course_bundle ON purchased_course.course_id = course_bundle.id
          WHERE purchased_course.course_type = ? AND purchased_course.user_id = ?;
        `
      db.query(getQuery,['bundle',id],(err,result) => {
        if(err){
          reject(err.message);
        } else {
          resolve(result);
        }
      })
    } catch (error) {
      reject(error?.message)
    }
   })
}