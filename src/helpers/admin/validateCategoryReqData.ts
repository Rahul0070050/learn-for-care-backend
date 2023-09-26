import { number, object, string } from "yup";
import { categoryBody, updateCategoryBody } from "../../type/category";

export function checkCreateCategoryReqBody(body: categoryBody) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      category: string()
        .required()
        .matches(/^[a-zA-Z]+$/, { excludeEmptyString: true }),
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
        .required()
        .matches(/[a-zA-Z]+$/, { excludeEmptyString: true }),
      id: number().required(),
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
