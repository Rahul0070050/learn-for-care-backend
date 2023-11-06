import yup, { string, number, object } from "yup";

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

export function checkAddBundleToCartReqBody(id) {
  return new Promise((resolve, reject) => {
    let bundleId = number().required("bundleId is required");
    try {
      bundleId
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
      id: number().required("please provide course id"),
      type: string().required("please provide type"),
      count: number().required("please provide count"),
      courseId: number().required("please provide course id"),
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
