import { db } from "../../../conf/mysql.js";

export function getAllPurchasedCourseByUserId(id) {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseDataQuery = `
          SELECT purchased_course.id, Name, description, course_count, course_id, category, validity 
          FROM purchased_course INNER JOIN course ON 
          purchased_course.course_id = course.id
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

export function getAllPurchasedCourseFromDb() {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseDataQuery = `SELECT * FROM purchased_course;`;

      db.query(getPurchasedCourseDataQuery, (err, result) => {
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

export function getReportFromDb() {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseDataQuery = `SELECT
      DATE(date) AS day,
      SUM(amount) AS total_amount,
      SUM(course_count) AS total_course_count
      FROM purchased_course
      GROUP BY day;
    `;

      db.query(getPurchasedCourseDataQuery, (err, result) => {
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
export function getReportFromDbGroupByMonth() {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseDataQuery = `SELECT
      MONTH(date) AS month,
      SUM(amount) AS total_amount,
      SUM(course_count) AS total_course_count
      FROM purchased_course
      GROUP BY month;
    `;

      db.query(getPurchasedCourseDataQuery, (err, result) => {
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
export function getReportFromDbGroupByYear() {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseDataQuery = `SELECT
      YEAR(date) AS year,
      SUM(amount) AS total_amount,
      SUM(course_count) AS total_course_count
      FROM purchased_course
      GROUP BY year;
    `;

      db.query(getPurchasedCourseDataQuery, async (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          let groupByYear = result;
          let groupByMonth = await getReportFromDbGroupByMonth();
          let groupByDay = await getReportFromDb();
          return resolve({ groupByYear, groupByMonth, groupByDay });
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
