import { number, object, string, boolean } from "yup";

export function validateCreateCouponInfo(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      coupon_code: string().required("please enter coupon code"),
      valid_till: string().required("please enter valid till"),
      coupon_type: string().required("please enter coupon type"),
      minimum_purchase: number().required("please enter minimum purchase"),
      amount: number().required("please enter amount"),
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
      coupon_id: number().required("please enter minimum purchase"),
      coupon_code: string().required("please enter coupon code"),
      valid_till: string().required("please enter valid till"),
      coupon_type: string().required("please enter coupon type"),
      minimum_purchase: number().required("please enter minimum purchase"),
      amount: number().required("please enter amount"),
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

export function validateDeleteCouponInfo(body) {
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

export function validateCreateVolumeCouponInfo(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      coupon_code: string().required("please enter coupon_code"),
      max_val: string().required("please enter max_val"),
      min_val: string().required("please enter min_val"),
      percent: number().required("please enter amount"),
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

export function validateUpdateVolumeCouponInfo(data) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      coupon_id: number().required("please enter coupon id"),
      coupon_code: string().required("please enter coupon_code"),
      max_val: string().required("please enter max_val"),
      min_val: string().required("please enter min_val"),
      amount: number().required("please enter amount"),
    });

    try {
      bodyTemplate
        .validate(data)
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

export function validateCreateOfferTextInfo(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      offer_text: string().required("please enter offer text"),
      hight_light_text: string().required("please enter hight_light_text"),
      is_active: boolean().required("please provide is active status"),
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

export function validateDeleteOfferTextInfo(data) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      id: number().required("please enter id"),
    });

    try {
      bodyTemplate
        .validate(data)
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
