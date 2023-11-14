import { number, object, string } from "yup";

export function validateCreateCertificateInfo(userData) {
  return new Promise((resolve, reject) => {
    let user = object({
      user_id: number().required("please provide email user id"),
      course_name: string().required("please provide course name"),
      user_name: string().required("please provide user name"),
      percentage: number().required("please provide percentage"),
    });

    try {
      user
        .validate(userData)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function validateGetCertificateByIdInfo(data) {
  return new Promise((resolve, reject) => {
    let info = object({
      id: number().required("please provide email user id"),
    });

    try {
      info
        .validate(data)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}
