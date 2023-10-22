import { number, object, string } from "yup";

export function checkGetSingleCourseParams(id) {
  return new Promise((resolve, reject) => {
    let paramsTemplate = number().required("please provide valid course id");
    try {
      paramsTemplate
        .validate(id)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          if (
            err?.message ===
            "this must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`)."
          ) {
            return reject("please provide a valid id");
          }
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkGetCourseByCategoryBody(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      category: string().required("please enter valid category"),
    });

    try {
      bodyTemplate
        .validate(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          return reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}
