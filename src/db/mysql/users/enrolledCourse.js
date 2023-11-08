function addCourseToEnrolledCourse(id,userId) {
    return new Promise((resolve, reject) => {
        try {
          let insertQuery = `
            INSERT INTO enrolled_course VALUES (user_id, course_id, progress, validity, color, user_type) VALUES (?,?,?,?,?,?)
          `;
          db.query(insertQuery, [userId,id,30,], (err, result) => {
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