import { db } from "../../../conf/mysql.js";

export function addNewCourse(courseData) {
  return new Promise((resolve, reject) => {
    try {
      console.log();
      console.log(courseData.price);
      console.log(courseData.RRP);
      console.log(courseData.aims)
      console.log(courseData.who_should_attend)
      console.log(courseData.what_you_will_learn_point)
      console.log(courseData.objectives_point);
      let resource = JSON.stringify(courseData.resource);
      let ppt = JSON.stringify(courseData.image);
      let insertCourseQuery = `INSERT INTO course(
          name,description,category,intro_video,thumbnail,video,ppt,resource,assessment,certificate,
          objective_define,What_you_will_learn,aims,who_should_attend,objectives_point,what_you_will_learn_point,
          price,RRP,course_type,duration,course_level,course_code,certificate_line
          ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
      db.query(
        insertCourseQuery,
        [
          courseData.name,
          courseData.description,
          courseData.category,
          courseData.intro_video,
          courseData.thumbnail,
          courseData.video,
          ppt,
          resource,
          courseData.assessment,
          courseData.certificate,
          courseData.objective_define,
          courseData.What_you_will_learn,
          courseData.aims,
          courseData.who_should_attend,
          courseData.objectives_point,
          courseData.what_you_will_learn_point,
          parseFloat(courseData.price).toFixed(2),
          parseFloat(courseData.RRP).toFixed(2),
          courseData.course_type,
          courseData.duration,
          courseData.course_level,
          courseData.course_code,
          courseData.certificate_line,
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
export function deleteAppliedCoupon(id) {
  try {
    return new Promise((resolve, reject) => {
      let deleteQuery =
        "DELETE FROM applied_coupon WHERE user_id = ? AND state = ?";
      db.query(deleteQuery, [id, true], (err, result) => {
        if (err) reject(err?.message);
        else resolve();
      });
    });
  } catch (error) {}
}

export function getCourseByIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery = "SELECT * FROM course WHERE id = ?;";
      db.query(getCourseByIdQuery, [id], (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          return resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getCourseByCategory(category) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByCategoryQuery = "SELECT * FROM course WHERE category = ?;";
      db.query(getCourseByCategoryQuery, [category], (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          if (!result[0]) {
            return reject("No course Found");
          }
          resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllCoursesFromDb() {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByCategoryQuery = "SELECT course.*, exams.id AS exam_id FROM course LEFT JOIN exams ON exams.course_id = course.id;";
      db.query(getCourseByCategoryQuery, (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      return reject(err?.message);
    }
  });
}

export function updateCourseSingleFieldMediaById(id, data, type) {
  return new Promise((resolve, reject) => {
    try {
      let updateCourseMediaQuery = `UPDATE course SET ${type} = ? WHERE id = ?;`;
      db.query(updateCourseMediaQuery, [data, id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function updateCourseData(courseInfo) {
  return new Promise((resolve, reject) => {
    try {
      const {
        RRP,
        course_id,
        name,
        description,
        category,
        assessment,
        certificate,
        objective_define,
        What_you_will_learn,
        aims,
        who_should_attend,
        objectives_point,
        what_you_will_learn_point,
        price,
        course_type,
        duration,
        course_level,
        course_code,
        certificate_line,
      } = courseInfo;


      let updateCourseDataQuery =
        "UPDATE course SET name = ?, description = ?, category = ?, assessment = ?, certificate = ?, objective_define = ?, What_you_will_learn = ?, aims = ?, who_should_attend = ?, objectives_point = ?, what_you_will_learn_point = ?, price = ?, RRP = ?, course_type = ?, duration = ?, course_level = ?, course_code = ?, certificate_line = ? WHERE id = ?;";
      db.query(
        updateCourseDataQuery,
        [
          name,
          description,
          category,
          assessment,
          certificate,
          objective_define,
          What_you_will_learn,
          aims,
          who_should_attend,
          objectives_point,
          what_you_will_learn_point,
          parseFloat(price).toFixed(2),
          RRP,
          course_type,
          duration,
          course_level,
          course_code,
          certificate_line,
          course_id,
        ],
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

export function getCourseByLimitFromDb(limit) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseDataByLimitQuery = `SELECT id, thumbnail, name, price, description, category
        FROM course
        LIMIT ? , ?;`;
      let getCourseCountQuery = "SELECT COUNT(id) FROM course;";

      let maxLimit = Number(limit) + 11;
      db.query(
        getCourseDataByLimitQuery,
        [Number(limit), maxLimit],
        (err, course) => {
          if (err) {
            reject(err?.message);
          } else {
            db.query(getCourseCountQuery, (err, count) => {
              if (err) return reject(err?.message);
              resolve({ course: course, count: count[0]["COUNT(id)"] });
            });
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function deleteCourseFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseDataQuery = "SELECT * FROM course WHERE id = ?;";
      let deleteCourseDataQuery = "DELETE FROM course WHERE id = ?;";

      db.query(getCourseDataQuery, [id], (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          db.query(deleteCourseDataQuery, [id], (err, success) => {
            if (err) return reject(err?.message);
            result[0].resource = JSON.parse(result[0].resource);
            return resolve(result[0]);
          });
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function geCountOfAllCourse() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT COUNT(*) FROM course;`;
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

export function geCountOfPurchasedCourse(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery =
        "SELECT SUM(fake_course_count) FROM purchased_course WHERE course_type = ? AND user_id = ?;";
      db.query(getQuery, ["course", id], (err, result) => {
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

export function geCountOfAssignedCourse(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery =
        "SELECT SUM(fake_count) FROM course_assigned_manager WHERE course_type = ? AND manager_id = ?;";
      db.query(getQuery, ["course", id], (err, result) => {
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
