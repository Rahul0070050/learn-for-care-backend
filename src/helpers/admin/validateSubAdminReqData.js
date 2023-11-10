import { object, string } from "yup";

export function checkCreateSubAdminReqData(info) {
  return new Promise((resolve, reject) => {
    let checkInfo = object({
      email: string().required("please enter email address").email(),
      password: string().required("please enter password"),
      name: string().required("please enter name"),
    });

    try {
      checkInfo
        .validate(info)
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

export function checkDeleteSubAdminReqData(info) {
  return new Promise((resolve, reject) => {
    let checkInfo = object({
      id: number().required("please provide id"),
    });

    try {
      checkInfo
        .validate(info)
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