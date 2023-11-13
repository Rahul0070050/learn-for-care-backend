import { db } from "../../../conf/mysql.js";

export const insertUser = (user, otp) => {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery = `INSERT INTO users (first_name, last_name, email, type_of_account, password, country, phone, city, otp, activate) VALUES (?,?,?,?,?,?,?,?,?,?);`;
      user.phone = Number(user.phone);
      db.query(
        insertQuery,
        [
          user?.first_name,
          user?.last_name,
          user?.email,
          user?.type_of_account,
          user?.password,
          user?.country,
          user?.phone,
          user?.city,
          otp,
          true,
        ],
        (err, result) => {
          if (err) {
            if (
              err?.message ===
              `ER_DUP_ENTRY: Duplicate entry '${user.email}' for key 'users.email'`
            ) {
              return reject("email already exist");
            } else {
              reject(err?.message);
            }
          } else {
            resolve({ ...result, otp });
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
};

export function getAllUsersFromDb() {
  return new Promise((resolve, reject) => {
    try {
      let getUsersQuery = `SELECT * FROM users`;
      db.query(getUsersQuery, (err, result) => {
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

export function getUserByIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getUsersQuery = `SELECT * FROM users WHERE id = ?`;
      db.query(getUsersQuery, [id], (err, result) => {
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

export function blockUserFromAdmin(id) {
  return new Promise((resolve, reject) => {
    try {
      let updateQuery = `UPDATE users SET block = ? WHERE id = ?;`;
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

export function unBlockUserFromAdmin(id) {
  return new Promise((resolve, reject) => {
    try {
      let updateQuery = `UPDATE users SET block = ? WHERE id = ?;`;
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
