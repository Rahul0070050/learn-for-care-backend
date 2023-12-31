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

export function getQuestionsForExamByCourseId(course_id, userId, id) {
  return new Promise((resolve, reject) => {
    try {
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

// export function enrolled_bundle_id(course_id) {
//   return new Promise((resolve, reject) => {
//     try {
//       let insertQuery =
//         "SELECT attempts FROM exam_attempts WHERE enrolled_bundle_id = ?;"
//       db.query(insertQuery, [course_id], (err, result) => {
//         if (err) throw err;
//       });

//       let getQuestionsQuery = "SELECT * FROM exams WHERE course_id = ?;";
//       db.query(getQuestionsQuery, [course_id], (err, result) => {
//         if (err) return reject(err?.message);
//         else return resolve(result);
//       });
//     } catch (error) {
//       reject(error?.message);
//     }
//   });
// }

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

export function saveExamResult(
  per,
  course_id,
  questionId,
  userId,
  enrolledCourseId
) {
  return new Promise((resolve, reject) => {
    try {
      per = Number(per);
      let status = per >= 80 ? "pass" : "fail";
      let color = "red";
      if (per >= 100) {
        color = "green";
      } else if (per >= 50) {
        color = "yellow";
      } else {
        color = "red";
      }

      let updateQuery =
        "UPDATE enrolled_course SET progress = ? ,color = ? WHERE id = ?;";
      db.query(updateQuery, [per, color, enrolledCourseId], (err, result) => {
        if (err) return reject(err?.message);
        // else return resolve(result);
      });

      let insertQuery = `INSERT INTO exam_attempts (course_id, user_id, percentage, enrolled_course_id, status) VALUES (?,?,?,?,?)`;

      db.query(
        insertQuery,
        [course_id, userId, per, enrolledCourseId, status],
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result.insertId);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function saveBundleExamResult(per, course_id, userId, enrolledCourseId) {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery =
        "INSERT INTO bundle_exam_attempts (enrolled_bundle_id,course_id,user_id,percentage,status) VALUES (?,?,?,?,?)";
      db.query(
        insertQuery,
        [enrolledCourseId, course_id, userId, per, per >= 80 ? "pass" : "fail"],
        (err, result) => {
          if (err) reject(err.message);
          else resolve(result.insertId);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}
