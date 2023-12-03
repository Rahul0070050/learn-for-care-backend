import { db } from "../../../conf/mysql.js";
import { getAllPurchasedCourseByUserId } from "../users/course.js";

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

export function getCountPurchasedCourse(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT COUNT(*) FROM purchased_course WHERE AND user_id = ?;`;
      db.query(getQuery, [id], (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getCountAllCertificates(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT COUNT(*) FROM certificate WHERE AND user_id = ?;`;
      db.query(getQuery, [id], (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getUserByIdFromDb(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let courses = await getAllPurchasedCourseByUserId(id);
      let course = await getCountPurchasedCourse(id)
      let certificate = await getCountAllCertificates(id)
      let getUsersQuery = `SELECT * FROM users WHERE id = ?`;
      db.query(getUsersQuery, [id], (err, result) => {
        if (err) {
          reject(err?.message);
        } else {
          result[0].course_count = course[0]['COUNT(*)']
          result[0].certificate_count = certificate[0]['COUNT(*)']
          result[0].course = courses;
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

export function getNewUsers() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
        SELECT id, first_name, last_name, profile_image 
        FROM users
        WHERE type_of_account = 'individual' AND joined >= CURDATE() - INTERVAL 1 WEEK
      ;`;
      db.query(getQuery, (err, result) => {
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

export function getNewCompanyUsers() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
        SELECT * 
        FROM users
        WHERE type_of_account = 'company' AND joined >= CURDATE() - INTERVAL 1 WEEK;
      ;`;
      db.query(getQuery, (err, result) => {
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

export function geCountOfAllCompanyUsers() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT COUNT(*)
      FROM users
      WHERE type_of_account = 'company'
      ;`;
      db.query(getQuery, (err, result) => {
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

export function geCountOfAllIndividualUsers() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT COUNT(*)
      FROM users
      WHERE type_of_account = 'individual'
      ;`;
      db.query(getQuery, (err, result) => {
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

export function geCountOfAllIndividuals(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT COUNT(*)
      FROM users
      WHERE type_of_account = 'individual' AND created_by = ?
      ;`;
      db.query(getQuery, [id], (err, result) => {
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

export function getAllIndividualsFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT * FROM users
      WHERE type_of_account = 'individual' AND created_by = ?;`;
      db.query(getQuery, [id], (err, result) => {
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

export function getCountOfAssignedBundleForIndividuals(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT SUM(count) FROM assigned_course
      WHERE course_type = 'bundle' AND user_id = ?;`;
      db.query(getQuery, [id], (err, result) => {
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
