import { number, object, string } from "yup";
import { categoryBody, updateCategoryBody } from "../../type/category";

export function checkCreateCategoryReqBody(body: categoryBody) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      category: string()
        .required("please enter category"),
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
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkUpdateCategoryReqBody(body: updateCategoryBody) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      category: string()
        .required("please enter category"),
      id: number().required("please enter category id"),
    });

    try {
      bodyTemplate
        .validate(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}
