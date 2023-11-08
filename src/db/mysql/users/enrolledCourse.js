export function addCourseToEnrolledCourse(
  courseId,
  userId,
  validity,
  userType
) {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery = `
            INSERT INTO enrolled_course VALUES (user_id, course_id, progress, validity, color, user_type) VALUES (?,?,?,?,?,?);
          `;
      db.query(
        insertQuery,
        [userId, courseId, 30, validity, "orange", userType],
        (err, result) => {
          if (err) {
            return reject(err?.message);
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
