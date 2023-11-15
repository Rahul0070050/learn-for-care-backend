import { db } from "../../../conf/mysql.js";

export function insertQuestionsToExam(info) {
  return new Promise((resolve, reject) => {
    try {
      console.log(info);
      console.log(info.questions);
      let exam = JSON.stringify(info.questions);
      let insertQuestionsQuery =
        "INSERT INTO exams (course_id, exam) VALUES(?,?);";
      db.query(insertQuestionsQuery, [info.course_id, exam], (err, result) => {
        if (err) {
          if (
            err.message ===
            `ER_DUP_ENTRY: Duplicate entry '${info.course_id}' for key 'exams.course_id'`
          ) {
            return reject("already the course has exam assigned to it");
          } else {
            return reject(err?.message);
          }
        } else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getQuestionsForExamByCourseId(course_id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuestionsQuery =
        "SELECT * FROM exams WHERE course_id = ? LIMIT 10;";
      db.query(getQuestionsQuery, [course_id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllExam() {
  return new Promise((resolve, reject) => {
    try {
      let getAllQuestionsQuery = "SELECT * FROM exams;";
      db.query(getAllQuestionsQuery, [course_id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
