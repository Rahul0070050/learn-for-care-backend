import { db } from "../../../conf/mysql.js";

export function insertNewBundle(bundle) {
  console.log(bundle);
  let { name, description, courses, price, image } = bundle;
  courses = JSON.stringify(courses);
  return new Promise((resolve, reject) => {
    try {
      let insertBundleQuery =
        "INSERT INTO course_bundle (name,description,courses,price,image) VALUES(?,?,?,?,?);";

      db.query(
        insertBundleQuery,
        [name, description, courses, price, image],
        (err, course) => {
          if (err) reject(err?.message);
          else resolve({});
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getCourseBundleById(id) {
  return new Promise((resolve, reject) => {
    try {
      let insertBundleQuery = "SELECT * FROM course_bundle WHERE id = ?;";

      db.query(insertBundleQuery, [id], (err, bundle) => {
        if (err) reject(err?.message);
        else resolve(bundle);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
