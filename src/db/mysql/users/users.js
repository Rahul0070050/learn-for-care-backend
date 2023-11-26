import { db } from "../../../conf/mysql.js";
import { generatorOtp } from "../../../utils/auth.js";

export const insertUser = (user, otp) => {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery = `INSERT INTO users (first_name, last_name, email, type_of_account, password, country, phone, city, otp) VALUES (?,?,?,?,?,?,?,?,?);`;
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
        if (err) {
          return reject(err.message);
        } else {
          delete result[0]?.password;
          return resolve(result);
        }
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

export function updateUserData(userData) {
  return new Promise((resolve, reject) => {
    const { first_name, last_name, phone, city, id } = userData;
    try {
      let updateUserInfoQuery = `UPDATE users SET first_name = ?, last_name = ?, phone = ?, city = ? WHERE id = ?;`;
      db.query(
        updateUserInfoQuery,
        [first_name, last_name, phone, city, id],
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

export function saveASubUserToDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const createSubUserQuery = `INSERT INTO sub_user (first_name, last_name, password, email, city, country, created_by, phone) VALUES (?,?,?,?,?,?,?,?);`;
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
          data?.phone,
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
          } else {
            return resolve(result);
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function blockUserById(userId) {
  return new Promise((resolve, reject) => {
    try {
      let blockSubUserQuery = `UPDATE users SET block = ? WHERE id = ?;`;
      db.query(blockSubUserQuery, [true, userId], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAssignedBundleToManagerFromDb(userId) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT course_bundle.price AS amount, course_bundle.name AS bundle_name, 
      course_bundle.id AS bundle_id, course_assigned_manager.count AS course_count, 
      course_assigned_manager.course_id AS course_id, course_assigned_manager.validity AS validity, 
      course_assigned_manager.id AS id, true AS from_assigned_table 
      FROM course_assigned_manager 
      INNER JOIN course_bundle ON course_bundle.id = course_assigned_manager.course_id 
      WHERE course_assigned_manager.manager_id = ?;`;
      db.query(getQuery, [userId], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function unBlockUserBySubUserId(userId) {
  return new Promise((resolve, reject) => {
    try {
      let upBlockSubUserQuery = `UPDATE users SET block = ? WHERE id = ?;`;
      db.query(upBlockSubUserQuery, [false, userId], (err, result) => {
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

export function getAllMAnagers(userId) {
  return new Promise((resolve, reject) => {
    try {
      let getAllSubUsersQuery = `SELECT city ,phone ,email ,first_name ,id ,joined ,last_name,type_of_account,block FROM users WHERE created_by = ? AND type_of_account = ?;`;
      db.query(getAllSubUsersQuery, [userId, "manager"], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function assignCourseToMAnager(data) {
  return new Promise((resolve, reject) => {
    try {
      const {
        course_id,
        count,
        receiverId,
        realCourse_id,
        realCourse_type,
        realValidity,
        userId,
        from,
      } = data;

      let decreaseQuery = "";
      if (from == "assigned") {
        decreaseQuery = `UPDATE assigned_course SET count = count - ? WHERE id = ?;`;
      } else {
        decreaseQuery = `UPDATE purchased_course SET course_count = course_count - ? WHERE id = ?;`;
      }

      db.query(decreaseQuery, [count, course_id], (err, result) => {
        if (err) console.log(err);
      });

      let assignCourseToManagerQuery = `INSERT INTO course_assigned_manager (course_id, manager_id, course_type, fake_count, count, validity,owner) VALUES (?,?,?,?,?,?,?);`;
      db.query(
        assignCourseToManagerQuery,
        [
          realCourse_id,
          receiverId,
          realCourse_type,
          count,
          count,
          new Date(realValidity),
          userId,
        ],
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

export function assignCourseToMAnagerIndividual(data) {
  return new Promise((resolve, reject) => {
    try {
      const {
        course_id,
        receiverId,
        realCourse_id,
        realCourse_type,
        realValidity,
        userId,
        count,
      } = data;

      let decreaseQuery = "";
      if (data?.assigned) {
        decreaseQuery = `UPDATE course_assigned_manager SET count = count - ? WHERE id = ?;`;
      } else {
        decreaseQuery = `UPDATE purchased_course SET course_count = course_count - ? WHERE id = ?;`;
      }

      db.query(decreaseQuery, [count, course_id], (err, result) => {
        if (err) console.log(err);
      });

      let assignCourseToManagerQuery = `INSERT INTO assigned_course (owner, course_id, course_type, user_id, validity) VALUES (?,?,?,?,?);`;
      db.query(
        assignCourseToManagerQuery,
        [
          userId,
          realCourse_id,
          realCourse_type,
          receiverId,
          new Date(realValidity),
        ],
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

export function assignCourseToMAnagerIndividualFromAssignedDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const {
        course_id,
        receiverId,
        realCourse_id,
        realCourse_type,
        realValidity,
        userId,
        count,
      } = data;

      let decreaseQuery = null;
      if (data.from == "manager-assigned") {
        decreaseQuery = `UPDATE course_assigned_manager SET count = count - ? WHERE id = ?;`;
      } else {
        decreaseQuery = `UPDATE assigned_course SET count = count - ? WHERE id = ?;`;
      }

      db.query(decreaseQuery, [count, course_id], (err, result) => {
        if (err) console.log(err);
      });

      let assignCourseToManagerQuery = `INSERT INTO assigned_course (owner, course_id, course_type, user_id, validity) VALUES (?,?,?,?,?);`;
      db.query(
        assignCourseToManagerQuery,
        [
          userId,
          realCourse_id,
          realCourse_type,
          receiverId,
          new Date(realValidity),
        ],
        (err, result) => {
          if (err) return reject(err.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      console.log(error);
      reject(error?.message);
    }
  });
}

export function getAllBlockedUser(id) {
  return new Promise((resolve, reject) => {
    try {
      let getAllBlockedUsersQuery = `SELECT id, first_name, last_name, block, email, city, country, created_by FROM sub_user WHERE created_by = ? AND block = ?;`;
      db.query(getAllBlockedUsersQuery, [id, true], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllAssignedCourseProgressFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getAllBlockedUsersQuery = `
      SELECT course_id, sub_user_id, progress, validity, first_name, last_name, course.name as courseName
      FROM assigned_course
      JOIN course ON assigned_course.course_id = course.id
      JOIN sub_user ON assigned_course.sub_user_id = sub_user.id
      WHERE company_id = ?;`;
      db.query(getAllBlockedUsersQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function saveAManagerToDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        country,
        city,
        phone,
        userId,
        user_type,
      } = data;
      const insertQuery = `INSERT INTO users (first_name, last_name, email, password, country, city, phone, created_by, type_of_account) VALUES (?,?,?,?,?,?,?,?,?);`;
      db.query(
        insertQuery,
        [
          first_name,
          last_name,
          email,
          password,
          country,
          city,
          phone,
          userId,
          user_type,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            if (
              err.message ===
              `ER_DUP_ENTRY: Duplicate entry '${email}' for key 'manager.email'`
            ) {
              return reject("email already exist");
            } else {
              return reject(err.message);
            }
          } else {
            return resolve(result);
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAssignedCourseForManagerByManagerId(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT course_assigned_manager.*, count AS course_count, category, course.name AS name, 0 AS from_purchased
      FROM course_assigned_manager
      INNER JOIN course ON course.id = course_assigned_manager.course_id
      WHERE manager_id = ?;`;
      db.query(getQuery, [id], (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
export function getAllManagerIndividualFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery =
        "SELECT city ,phone ,email ,first_name ,id ,joined ,last_name, block, type_of_account FROM users WHERE created_by = ? AND type_of_account = ?";
      db.query(getQuery, [id, "individual"], (err, result) => {
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

export function getAllIndividualUnderCompanyFromDb(id) {
  return new Promise(async (resolve, reject) => {
    let managers = await getAllMAnagers(id);
    try {
      Promise.all(
        managers.map((item) => getAllManagerIndividualFromDb(item.id))
      )
        .then(async (result) => {
          let individualsOfAdmin = await getAllManagerIndividualFromDb(id);
          resolve([...result,individualsOfAdmin]);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function saveUserProfileImage(id, file) {
  return new Promise((resolve, reject) => {
    try {
      let updateQuery = "UPDATE users SET profile_image = ? WHERE id = ?";
      db.query(updateQuery, [file, id], (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
