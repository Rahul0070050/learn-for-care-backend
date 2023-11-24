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

export function getAssignedCourseToManagerById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery = `SELECT * FROM course_assigned_manager WHERE id = ?;`;
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

export function getPurchasedCourseBundlesFromDbByUserId(id) {
  return new Promise((resolve, reject) => { 
    try {
      // when we purchase bundle, the course id in the purchased course table turned to be the bundle id
      let getQuery = `
          SELECT purchased_course.* , purchased_course.course_id AS bundle_id, course_bundle.name AS bundle_name, 
          course_bundle.description AS description
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

export function getAssignedBundlesFromDbByUserId(userId) {
  return new Promise((resolve, reject) => { 
    try {
      // when we purchase bundle, the course id in the purchased course table turned to be the bundle id
      let getQuery = `
      SELECT course_bundle.name AS name, assigned_course.validity AS validity, course_bundle.description AS description,
      assigned_course.course_id AS course_id, assigned_course.id AS id
      FROM assigned_course 
      INNER JOIN course_bundle ON course_bundle.id = assigned_course.course_id 
      WHERE course_type = ? AND user_id = ?`
      db.query(getQuery,['bundle',userId],(err,result) => {
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