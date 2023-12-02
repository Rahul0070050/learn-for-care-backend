import { db } from "../../../conf/mysql.js";

export function getAssignedCourseById(id) {
  return new Promise((resolve, reject) => {
    try {
      //  from course
      let getCourseByIdQuery = `
        SELECT assigned_course.*, course_bundle.name AS name, course_bundle.courses AS courses
        FROM assigned_course 
        INNER JOIN course_bundle ON course_bundle.id = assigned_course.course_id
        WHERE assigned_course.id = ?;`;
      db.query(getCourseByIdQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAssignedCourseForManagerById(id) {
  return new Promise((resolve, reject) => {
    try {
      //  from course
      let getCourseByIdQuery = `
        SELECT * FROM course_assigned_manager WHERE id = ?;`;
      db.query(getCourseByIdQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAssignedCourseByIdFromCourse(id) {
  return new Promise((resolve, reject) => {
    try {
      //  from course
      let getCourseByIdQuery = `
        SELECT assigned_course.*, course.name AS name, assigned_course.validity AS validity
        FROM assigned_course 
        INNER JOIN course ON course.id = assigned_course.course_id
        WHERE assigned_course.id = ?;`;
      db.query(getCourseByIdQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAssignedCourseByUserId(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery = `
        SELECT assigned_course.*, course.name as course_name, 0 AS progress, 'red' AS color
        FROM assigned_course 
        INNER JOIN course ON course.id = assigned_course.course_id
        WHERE assigned_course.user_id = ? AND assigned_course.count >= 1 AND assigned_course.course_type = 'course';`;
      db.query(getCourseByIdQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getManagerAssignedCourseById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery = `SELECT * FROM course_assigned_manager WHERE id = ?;`;
      db.query(getCourseByIdQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAssignedCourseByIdFromManagerAssigned(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery = `
      SELECT * FROM course_assigned_manager WHERE id = ?;`;
      db.query(getCourseByIdQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllAssignedCourseByUserId(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery = `
      SELECT assigned_course.*, course.name AS name
      FROM assigned_course 
      INNER JOIN course ON course.id = assigned_course.course_id 
      WHERE assigned_course.user_id = ?;`;
      db.query(getCourseByIdQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
