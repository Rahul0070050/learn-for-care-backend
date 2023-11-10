import { number, object, string } from "yup";


export function validateCreateUserInfo(userData) {
  return new Promise((resolve, reject) => {
    let user = object({
      email: string().required("please provide email address").email(),
      first_name: string().required("please provide first_name"),
      last_name: string().required("please provide last_name"),
      password: string().required("please provide password"),
      phone: string().required("please provide phone"),
      country: string().required("please provide country"),
      city: string().required("please provide city"),
    });

    try {
      user
        .validate(userData)
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

export function checkValidateOtpReqBody(otpReqInfo) {
  return new Promise((resolve, reject) => {
    let otpInfo = object({
      otp: number().required("please provide otp"),
      email: string().required("please provide email address").email(),
    });

    try {
      otpInfo
        .validate(otpReqInfo)
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

export function validateBlockUserInfo(data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      id: number().required("please provide id"),
    });

    try {
      dataTemplate
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

export function validateUnBlockUserInfo(data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      id: number().required("please provide id"),
    });

    try {
      dataTemplate
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
