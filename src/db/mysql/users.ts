import { db } from "./index";
import { LoginData, User } from "../../type/user";

export const insertUser = (user: User, otp: number) => {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery = `INSERT INTO users (username, email, type, address, password, country, city, phone, otp) VALUES (?,?,?,?,?,?,?,?,?);`;
      db.query(
        insertQuery,
        [
          user?.username,
          user?.email,
          user?.type,
          user?.address,
          user?.password,
          user?.country,
          user?.city,
          user?.phone,
          otp,
        ],
        (err, result) => {
          if (err) return reject(err.message);
          resolve(result);
        }
      );
    } catch (error: any) {
      reject(error?.message);
    }
  });
};

export function loginUser(info: LoginData) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT * FROM users WHERE email = ?;`;
      db.query(getQuery, [info.email], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function activateUser(email: string) {
  return new Promise((resolve, reject) => {
    try {
      let updateQuery = `UPDATE users SET activate = ?, otp = ? WHERE email = ?;`;
      db.query(updateQuery, [true, null, email], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function getOtp(email: string) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT otp FROM users WHERE email = ? limit 1;`;
      db.query(getQuery, [email], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}
