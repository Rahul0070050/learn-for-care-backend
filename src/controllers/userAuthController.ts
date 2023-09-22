import { Request, Response } from "express";

import {
  checkOtpInfo,
  checkReSendOtpInfo,
  validateUserInfo,
  validateUserLoginData,
} from "../helpers/user/validateAuthReqData";
import sentOtpEmail from "../helpers/sendOtpEmail";
import {
  activateUser,
  getOtpFromDB,
  insertUser,
  getUserByEmail,
  saveOtpToDB,
} from "../db/mysql/users";
import { hashPassword, validatePassword } from "../helpers/validatePasswords";
import { LoginData } from "../type/auth";
import { createTokenForUser } from "../helpers/jwt";
import { generatorOtp } from "../utils/auth";

export const userAuthController = {
  signup: (req: Request, res: Response) => {
    try {
      validateUserInfo(req.body)
        .then((result: any) => {
          hashPassword(result.password)
            .then(async (hashedPassword) => {
              let otp = await Number(generatorOtp());
              result.password = hashedPassword;
              insertUser(result, otp)
                .then(() => {
                  sentOtpEmail(result.email, otp)
                    .then((sentOtpRes) => {
                      res.status(200).json({
                        ok: true,
                        message: "OTP sent check your email",
                        response: sentOtpRes,
                      });
                    })
                    .catch((err) => {
                      res.status(500).json({
                        ok: false,
                        message: "some error occurred please try again later",
                        response: err,
                        errorType: "server",
                      });
                    });
                })
                .catch((err) => {
                  res.status(406).json({
                    ok: false,
                    response: err,
                    message: "values not acceptable",
                    errorType: "client",
                  });
                });
            })
            .catch((err) => {
              res.status(500).json({
                ok: false,
                message: "some error occurred please try again later",
                response: err,
                errorType: "server",
              });
            });
        })
        .catch((err) => {
          res.status(406).json({
            ok: false,
            message: "values not acceptable",
            response: err,
            errorType: "client",
          });
        });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: "some error occurred in the server try again after some times",
        response: error?.message,
        errorType: "server",
      });
    }
  },
  resendOtp: (req: Request, res: Response) => {
    try {
      checkReSendOtpInfo(req.body)
        .then((result: any) => {
          saveOtpToDB(result?.email)
            .then((result: any) => {
              sentOtpEmail(result.email, result.otp)
                .then(() => {
                  res.status(200).json({
                    ok: true,
                    message: "OTP sent check your email",
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    ok: false,
                    message: "some error occurred please try again later",
                    response: err,
                    errorType: "server",
                  });
                });
            })
            .catch((err: any) => {
              res.status(406).json({
                ok: false,
                message: "value not acceptable",
                response: err,
                errorType: "client",
              });
            });
        })
        .catch((err) => {
          res.status(406).json({
            ok: false,
            message: "value not acceptable",
            response: err,
            errorType: "client",
          });
        });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: "some error occurred in the server try again after some times",
        response: error?.message,
        errorType: "server",
      });
    }
  },
  validateOtp: (req: Request, res: Response) => {
    try {
      checkOtpInfo(req.body)
        .then(async (result: any) => {
          getOtpFromDB(result.email)
            .then((otp: any) => {
              if (otp.length <= 0) {
                return res.status(406).json({
                  ok: false,
                  message: "this user not exist",
                  errorType: "client",
                });
              }

              otp = otp[0]?.otp;

              if (otp == result.otp) {
                activateUser(result.email)
                  .then(() => {
                    res
                      .status(202)
                      .json({ ok: true, message: "signup successful" });
                  })
                  .catch((err) => {
                    res.status(500).json({
                      ok: false,
                      message:
                        "some error occurred in the server try again after some times",
                      response: err,
                      errorType: "server",
                    });
                  });
              } else {
                res.status(406).json({
                  ok: false,
                  message: "incorrect otp",
                  errorType: "client",
                });
              }
            })
            .catch((err) => {
              res.status(500).json({
                ok: false,
                message:
                  "some error occurred in the server try again after some times",
                response: err,
                errorType: "server",
              });
            });
        })
        .catch((err) => {
          res.status(406).json({
            ok: false,
            message: "values not acceptable",
            response: err,
            errorType: "client",
          });
        });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: "some error occurred in the server try again after some times",
        response: error?.message,
        errorType: "server",
      });
    }
  },
  login: (req: Request, res: Response) => {
    try {
      validateUserLoginData(req.body)
        .then((loginInfo: any) => {
          getUserByEmail(loginInfo as LoginData)
            .then((userData: any) => {
              if (userData.length <= 0) {
                res.status(404).json({
                  ok: false,
                  message: "user not found",
                  errorType: "client",
                });
              } else {
                userData = userData[0];
                validatePassword(loginInfo.password, userData.password).then(
                  (result) => {
                    if (result) {
                      createTokenForUser(userData).then((token) => {
                        res.status(200).json({
                          ok: true,
                          jwt: token,
                          message: "login successful",
                        });
                      });
                    } else {
                      res.status(406).json({
                        ok: false,
                        message: "password is incorrect",
                        errorType: "client",
                      });
                    }
                  }).catch(err => {});
              }
            })
            .catch((err) => {
              res.status(500).json({
                ok: false,
                message:
                  "some error occurred in the server try again after some times",
                response: err,
                errorType: "server",
              });
            });
        })
        .catch((err) => {
          res.status(406).json({
            ok: false,
            message: "values not acceptable",
            response: err,
            errorType: "client",
          });
        });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: "some error occurred in the server try again after some times",
        response: error?.message,
        errorType: "server",
      });
    }
  },
};
