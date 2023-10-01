import { LoginData, OtpInfo, User, ResentOtpInfo } from "../../type/auth";
import { object, string, number, date, InferType } from "yup";

export function validateUserInfo(userInfo: User) {
  return new Promise((resolve, reject) => {
    let user = object({
      email: string().required("please provide email address").email(),
      name: string().required("please provide username"),
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
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkOtpInfo(otpReqInfo: OtpInfo) {
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
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function validateUserLoginData(info: LoginData) {
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
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkReSendOtpInfo(info: ResentOtpInfo) {
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
        .catch((err: any) => {
          reject(err?.message);
        });
    } catch (error: any) {}
  });
}
