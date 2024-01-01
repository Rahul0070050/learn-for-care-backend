import { number, object, string } from "yup";

export function validateAdminLoginReqBody(info) {
  return new Promise((resolve, reject) => {
    let checkInfo = object({
      email: string().required("please enter email address").email(),
      password: string().required("please enter password"),
    });

    try {
      checkInfo
        .validate(info)
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

export function checkValidateOtpReqBody(otpReqInfo) {
  return new Promise((resolve, reject) => {
    let otpInfo = object({
      otp: number().required("please provide otp"),
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


export function checkChangePasswordReqBody(data) {
  return new Promise((resolve, reject) => {
    let otpInfo = object({
      password: string().required("please provide password"),
    });

    try {
      otpInfo
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