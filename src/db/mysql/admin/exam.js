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

export function getQuestionsForExamByCourseId(course_id, userId) {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery =
        "INSERT INTO exam_attempts (course_id, user_id) VALUES (?,?)";
      db.query(insertQuery, [course_id, userId], (err, result) => {});

      let getQuestionsQuery = "SELECT * FROM exams WHERE course_id = ?;";
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
      let getAllQuestionsQuery = `
      SELECT course.name AS course_name, course.id AS course_id, course.description AS course_description, exams.id AS exam_id, course.category AS course_category, exams.* FROM exams 
      INNER JOIN course ON course.id = exams.course_id
      ;`;
      db.query(getAllQuestionsQuery, (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function deleteFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let deleteQuery = "DELETE FROM exams WHERE id = ?;";
      db.query(deleteQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getQuestionsById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuestionsQuery = "SELECT * FROM exams WHERE id = ?;";
      db.query(getQuestionsQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function saveExamResult(per, questionId, UserId) {
  return new Promise((resolve, reject) => {
    try {
      let status = data.per >= 100 ? "pass" : "fail";
      let getQuestionsQuery =
        "UPDATE exam_attempts SET attempts = 1 - attempts, percentage = ?,status = ? WHERE course_id = ? AND user_id = ?;";
      db.query(
        getQuestionsQuery,
        [per, status, questionId, UserId],
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
