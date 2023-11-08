import { db } from "../../../conf/mysql.js";

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
        SELECT purchased_course.id, Name, description, course_id, category, validity 
        FROM purchased_course INNER JOIN course ON 
        purchased_course.course_id = course.id
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

export function getPurchasedCourseById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseByIdDataQuery = `
        SELECT * FROM purchased_course id = ?;
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

export function decrementTheCourseCount(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let decrementTheCourseCountQuery = `
        UPDATE purchased_course SET course_count = course_count - 1 WHERE id = ?;
      `;

      let getPurchasedCourse = await getPurchasedCourseById(id);
      db.query(decrementTheCourseCountQuery, [id], (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          return resolve({
            validity: getPurchasedCourse[0].validity,
            id: getPurchasedCourse[0].course_id,
          });
        }
      });
    } catch (error) {
      console.log(error);
      reject(error?.message);
    }
  });
}
