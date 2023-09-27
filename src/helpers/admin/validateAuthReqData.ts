import { number, object, string } from "yup";
import { LoginData, OtpInfo } from "../../type/auth";

export function validateAdminLoginReqBody(info: LoginData) {
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
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkValidateOtpReqBody(otpReqInfo: OtpInfo) {
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
