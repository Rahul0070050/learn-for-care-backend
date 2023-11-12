export function getAssignedCourseById(id) {
    return new Promise((resolve, reject) => {
      try {
        let getCourseByIdQuery = `SELECT * FROM assigned_course WHERE id = ?;`;
        db.query(
          getCourseByIdQuery,
          [id],
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