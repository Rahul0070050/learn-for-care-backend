import { db } from "../../../conf/mysql.js";

export function getQuestionsForExamByCourseId(course_id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuestionsQuery = "SELECT * FROM exams LIMIT 10;";
      db.query(getQuestionsQuery, [course_id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
