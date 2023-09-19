import { LoginData, OtpInfo, User } from "../type/user";
import { object, string, number, date, InferType } from "yup";

export function validateUserInfo(userInfo: User) {
  return new Promise((resolve, reject) => {
    let user = object({
      username: string().required(),
      address: string().required(),
      email: string().required().email(),
      phone: number().required(),
      password: string().required(),
      country: string().required(),
      type: string().required(),
      city: string().required(),
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
      otp: number().required(),
      email: string().required().email(),
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
      email: string().required().email(),
      password: string().required(),
    });

    try {
      checkInfo.validate(info).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err?.message)
      })
    } catch (error: any) {
      reject(error?.message)
    }
  });
}
