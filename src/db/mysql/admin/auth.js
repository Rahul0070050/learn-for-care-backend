import { db } from "../../../conf/mysql.js";
import { generatorOtp } from "../../../utils/auth.js";

export function getAdminByEmail(email) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT * FROM admin WHERE email = ?;`;
      db.query(getQuery, [email], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
export function getAdminEmail() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT email FROM admin;`;
      db.query(getQuery, (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function saveOtpToDB() {
  return new Promise(async (resolve, reject) => {
    try {
      let otp = await Number(generatorOtp());

      let setOtpQuery = `UPDATE admin SET otp = ?;`;
      let getQuery = `SELECT * FORM admin LIMIT = 1;`;
      db.query(setOtpQuery, [otp], (err, result) => {
        if (err) return reject(err.message);
        db.query(setOtpQuery, [otp, false], (err, result) => {
          if (err) return reject(err.message);
          else return resolve({ otp, email: result[0].email });
        });
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getOtpFromDB(email) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT otp FROM admin;`;
      db.query(getQuery, (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function activateAdmin() {
  return new Promise((resolve, reject) => {
    try {
      let updateQuery = `UPDATE admin SET activate = ?, otp = ?;`;
      db.query(updateQuery, [true, null], (err, result) => {
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
