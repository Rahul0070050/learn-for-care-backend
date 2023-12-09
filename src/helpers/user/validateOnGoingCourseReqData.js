import { number, object } from "yup";
export function checkGetOnGoingCourseByIdReqData(id) {
  return new Promise((resolve, reject) => {
    try {
      let courseId = number().required("please provide valid id");

      courseId
        .validate(id)
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

export function validateGetCourseAttemptsById(id) {
  return new Promise((resolve, reject) => {
    try {
      let data = object({
        id: number().required("please provide valid id"),
      });

      data
        .validate(id)
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
