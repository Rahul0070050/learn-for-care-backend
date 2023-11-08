import {number} from 'yup'
export function checkGetOnGoingCourseByIdReqData(id) {
  return new Promise((resolve, reject) => {
    try {
      let courseId = number().required("please provide valid id");

      courseId.validate(id)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}
