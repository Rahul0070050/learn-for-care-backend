import { db } from "../../../conf/mysql.js";
import {
  getAssignedCourseById,
  getAssignedCourseByIdFromCourse,
  getAssignedCourseByIdFromManagerAssigned,
} from "./assignedCourse.js";

export function getCourseByIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery =
        "SELECT id, name, description, category, price, intro_video, thumbnail FROM course WHERE id = ?;";
      db.query(getCourseByIdQuery, [id], (err, result) => {
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

export function getCourseByCategory(category) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByCategoryQuery = "SELECT * FROM course WHERE category = ?;";
      db.query(getCourseByCategoryQuery, [category], (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllCoursesFromDb() {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByCategoryQuery = "SELECT * FROM course;";
      db.query(getCourseByCategoryQuery, (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      return reject(err?.message);
    }
  });
}

export function getPurchasedCourseByUserId(id) {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseDataQuery = `
        SELECT purchased_course.id AS purchased_course_id, purchased_course.id AS id,
        1 AS from_purchased, Name, description, course_count,
        course_id, category, validity
        FROM purchased_course 
        INNER JOIN course ON purchased_course.course_id = course.id
        WHERE purchased_course.user_id = ? AND purchased_course.course_count >= ?;
      `;

      db.query(getPurchasedCourseDataQuery, [id, 1], (err, result) => {
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

export function getAllPurchasedCourseByUserId(id) {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseDataQuery = `
        SELECT purchased_course.id AS purchased_course_id,
        status, Name, description, course_count,
        course_id, category, validity 
        FROM purchased_course 
        INNER JOIN course ON purchased_course.course_id = course.id
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

export function getAllAssignedCourseFromDb(id, type) {
  return new Promise((resolve, reject) => {
    console.log(id);
    try {
      let getAssignedCourseByIdDataQuery = `
      SELECT assigned_course.*, 0 AS from_purchased, course.id AS course_id,
      course.name, course.description, assigned_course.count AS course_count,
      course.category, assigned_course.validity
      FROM assigned_course 
      INNER JOIN course ON assigned_course.course_id = course.id
      WHERE assigned_course.user_id = ? AND assigned_course.course_type = ?;
      `;

      db.query(
        getAssignedCourseByIdDataQuery,
        [id, "course"],
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
      let getPurchasedCourseByIdDataQuery = `
        SELECT purchased_course.*, course_bundle.name AS name, course_bundle.courses AS courses
        FROM purchased_course 
        INNER JOIN course_bundle ON course_bundle.id = purchased_course.course_id
        WHERE purchased_course.id = ?;
      `;

      db.query(getPurchasedCourseByIdDataQuery, [id], (err, result) => {
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

export function getPurchasedCourseByIdFromCourse(id) {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseByIdDataQuery = `
        SELECT purchased_course.*, course.name AS name, purchased_course.validity AS validity
        FROM purchased_course 
        INNER JOIN course ON course.id = purchased_course.course_id
        WHERE purchased_course.id = ?;
      `;

      db.query(getPurchasedCourseByIdDataQuery, [id], (err, result) => {
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

export function decrementTheCourseCount(data) {
  return new Promise(async (resolve, reject) => {
    try {
      let decrementTheCourseCountQuery = "";
      let course = null;
      try {
        if (data.from == "assigned") {
          decrementTheCourseCountQuery = `UPDATE assigned_course SET count = count - 1 WHERE id = ?`;
          course = await getAssignedCourseByIdFromCourse(data.course_id);
        } else if (data.form == "manager") {
          decrementTheCourseCountQuery = `UPDATE course_assigned_manager SET count = count - 1 WHERE id = ?`;
          course = await getAssignedCourseByIdFromManagerAssigned(data.course_id);
        } else {
          course = await getPurchasedCourseByIdFromCourse(data.course_id);
          decrementTheCourseCountQuery = `UPDATE purchased_course SET course_count = course_count - 1 WHERE id = ?`;
        
        console.log('course ',course);
      }
      } catch (error) {
        console.log(error);
      }
      db.query(
        decrementTheCourseCountQuery,
        [data.course_id],
        (err, result) => {
          if (err) {
            return reject(err?.message);
          } else {
            return resolve({
              validity: course[0].validity,
              id: course[0].course_id,
            });
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}
