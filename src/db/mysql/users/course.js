import { db } from "../../../conf/mysql.js";
import { getAssignedCourseById } from "./assignedCourse.js";

export function getCourseByIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery = "SELECT * FROM course WHERE id = ?;";
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

      db.query(getAssignedCourseByIdDataQuery, [id, "course"], (err, result) => {
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
export function getPurchasedCourseById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseByIdDataQuery = `
        SELECT * FROM purchased_course WHERE id = ?;
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
      let decrementTheCourseCountQuery = '';
      let course = null;
      if(data.from == "assigned") {
        decrementTheCourseCountQuery = `UPDATE assigned_course SET count = count - 1 WHERE id = ?`;
        course = await getAssignedCourseById(data.id);
      } else {
        course = await getPurchasedCourseById(data.id);
        decrementTheCourseCountQuery = `UPDATE purchased_course SET course_count = course_count - 1 WHERE id = ?`;
      }
      console.log(course);
      db.query(decrementTheCourseCountQuery, [data.id], (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          return resolve({
            validity: course[0].validity,
            id: course[0].course_id,
          });
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
