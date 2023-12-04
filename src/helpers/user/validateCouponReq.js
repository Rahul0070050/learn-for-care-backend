import { object, string } from "yup";

export function validateApplyCouponReq(body) {
    return new Promise((resolve, reject) => {
      let bodyTemplate = object({
        code: string().required("please provide invoice id"),
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