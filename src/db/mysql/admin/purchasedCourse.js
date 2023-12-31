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
      let getPurchasedCourseDataQuery = `
            SELECT
                YEAR(date) AS year,
                MONTH(date) AS month,
                SUM(amount) AS total_amount,
                SUM(course_count) AS total_course_count
            FROM
                purchased_course
            GROUP BY
                year, month;
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
export function getReportFromDbGroupByDay() {
  return new Promise((resolve, reject) => {
    try {
      let getPurchasedCourseDataQuery = `
      SELECT
      YEAR(date) AS year,
      MONTH(date) AS month,
      DAY(date) AS day,
      SUM(amount) AS total_amount,
      SUM(course_count) AS total_course_count
      FROM purchased_course
      GROUP BY year, month, day;
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
      let getPurchasedCourseCurrentDateQuery = `
      SELECT purchased_course.*, users.first_name AS first_name, users.last_name AS last_name, DATE_FORMAT(purchased_course.date, '%d/%m/%Y') AS date, TIME_FORMAT(purchased_course.date, '%h:%i:%s %p') AS time 
      FROM purchased_course
      INNER JOIN users ON users.id = purchased_course.user_id
      WHERE DATE(date) = CURDATE();
      `;

      db.query(getPurchasedCourseCurrentDateQuery, async (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          let groupByYear = await getReportFromDb();
          let groupByDay = await getReportFromDbGroupByDay();
          let dailyReport = result
          return resolve({ groupByYear, groupByDay, dailyReport });
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
