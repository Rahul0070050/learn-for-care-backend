import { number, object } from "yup";

export function checkAddToCartReqBody(id) {
  return new Promise((resolve, reject) => {
    let course = number().required("please provide course id");
    try {
      course
        .validate(id)
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

export function checkUpdateCartCountReqBody(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      course_id: number().required("please provide course id"),
      identifier: number().required("please provide identifier")
    });
    try {
      bodyTemplate
        .validate(body)
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

export function checkDeleteCorseFromCartReqBody(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      cart_id: number().required("please provide course id"),
    });
    try {
      bodyTemplate
        .validate(body)
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