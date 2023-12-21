import { object, string, number } from "yup";

export function validateUserInfo(userInfo) {
  return new Promise((resolve, reject) => {
    let user = object({
      email: string().required("Please Provide Email Address").email(),
      first_name: string().required("Please Provide First Name"),
      last_name: string().required("Please Provide Last name"),
      password: string().required("Please Provide Password"),
      phone: string().required("Please Provide Phone"),
      country: string().required("Please Provide Country"),
      type_of_account: string().required("Please Provide Type"),
      city: string().required("Please Provide City"),
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
      otp: number().required("Please Provide Otp"),
      email: string().required("Please Provide Email Address").email(),
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
      email: string().required("Please Provide Email Address").email(),
      password: string().required("Please Provide Password"),
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
      email: string().email().required("Please Provide Email Address")
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
      password: string().required("please provide password"),
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