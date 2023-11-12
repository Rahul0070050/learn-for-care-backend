import { db } from "../../../conf/mysql.js";

export function insertQuestionsToExam({
  course_id,
  question,
  options,
  answer,
}) {
  return new Promise((resolve, reject) => {
    try {
      let option = JSON.stringify(options);
      let insertQuestionsQuery =
        "INSERT INTO exams(course_id, question, options, answer) VALUES(?,?,?,?);";
      db.query(
        insertQuestionsQuery,
        [course_id, question, option, answer],
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getQuestionsForExamByCourseId(course_id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuestionsQuery = "SELECT * FROM exams WHERE course_id = ? LIMIT 10;";
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