import { number, object, string } from "yup";

export function validateCreateCouponInfo(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      coupon_code: string().required("please enter coupon code"),
      valid_till: string().required("please enter valid till"),
      coupon_type: string().required("please enter coupon type"),
      minimum_purchase: number().required("please enter minimum purchase"),
      amount: number().required("please enter amount")
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

export function validateEditCouponInfo(body) {
    return new Promise((resolve, reject) => {
      let bodyTemplate = object({
        id: number().required("please enter id"),
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