import { db } from "../../../conf/mysql.js";
import { generatorOtp } from "../../../utils/auth.js";

export const insertUser = (user, otp) => {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery = `INSERT INTO users (first_name, last_name, email, type_of_account, password, country, city, otp) VALUES (?,?,?,?,?,?,?,?);`;
      db.query(
        insertQuery,
        [
          user?.first_name,
          user?.last_name,
          user?.email,
          user?.type_of_account,
          user?.password,
          user?.country,
          user?.city,
          otp,
        ],
        (err, result) => {
          if (err) {
            if (
              err?.message ===
              `ER_DUP_ENTRY: Duplicate entry '${user.email}' for key 'users.email'`
            ) {
              checkAnyAccountIsInActiveByEmail(user.email)
                .then(() => {
                  saveOtpToDB(user.email).then(({ otp }) => {
                    resolve({ ...result, otp });
                  });
                })
                .catch((err) => {
                  return reject("email already exist");
                });
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

function checkAnyAccountIsInActiveByEmail(email) {
  return new Promise((resolve, reject) => {
    try {
      let checkQuery = `SELECT * FROM users WHERE email = ? AND activate = ?;`;
      db.query(checkQuery, [email, false], function (err, result) {
        console.log(err);
        if (err) return reject(err.message);
        if (!result[0]) {
          reject({});
        } else {
          resolve({});
        }
      });
    } catch (error) {}
  });
}

export function getUserByEmail(info) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT * FROM users WHERE email = ?;`;
      db.query(getQuery, [info.email], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getUserById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT * FROM users WHERE id = ?;`;
      db.query(getQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function activateUser(email) {
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
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function saveOtpToDB(email) {
  return new Promise(async (resolve, reject) => {
    try {
      let otp = await Number(generatorOtp());
      let setOtpQuery = `UPDATE users SET otp = ? WHERE email = ?;`;
      db.query(setOtpQuery, [otp, email], (err, result) => {
        if (err) return reject(err.message);
        else return resolve({ otp, email });
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getOtpFromDB(email) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT otp FROM users WHERE email = ? limit 1;`;
      db.query(getQuery, [email], (err, result) => {
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

export function deleteInactivateUser(email) {
  return new Promise((resolve, reject) => {
    try {
      const userDeleteQuery = `DELETE FROM users WHERE email=?;`;
      db.query(userDeleteQuery, [email], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function updateUserPassword(email, password) {
  return new Promise((resolve, reject) => {
    console.log(password);
    try {
      let updatePasswordQuery = `UPDATE users SET password = ? WHERE email = ?;`;
      db.query(updatePasswordQuery, [password, email], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function saveASubUserToDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const createSubUserQuery = `INSERT INTO sub_user (first_name, last_name, password, email, city, country,created_by) VALUES (?,?,?,?,?,?,?);`;
      db.query(
        createSubUserQuery,
        [
          data?.first_name,
          data?.last_name,
          data?.password,
          data?.email,
          data?.city,
          data?.country,
          data?.userId,
        ],
        (err, result) => {
          if (err) {
            if (
              err.message ===
              `ER_DUP_ENTRY: Duplicate entry '${data.email}' for key 'sub_user.email'`
            ) {
              return reject("email already exist");
            } else {
              return reject(err.message);
            }
          } else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function blockSubUserBySubUserId(subUserId) {
  return new Promise((resolve, reject) => {
    try {
      let blockSubUserQuery = `UPDATE sub_user SET block = ? WHERE id = ?;`;
      db.query(blockSubUserQuery, [true, subUserId], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function unBlockSubUserBySubUserId(subUserId) {
  return new Promise((resolve, reject) => {
    try {
      let upBlockSubUserQuery = `UPDATE sub_user SET block = ? WHERE id = ?;`;
      db.query(upBlockSubUserQuery, [false, subUserId], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllSubUsersFrom(userId) {
  return new Promise((resolve, reject) => {
    try {
      let getAllSubUsersQuery = `SELECT id, first_name, last_name, block, email, city, country, created_by FROM sub_user WHERE created_by = ?;`;
      db.query(getAllSubUsersQuery, [userId], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function assignCourseToSubUserDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const { sub_user_id, course_id, userId, validity, purchased_course_id } =
        data;

      let decreaseQuery = `UPDATE purchased_course SET course_count = course_count - 1 WHERE id = ?;`;

      db.query(decreaseQuery, [purchased_course_id], (err, result) => {});

      let assignCourseToSubUserQuery = `
      INSERT INTO assigned_course (company_id,course_id,sub_user_id,validity) VALUES (?,?,?,?);`;
      db.query(
        assignCourseToSubUserQuery,
        [userId, course_id, sub_user_id, validity],
        (err, result) => {
          if (err) return reject(err.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}
