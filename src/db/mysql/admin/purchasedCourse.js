import { db } from "../../../conf/mysql.js";

export function getAllPurchasedCourseByUserId(id) {
    return new Promise((resolve, reject) => {
      try {
        let getPurchasedCourseDataQuery = `
          SELECT purchased_course.id, Name, description, course_count, course_id, category, validity 
          FROM purchased_course INNER JOIN course ON 
          purchased_course.course_id = course.id
          WHERE purchased_course.user_id = ?;
        `;
  
        db.query(getPurchasedCourseDataQuery, [id], (err, result) => {
          if (err) {
            return reject(err?.message);
          } else {
            return resolve(result);
          }
        });
      } catch (error) {
        reject(error?.message);
      }
    });
  }