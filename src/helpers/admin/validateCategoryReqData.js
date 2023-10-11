import { number, object, string } from "yup";

export function checkCreateCategoryReqBody(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      category: string().required("please enter category"),
    });

    try {
      bodyTemplate
        .validate(body)
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

export function checkUpdateCategoryReqBody(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      category: string().required("please enter category"),
      id: number().required("please enter category id"),
    });

    try {
      bodyTemplate
        .validate(body)
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
