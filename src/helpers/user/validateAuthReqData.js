import { object, string, number } from "yup";

export function validateUserInfo(userInfo) {
  return new Promise((resolve, reject) => {
    let user = object({
      email: string().required("please provide email address").email(),
      first_name: string().required("please provide first_name"),
      last_name: string().required("please provide last_name"),
      password: string().required("please provide password"),
      country: string().required("please provide country"),
      type_of_account: string().required("please provide type"),
      city: string().required("please provide city"),
    });

    try {
      user
        .validate(userInfo)
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

export function checkOtpInfo(otpReqInfo) {
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

export function validateUserLoginData(info) {
  return new Promise((resolve, reject) => {
    let checkInfo = object({
      email: string().required("please provide email address").email(),
      password: string().required("please provide password"),
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

export function checkReSendOtpInfo(info) {
  return new Promise((resolve, reject) => {
    let checkInfo = object({
      email: string().email().required("please provide email address")
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
    } catch (error) {}
  });
}

export function checkForgotPasswordInfo(info) {
  return new Promise((resolve, reject) => {
    let checkInfo = object({
      email: string().email().required("please provide email address")
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
    } catch (error) {}
  });
}
export function checkChangePasswordReqData(body) {
  return new Promise((resolve, reject) => {
    let checkInfo = object({
      email: string().email().required("please provide email"),
      password: string().required("please provide password"),
      confirmPassword: string().required("please provide confirmPassword"),
      token: string().required("please provide token"),
    });
    
    try {
      checkInfo
        .validate(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(err.message)
    }
  });
}