export function getOnGoingCourseByIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getOnGoingCourseByIdQuery =
        "SELECT * FROM enrolled_course WHERE id = ?;";
      db.query(getOnGoingCourseByIdQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllOnGoingCourseByUserIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getOnGoingCourseByIdQuery =
        "SELECT * FROM enrolled_course WHERE user_id = ?;";
      db.query(getOnGoingCourseByIdQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllFinishedCourseByUserIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getOnGoingCourseByIdQuery =
        "SELECT * FROM enrolled_course WHERE user_id = ?;";
      db.query(getOnGoingCourseByIdQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
