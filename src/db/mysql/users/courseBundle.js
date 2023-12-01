import { db } from "../../../conf/mysql.js";
import { getAssignedCourseById } from "./assignedCourse.js";
import {
  getManagerAssignedBundleById,
  getPurchasedCourseById,
} from "./course.js";

export function getCourseBundleById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getOneBundleQuery = "SELECT * FROM course_bundle WHERE id = ?;";

      db.query(getOneBundleQuery, [id], (err, bundle) => {
        if (err) reject(err?.message);
        else resolve(bundle);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllBBundle() {
  return new Promise((resolve, reject) => {
    try {
      let getAllBundleQuery = "SELECT * FROM course_bundle;";

      db.query(getAllBundleQuery, (err, bundle) => {
        if (err) reject(err?.message);
        else resolve(bundle);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function startANewBundle(data) {
  return new Promise(async (resolve, reject) => {
    const { bundle_id, from, id } = data;

    let course = null;
    let decrementTheCourseCountQuery = "";
    if (from == "assigned") {
      decrementTheCourseCountQuery = `UPDATE assigned_course SET count = count - 1 WHERE id = ?`;
      course = await getAssignedCourseById(bundle_id);
    } else if (from == "purchased") {
      course = await getPurchasedCourseById(bundle_id);
      decrementTheCourseCountQuery = `UPDATE purchased_course SET course_count = course_count - 1 WHERE id = ?`;
    } else {
      course = await getManagerAssignedBundleById(bundle_id);
      decrementTheCourseCountQuery = `UPDATE course_assigned_manager SET count = count - 1 WHERE id = ?`;
    }

    try {
      db.query(decrementTheCourseCountQuery, [bundle_id], (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          return resolve({
            id: course[0].course_id,
            validity: course[0].validity,
            bundleName: course[0].name,
            course_count: course[0].courses,
          });
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function setNewBundleToEnroll(data) {
  return new Promise((resolve, reject) => {
    try {
      const {
        bundle_name,
        bundle_id,
        user_id,
        course_count,
        validity,
        unfinished_course,
        all_courses,
      } = data;

      let setQuery = `INSERT INTO enrolled_bundle (bundle_name, bundle_id, all_courses, user_id, course_count, validity, unfinished_course) VALUES (?,?,?,?,?,?,?)`;
      db.query(
        setQuery,
        [
          bundle_name,
          bundle_id,
          JSON.stringify(all_courses),
          user_id,
          course_count,
          new Date(validity),
          JSON.stringify(unfinished_course),
        ],
        (err, result) => {
          if (err) {
            reject(err?.message);
          } else resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getCourseByIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      id = Number(id);
      let getAllBundleQuery =
        "SELECT id, name, description, category FROM course WHERE id = ?;";

      db.query(getAllBundleQuery, [id], (err, bundle) => {
        if (err) reject(err?.message);
        else resolve(bundle);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getBundleDataFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT * FROM enrolled_bundle WHERE id = ?";
      db.query(getQuery, [id], (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          Promise.all(
            JSON.parse(result[0]?.all_courses || '[]').map(async (id) => {
              return await getCourseByIdFromDb(id);
            })
          )
            .then((allCourses) => {
              console.log(result);
              resolve({ bundle: result, courses: allCourses.flat(1) });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    } catch (error) {
      return reject(err?.message);
    }
  });
}

export function startBundleCourse(data) {
  return new Promise((resolve, reject) => {
    try {
      const { course_id, enrolled_bundle_id } = data;
      let getQuery = "SELECT * FROM enrolled_bundle WHERE id = ?";
      db.query(getQuery, [enrolled_bundle_id], (err, result) => {
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

export function getOneCourseFromBundleCourse(data) {
  return new Promise((resolve, reject) => {
    try {
      const { course_id, bundleId } = data;
      let getQuery = "SELECT * FROM enrolled_bundle WHERE id = ?;";

      db.query(getQuery, [bundleId], (err, bundle) => {
        if (err) reject(err?.message);
        else {
          let course = JSON.parse(bundle[0].unfinished_course).find(
            (id) => id == course_id
          );
          resolve({
            course_id: course,
          });
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getCourseByCourseIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT * FROM course WHERE id = ?;";

      db.query(getQuery, [id], (err, course) => {
        if (err) reject(err?.message);
        else {
          resolve(course);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getExamByCourseId(data) {
  return new Promise((resolve, reject) => {
    const { course_id, bundle_id, user_id } = data;
    let insertQuery =
      "INSERT INTO bundle_exam_attempts (enrolled_bundle_id,course_id,user_id) VALUES (?,?,?)";
    db.query(insertQuery, [bundle_id, course_id, user_id], (err, result) => {
      if (err) throw err;
    });
    let getQuestionsQuery = "SELECT * FROM exams WHERE course_id = ? LIMIT 1;";
    db.query(getQuestionsQuery, [course_id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function updateBundleProgress(id, course_id, per) {
  return new Promise((resolve, reject) => {
    let getQuery = "SELECT * FROM enrolled_bundle WHERE id = ?";
    db.query(getQuery, [id], (err, result) => {
      if (err) return reject(err?.message);
      else {
        try {
          let color = "";
          if (per >= 50) {
            color = "yellow";
          } else if (per >= 80) {
            color = "green";
          }
          console.log(id);
          console.log(result);
          let finished = JSON.parse(result[0].finished_course || '[]');
          let unFinished = JSON.parse(result[0].unfinished_course).filter(
            (id) => id != course_id
          );
          if (result[0].finished_course) {
            finished.push(course_id);
          } else {
            finished = [course_id];
          }

          let updatedQuery =
            "UPDATE enrolled_bundle SET progress = ?, color = ?, finished_course = ?, unfinished_course = ? WHERE id = ?;";
          db.query(
            updatedQuery,
            [color, JSON.stringify(finished), JSON.stringify(unFinished),id],
            (err, result) => {
              if(err) console.log(err);
              else resolve();
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    });
  });
}
