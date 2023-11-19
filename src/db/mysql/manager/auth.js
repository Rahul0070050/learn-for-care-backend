import { db } from "../../../conf/mysql.js";
import { generatorOtp } from "../../../utils/auth.js";

export function getManagerByEmail(email) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT * FROM manager WHERE email = ?;`;
      db.query(getQuery, [email], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function blockManager(id) {
  return new Promise((resolve, reject) => {
    try {
      let updateQuery = `UPDATE manager SET block = ? WHERE id = ?;`;
      db.query(updateQuery, [true, id], (err, result) => {
        if (err) {
          reject(err?.message);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function unBlockManager(id) {
  return new Promise((resolve, reject) => {
    try {
      let updateQuery = `UPDATE manager SET block = ? WHERE id = ?;`;
      db.query(updateQuery, [false, id], (err, result) => {
        if (err) {
          reject(err?.message);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export const changeEmail = (email) => {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery = `INSERT INTO admin (email) VALUES (?);`;
      db.query(insertQuery, [email], (err, result) => {
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
};
