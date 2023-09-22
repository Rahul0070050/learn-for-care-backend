import { db } from "../../conf/mysql";
import { LoginData, User } from "../../type/auth";
import { generatorOtp } from "../../utils/auth";

export function getAdminByEmail(email: string) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT * FROM admin WHERE email = ?;`;
      db.query(getQuery, [email], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error: any) {
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
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function saveOtpToDB(email: string) {
  return new Promise(async (resolve, reject) => {
    try {
      let otp = await Number(generatorOtp());

      let setOtpQuery = `UPDATE admin SET otp = ?, activate = ? WHERE email = ?;`;
      db.query(setOtpQuery, [otp, false, email], (err, result) => {
        if (err) return reject(err.message);
        else return resolve({ otp, email });
      });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function getOtpFromDB(email: string) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT otp FROM admin WHERE email = ?;`;
      db.query(getQuery, [email], (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result);
        }
      });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function activateAdmin(email: string) {
  return new Promise((resolve, reject) => {
    try {
      let updateQuery = `UPDATE admin SET activate = ?, otp = ? WHERE email = ?;`;
      db.query(updateQuery, [true, null, email], (err, result) => {
        if (err) {
          reject(err?.message);
        } else {
          resolve(result);
        }
      });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export const changeEmail = (email: string) => {
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
    } catch (error: any) {
      console.log(error);

      reject(error?.message);
    }
  });
};
