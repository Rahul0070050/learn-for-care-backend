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
        "SELECT id, thumbnail, name, description, category, assessment, certificate, certificate_line, objective_define, What_you_will_learn, aims, who_should_attend, objectives_point, what_you_will_learn_point, price, RRP, course_type, duration, course_level, course_code FROM course WHERE id = ?;";
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

export function getBundleCourseAttemptsById(enrolled_bundle_id, course_id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery =
        "SELECT COUNT(*) AS count FROM bundle_exam_attempts WHERE enrolled_bundle_id = ? AND course_id = ?;";
      db.query(
        getCourseByIdQuery,
        [enrolled_bundle_id, course_id],
        (err, result) => {
          if (err) {
            return reject(err?.message);
          } else {
            return resolve(result[0].count);
          }
        }
      );
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
        SELECT purchased_course.id AS purchased_course_id, purchased_course.fake_course_count AS fake_count, purchased_course.id AS id,
        1 AS from_purchased, Name, description, course_count,
        course_id, category, DATE_FORMAT(purchased_course.validity, '%d/%m/%Y') AS validity
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
        course_id, category, DATE_FORMAT(purchased_course.validity, '%d/%m/%Y') AS validity 
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
      SELECT assigned_course.*, 0 AS from_purchased, assigned_course.fake_count AS fake_count, course.id AS course_id,
      course.name AS name, course.description AS description, assigned_course.count AS course_count,
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

export function getManagerAssignedBundleById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseByIdDataQuery = `
        SELECT course_assigned_manager.*, course_bundle.name AS name, course_bundle.courses AS courses, course_assigned_manager.validity AS validity
        FROM course_assigned_manager 
        INNER JOIN course_bundle ON course_bundle.id = course_assigned_manager.course_id
        WHERE course_assigned_manager.id = ?;
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
      console.log(data.from);
      try {
        if (data.from == "assigned") {
          decrementTheCourseCountQuery = `UPDATE assigned_course SET count = count - 1 WHERE id = ?;`;
          course = await getAssignedCourseByIdFromCourse(data.course_id);
        } else if (data.from == "manager") {
          decrementTheCourseCountQuery = `UPDATE course_assigned_manager SET count = count - 1 WHERE id = ?;`;
          course = await getAssignedCourseByIdFromManagerAssigned(
            data.course_id
          );
        } else {
          course = await getPurchasedCourseByIdFromCourse(data.course_id);
          decrementTheCourseCountQuery = `UPDATE purchased_course SET course_count = course_count - 1 WHERE id = ?;`;
        }
      } catch (error) {
        reject(error);
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
