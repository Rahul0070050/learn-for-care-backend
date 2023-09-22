import { number, object, string } from "yup";
import { LoginData, OtpInfo } from "../../type/auth";

export function validateAdminLoginData(info: LoginData) {
  return new Promise((resolve, reject) => {
    let checkInfo = object({
      email: string().required().email(),
      password: string().required(),
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

export function checkValidateOtpInfo(otpReqInfo: OtpInfo) {
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
