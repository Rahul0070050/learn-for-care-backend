import { db } from "../../conf/mysql";
import { LoginData, User } from "../../type/auth";
import { generatorOtp } from "../../utils/auth";

export const insertUser = (user: User, otp: number) => {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery = `INSERT INTO users (username, email, type_of_account, password, country, city, otp) VALUES (?,?,?,?,?,?,?);`;
      db.query(
        insertQuery,
        [
          user?.name,
          user?.email,
          user?.type_of_account,
          user?.password,
          user?.country,
          user?.city,
          otp,
        ],
        (err, result) => {
          if (err) {
            if(err?.message === `ER_DUP_ENTRY: Duplicate entry '${user.email}' for key 'users.email'`) {
              return reject("email already exist");
            }
            reject(err?.message);
          } else {
            resolve(result);
          }
        }
      );
    } catch (error: any) {
      reject(error?.message);
    }
  });
};

export function getUserByEmail(info: LoginData) {
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

export function saveOtpToDB(email: string) {
  return new Promise(async (resolve, reject) => {
    try {
      let otp = await Number(generatorOtp());
      let setOtpQuery = `UPDATE users SET otp = ? WHERE email = ?;`;
      db.query(setOtpQuery, [otp, email], (err, result) => {
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
      let getQuery = `SELECT otp FROM users WHERE email = ? limit 1;`;
      db.query(getQuery, [email], (err, result) => {
        if (err) {
          reject(err.message);
        }else {
          resolve(result);
        } 
      });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function deleteInactivateUser(email: string) {
  return new Promise((resolve, reject) => {
    try {
      const userDeleteQuery = `DELETE FROM users WHERE email=?;`;
      db.query(userDeleteQuery, [email], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}
