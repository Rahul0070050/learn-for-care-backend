import { db } from "../../../conf/mysql.js";

export function insertNewBundle(bundle) {
  console.log(bundle);
  let { name, category, description, courses, price, image } = bundle;
  return new Promise((resolve, reject) => {
    try {
      let insertBundleQuery =
        "INSERT INTO course_bundle (name,category,description,courses,price,image) VALUES(?,?,?,?,?,?);";

      db.query(
        insertBundleQuery,
        [name, category, description, courses, price, image],
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

export function getAllBundles() {
  return new Promise((resolve, reject) => {
    try {
      let getBundleQuery = "SELECT * FROM course_bundle;";

      db.query(getBundleQuery, (err, bundle) => {
        if (err) reject(err?.message);
        else resolve(bundle);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function deleteBundleFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let deleteQuery = "DELETE FROM course_bundle WHERE id = ?;";

      db.query(deleteQuery, [id], (err, bundle) => {
        if (err) reject(err?.message);
        else resolve(bundle);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function EditBundleFromDb(data) {
  return new Promise((resolve, reject) => {
    const { id, name, description, courses, price } = data;
    try {
      let deleteQuery =
        "UPDATE course_bundle SET name = ?, description = ?, courses = ?, price = ? WHERE id = ?;";

      db.query(
        deleteQuery,
        [name, description, courses, price, id],
        (err, bundle) => {
          if (err) reject(err?.message);
          else resolve(bundle);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}
