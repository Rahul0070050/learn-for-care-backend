import { db } from "../../../conf/mysql.js";

export function addNewCourse(courseData) {
  return new Promise((resolve, reject) => {
    try {
      let resource = JSON.stringify(courseData.resource);
      console.log(resource);
      let insertCourseQuery =
        "INSERT INTO course(name,description,category,price,intro_video,thumbnail,video,ppt,resource) VALUES(?,?,?,?,?,?,?,?,?);";
      db.query(
        insertCourseQuery,
        [
          courseData.name,
          courseData.description,
          courseData.category,
          courseData.price,
          courseData.intro_video,
          courseData.thumbnail,
          courseData.video,
          courseData.ppt,
          resource,
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

export function getCourseByIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getCourseByIdQuery = "SELECT * FROM course WHERE id = ?;";
      db.query(getCourseByIdQuery, [id], (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          if (result.length <= 0) {
            return reject("No course Found");
          } else {
            return resolve(result);
          }
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
      let getCourseByCategoryQuery = "SELECT * FROM course;";
      db.query(getCourseByCategoryQuery, (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          if (!result[0]) {
            return reject("No courses Found");
          }
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
      let updateCourseDataQuery =
        "UPDATE course SET name = ?, category = ?, price = ?, description = ? WHERE id = ?;";
      db.query(
        updateCourseDataQuery,
        [
          courseInfo.name,
          courseInfo.category,
          courseInfo.price,
          courseInfo.description,
          courseInfo.course_id,
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
