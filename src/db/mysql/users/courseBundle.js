import { db } from "../../../conf/mysql.js";
import { getAssignedCourseById } from "./assignedCourse.js";
import { getPurchasedCourseById } from "./course.js";

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
    } else {
      course = await getPurchasedCourseById(bundle_id);
      decrementTheCourseCountQuery = `UPDATE purchased_course SET course_count = course_count - 1 WHERE id = ?`;
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
      } = data;
      console.log(
        bundle_name,
        bundle_id,
        user_id,
        course_count,
        validity,
        unfinished_course
      );

      let setQuery = `INSERT INTO enrolled_bundle (bundle_name, bundle_id, user_id, course_count, validity, unfinished_course) VALUES (?,?,?,?,?,?)`;
      db.query(
        setQuery,
        [
          bundle_name,
          bundle_id,
          user_id,
          course_count,
          new Date(validity),
          JSON.stringify(unfinished_course),
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            reject(err?.message);
          } else resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}
