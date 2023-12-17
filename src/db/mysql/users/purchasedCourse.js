import { db } from "../../../conf/mysql.js";

export function saveToPurchasedCourse(course) {
  return new Promise((resolve, reject) => {
    try {
      let insertPurchasedCourseQuery =
        "INSERT INTO purchased_course(user_id, course_id, amount, course_count, fake_course_count, validity, course_type, transition_id) VALUES (?,?,?,?,?,?,?,?);";
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
          course.transitionId
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

export function getAssignedCourseToCompanyById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery = `SELECT * FROM assigned_course WHERE id = ?;`;
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
          SELECT purchased_course.*,
          DATE_FORMAT(purchased_course.date, '%d/%m/%Y') AS date,
          DATE_FORMAT(purchased_course.validity, '%d/%m/%Y') AS validity
          purchased_course.fake_course_count AS fake_count,
          purchased_course.course_id AS bundle_id,
          purchased_course.id AS id,
          course_bundle.name AS bundle_name, 
          course_bundle.description AS description, 1 AS from_purchased
          FROM purchased_course
          INNER JOIN course_bundle ON purchased_course.course_id = course_bundle.id
          WHERE purchased_course.course_type = ? AND purchased_course.user_id = ?;
        `
      db.query(getQuery,['bundle',id],(err,result) => {
        if(err){
          reject(err.message);
        } else {
          console.log(result);
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
      assigned_course.course_id AS bundle_id, assigned_course.id AS id, 0 AS from_purchased, assigned_course.count AS course_count
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

export function getAssignedBundlesFromDbByCompanyId(userId) {
  return new Promise((resolve, reject) => { 
    try {
      // when we purchase bundle, the course id in the purchased course table turned to be the bundle id
      let getQuery = `
      SELECT course_bundle.name AS bundle_name, assigned_course.validity AS validity, course_bundle.description AS description,
      assigned_course.course_id AS course_id, assigned_course.fake_count AS fake_count, assigned_course.owner AS owner, assigned_course.id AS id, 0 AS from_purchased, assigned_course.count AS course_count,
      DATE_FORMAT(assigned_course.validity, '%d/%m/%Y') AS validity
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
      console.log(error);
      reject(error?.message)
    }
   })
}