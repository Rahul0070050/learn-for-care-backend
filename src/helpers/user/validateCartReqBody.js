import yup, { array, number, object } from "yup";

export function checkAddToCartReqBody(ids) {
  return new Promise((resolve, reject) => {
    let course = yup.array().of(
      yup.object().shape({
        count: yup.number().required("Count is required"),
        id: yup.number().required("ID is required"),
      })
    );
    try {
      course
        .validate(ids)
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
      identifier: number().required("please provide identifier"),
      count: number().required("please provide count"),
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
