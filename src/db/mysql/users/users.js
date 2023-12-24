import { db } from "../../../conf/mysql.js";
import { generatorOtp } from "../../../utils/auth.js";
import { getAllAssignedCourseByUserId } from "./assignedCourse.js";

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

export function getIndividualsCountById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT COUNT(*) FROM users WHERE type_of_account = ? AND created_by = ?;`;
      db.query(getQuery, ["individual", id], (err, result) => {
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

export function getManagersCountById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT id FROM users WHERE type_of_account = ? AND created_by = ?;`;
      db.query(getQuery, ["manager", id], (err, result) => {
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

export function getUserById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT * FROM users WHERE id = ?;`;
      db.query(getQuery, [id], async (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          delete result[0]?.password;
          let managersCount = await getManagersCountById(id);
          let allIndividuals = Promise.all(managersCount.map(async item => await getIndividualsCountById(item.id)))
          allIndividuals = allIndividuals.flat()
          console.log(managersCount, allIndividuals);
          let individualsCount = await getIndividualsCountById(id);
          result[0]["managers_count"] = 0;
          result[0]["individuals_count"] = individualsCount[0]["COUNT(*)"];
          return resolve(result);
        }
      });
    } catch (error) {
      console.log(error);
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
        else {
          console.log(result);
          if (result.affectedRows >= 1) {
            resolve({ otp, email });
          } else {
            reject("Email is not exist");
          }
        }
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
  return new Promise(async (resolve, reject) => {
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
      course_assigned_manager.course_id AS course_id, DATE_FORMAT(course_assigned_manager.validity, '%d/%m/%Y') AS validity, 
      course_assigned_manager.id AS id, true AS from_assigned_table, course_assigned_manager.owner AS owner
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

export function getAllCompanies() {
  return new Promise((resolve, reject) => {
    try {
      let getAllSubUsersQuery = `SELECT city ,phone ,email ,first_name ,id ,joined ,last_name,type_of_account,block FROM users WHERE type_of_account = ?;`;
      db.query(getAllSubUsersQuery, ["company"], (err, result) => {
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

      console.log(data?.assigned);
      console.log("count ", count);
      console.log("course_id ", course_id);

      let decreaseQuery = `UPDATE purchased_course SET course_count = course_count - ? WHERE id = ?;`;
      try {
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
      }
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function assignCourseToMAnagerIndividualFromManagerAssigned(data) {
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

      console.log(data?.assigned);
      console.log("count ", count);
      console.log("course_id ", course_id);

      let decreaseQuery = `UPDATE course_assigned_manager SET count = count - ? WHERE id = ?;`;
      try {
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
      }
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
      if (data?.from == "manager-assigned") {
        decreaseQuery = `UPDATE course_assigned_manager SET count = count - ? WHERE id = ?;`;
      } else {
        decreaseQuery = `UPDATE assigned_course SET count = count - ? WHERE id = ?;`;
      }

      db.query(decreaseQuery, [count, course_id], (err, result) => {
        if (err) console.log(err);
        console.log(err);
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
          if (err) {
            console.log(err);
            return reject(err.message);
          } else return resolve(result);
        }
      );
    } catch (error) {
      console.log(error);
      reject(error?.message);
    }
  });
}

export function assignCourseToMAnagerIndividualFromAssignedToDb(data) {
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

      // let decreaseQuery = `SELECT assigned_course SET count = count - ? WHERE id = ?;`;
      let decreaseQuery = `UPDATE course_assigned_manager SET count = count - ? WHERE id = ?;`;

      db.query(decreaseQuery, [count, course_id], (err, result) => {
        if (err) console.log(err);
        console.log(err);
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
          if (err) {
            console.log(err);
            return reject(err.message);
          } else return resolve(result);
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

export function assignCourseOrBundleToUser(data) {
  return new Promise((resolve, reject) => {
    try {
      const { user_id, bundle_id, adminId, type, count } = data;

      let validity = new Date();
      validity.setFullYear(validity.getFullYear() + 1);

      let insertQuery = `INSERT INTO assigned_course (owner, course_id, course_type, user_id, validity,count,fake_count) VALUES (?,?,?,?,?,?,?);`;
      db.query(
        insertQuery,
        [adminId, bundle_id, type, user_id, new Date(validity), count, count],
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result);
        }
      );
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
            if (
              err.message ===
              `ER_DUP_ENTRY: Duplicate entry '${email}' for key 'users.email'`
            ) {
              return reject("Email Already Exist");
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
      SELECT course_assigned_manager.*, count AS course_count, category, course.name AS name, 0 AS from_purchased, course_assigned_manager.id AS id,
      DATE_FORMAT(course_assigned_manager.validity, '%d/%m/%Y') AS validity
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
          result = result.flat()
          let individualsOfAdmin = await getAllManagerIndividualFromDb(id);
          resolve([...result, ...individualsOfAdmin]);
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

export function getAllTransactionsFromDb(userId) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT 
      users.first_name AS first_name, users.last_name AS last_name, course.name AS name, purchased_course.amount AS amount, TIME_FORMAT(purchased_course.date, "%h:%i:%s %p") AS time, purchased_course.fake_course_count AS count, DATE_FORMAT(purchased_course.date, '%d/%m/%Y') AS date
      FROM 
      purchased_course 
      RIGHT JOIN course on course.id = purchased_course.course_id
      LEFT JOIN users on users.id = purchased_course.user_id
      WHERE user_id = ?`;
      db.query(getQuery, [userId], (err, result) => {
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

export function getAllMonthlyTransactionsFromDb(userId) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
            SELECT 
                YEAR(date) AS year,
                MONTH(date) AS month,
                SUM(fake_course_count) AS total_fake_count,
                SUM(amount) AS total_amount
            FROM 
                purchased_course
            GROUP BY 
                YEAR(date), MONTH(date)
            ORDER BY 
                YEAR(date), MONTH(date);
            `;
      db.query(getQuery, [userId], (err, result) => {
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

export function getMonthlyTransactionsFromDb(userId) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
            SELECT 
                YEAR(date) AS year,
                MONTH(date) AS month,
                SUM(fake_course_count) AS total_fake_count,
                SUM(amount) AS total_amount
            FROM 
                purchased_course
            WHERE
                user_id = ?
            GROUP BY 
                YEAR(date), MONTH(date)
            ORDER BY 
                YEAR(date), MONTH(date);
            `;
      db.query(getQuery, [userId], (err, result) => {
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

function getManagersByCompanyId(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT id, first_name, last_name FROM users WHERE type_of_account = ? AND created_by = ?;`;
      db.query(getQuery, ["manager", id], (err, result) => {
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

function getCountAssignedToManager(id, type) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT COUNT(*) FROM course_assigned_manager WHERE manager_id = ? AND course_type = ?;`;
      db.query(getQuery, [id, type], (err, result) => {
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

export function getAllManagerReportsFromDb(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let managers = await getManagersByCompanyId(id);
      Promise.all(
        managers.map(async (item) => {
          let course = await getCountAssignedToManager(item.id, "course");
          let bundle = await getCountAssignedToManager(item.id, "bundle");
          let individuals = await getIndividualsCountById(item.id);
          item["course_count"] = course[0]["COUNT(*)"];
          item["bundle_count"] = bundle[0]["COUNT(*)"];
          item["individuals_count"] = individuals[0]["COUNT(*)"];
          return item;
        })
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getIndividualsById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT id, first_name, last_name FROM users WHERE type_of_account = ? AND created_by = ?;`;
      db.query(getQuery, ["individual", id], (err, result) => {
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
export function getCountAssignedToIndividual(id, type) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT COUNT(*) FROM assigned_course WHERE course_type = ? AND user_id = ?;`;
      db.query(getQuery, [type, id], (err, result) => {
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

export function getCertificatesCount(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT COUNT(*) FROM certificate WHERE user_id = ?;`;
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
export function getAllIndividualReportsFromDb(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let managers = await getManagersByCompanyId(id);
      let ind = await Promise.all(
        managers.map(async (item) => {
          let individuals = await getIndividualsById(item.id);
          individuals = individuals.flat(1);
          return individuals;
        })
      );
      ind = ind.flat(1);
      Promise.all(
        ind.map(async (ind) => {
          let course = await getCountAssignedToIndividual(ind.id, "course");
          let bundle = await getCountAssignedToIndividual(ind.id, "bundle");
          let certificates = await getCertificatesCount(ind.id);
          ind["course"] = course[0]["COUNT(*)"];
          ind["bundle"] = bundle[0]["COUNT(*)"];
          ind["certificates"] = certificates[0]["COUNT(*)"];
          return ind;
        })
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function managerAssignSelfCourse(data) {
  return new Promise((resolve, reject) => {
    try {
      const {
        from,
        id,
        purchased_course_id,
        course_id,
        count,
        userId,
        type,
        validity,
      } = data;

      try {
        console.log(purchased_course_id);
        let decreaseQuery = "";

        if (from == "manager-assigned") {
          decreaseQuery = `UPDATE course_assigned_manager SET count = count - ? WHERE id = ?;`;
        } else if (from == "manager-purchased" || from == "company-purchased") {
          decreaseQuery = `UPDATE purchased_course SET course_count = course_count - ? WHERE id = ?;`;
        } else {
          decreaseQuery = `UPDATE assigned_course SET count = count - ? WHERE id = ?;`;
        }

        db.query(decreaseQuery, [count, purchased_course_id], (err, result) => {
          if (err) console.log(err);
        });

        if (from == "manager-assigned" || from == "manager-purchased") {
          let assignCourseToManagerQuery = `INSERT INTO course_assigned_manager (course_id, manager_id, course_type, fake_count, count, validity,owner) VALUES (?,?,?,?,?,?,?);`;
          db.query(
            assignCourseToManagerQuery,
            [course_id, userId, type, count, count, new Date(validity), userId],
            (err, result) => {
              if (err) return reject(err.message);
              else return resolve(result);
            }
          );
        } else {
          let assignCourseToManagerQuery = `INSERT INTO assigned_course (owner, course_id, count, course_type, user_id, validity,fake_count) VALUES (?,?,?,?,?,?,?);`;
          db.query(
            assignCourseToManagerQuery,
            [userId, course_id, count, type, userId, new Date(validity), count],
            (err, result) => {
              if (err) {
                return reject(err.message);
              } else return resolve(result);
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      reject(error?.message);
    }
  });
}

export function getCourseWiseManagerReportsFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
        SELECT course.name AS course_name, course.course_code AS course_code,COUNT(DISTINCT course_assigned_manager.manager_id) AS managers_count
        FROM course_assigned_manager
        INNER JOIN course ON course.id = course_assigned_manager.course_id
        WHERE course_assigned_manager.course_type = ? AND course_assigned_manager.owner = ?
        GROUP BY course.name, course.course_code;
      `;
      db.query(getQuery, ["course", id], (err, result) => {
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

export function getIndividualsByCompanyId(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT id, first_name, last_name FROM users WHERE type_of_account = ? AND created_by = ?;`;
      db.query(getQuery, ["individual", id], (err, result) => {
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

export function getCourseWiseIndividualReportsFromDb(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let managers = await getManagersByCompanyId(id);
      let individuals = await Promise.all(
        managers.map((item) => getIndividualsByCompanyId(item.id))
      );
      individuals = individuals.flat(1);
      let course_names = [];
      let courses = await Promise.all(
        individuals.map(async (item) => {
          let course = await getAllAssignedCourseByUserId(item.id);
          course.map((c) => {
            if (!course_names.find((item) => item?.course_name == c.name))
              course_names.push({
                course_name: c.name,
                count: 0,
                code: c.course_code,
              });
          });
          item["course"] = course;
          return item;
        })
      );
      courses = courses.flat(1);
      courses.map((item) => {
        item.course.forEach((c) => {
          course_names.filter((cname) => {
            if (c.name === cname.course_name) {
              return { ...cname, count: ++cname.count };
            }
          });
        });
      });
      console.log(course_names);

      resolve(course_names);
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getCourseWiseIndividualFromManagerReportsFromDb(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let individuals = await getIndividualsByCompanyId(id);
      individuals = individuals.flat(1);
      let course_names = [];
      let courses = await Promise.all(
        individuals.map(async (item) => {
          let course = await getAllAssignedCourseByUserId(item.id);
          course.map((c) => {
            if (!course_names.find((item) => item?.course_name == c.name))
              course_names.push({
                course_name: c.name,
                count: 0,
                code: c.course_code,
              });
          });
          item["course"] = course;
          return item;
        })
      );
      courses = courses.flat(1);
      courses.map((item) => {
        item.course.forEach((c) => {
          course_names.filter((cname) => {
            if (c.name === cname.course_name) {
              return { ...cname, count: ++cname.count };
            }
          });
        });
      });

      resolve(course_names);
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getIndividualReportFromDb(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let individuals = await getAllManagerIndividualFromDb(id);
      individuals = individuals.flat(1);
      Promise.all(
        individuals.map(async (item) => {
          let course = await getCountAssignedToIndividual(item.id, "course");
          let bundle = await getCountAssignedToIndividual(item.id, "bundle");
          let certificates = await getCertificatesCount(item.id);
          item["course_count"] = course[0]["COUNT(*)"];
          item["bundle_count"] = bundle[0]["COUNT(*)"];
          item["certificates"] = certificates[0]["COUNT(*)"];
          return item;
        })
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}
