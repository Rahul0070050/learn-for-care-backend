import { Request, Response } from "express";
import {
  checkOtpInfo,
  validateUserInfo,
  validateUserLoginData,
} from "../helpers/userHelper";
import { sentEmail } from "../helpers/sendEmail";
import { activateUser, getOtp, insertUser, loginUser } from "../db/mysql/users";
import { hashPassword, validatePassword } from "../helpers/validatePassowrds";
import { LoginData } from "../type/user";
import { createToken } from "../helpers/jwt";

export const userController = {
  signup: (req: Request, res: Response) => {
    try {
      validateUserInfo(req.body)
        .then((result: any) => {
          hashPassword(result.password).then((hashedPassword) => {
            let otp = Number((Math.random() + "").substring(2, 8));
            result.password = hashedPassword;

            insertUser(result, otp)
              .then(() => {
                sentEmail(result.email, otp).then((sentOtpRes) => {
                  res.status(200).json({
                    ok: true,
                    message: "OTP sent check your email",
                    response: sentOtpRes,
                  });
                });
              })
              .catch((err) => {
                res.status(406).json({
                  ok: false,
                  error: err,
                  message: "values not acceptable",
                });
              });
          });
        })
        .catch((err) => {
          res
            .status(400)
            .json({ ok: false, message: "values not acceptable", error: err });
        });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: "some error occurred in the server try again after some times",
        error: error?.message,
      });
    }
  },
  resentOtp: (req: Request, res: Response) => {},
  validateOtp: (req: Request, res: Response) => {
    try {
      checkOtpInfo(req.body)
        .then(async (result: any) => {
          getOtp(result.email).then((otp: any) => {
            otp = otp[0]?.otp;

            if (otp == result.otp) {
              activateUser(result.email)
                .then(() => {
                  res
                    .status(406)
                    .json({ ok: true, message: "signup successful" });
                })
                .catch((err) => {
                  res.status(500).json({
                    ok: false,
                    message: "some error occurs",
                    error: err,
                  });
                });
            } else {
              res.status(406).json({ ok: false, message: "incorrect otp" });
            }
          });
        })
        .catch((err) => {
          res
            .status(406)
            .json({ ok: false, message: "values not acceptable", error: err });
        });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: "some error occurred in the server try again after some times",
        error: error?.message,
      });
    }
  },
  login: (req: Request, res: Response) => {
    try {
      validateUserLoginData(req.body)
        .then((loginInfo: any) => {
          loginUser(loginInfo as LoginData)
            .then((userData: any) => {
              if (userData.length <= 0) {
                res.status(404).json({
                  ok: false,
                  message: "user not found",
                });
              } else {
                userData = userData[0];
                validatePassword(loginInfo.password, userData.password).then(
                  (result) => {
                    if (result) {
                      createToken(userData).then((token) => {
                        res.status(200).json({
                          ok: true,
                          jwt: token,
                          message: "login successful",
                        });
                      });
                    } else {
                      res
                        .status(201)
                        .json({ ok: false, message: "password is incorrect" });
                    }
                  }
                );
              }
            })
            .catch((err) => {
              res.status(406).json({
                ok: false,
                message: err,
              });
            });
        })
        .catch((err) => {
          res
            .status(406)
            .json({ ok: false, message: "values not acceptable", error: err });
        });
    } catch (error: any) {}
  },
};
