import { Request, Response } from "express";

import sentOtpEmail from "../helpers/sendOtpEmail";
import {
  saveOtpToDB,
  activateAdmin,
  getOtpFromDB,
  getAdminByEmail,
} from "../db/mysql/admin";
import { hashPassword, validatePassword } from "../helpers/validatePasswords";
import { createTokenForAdmin } from "../helpers/jwt";
import { getAdminEmail } from "../db/mysql/admin";
import {
  checkValidateOtpInfo,
  validateAdminLoginData,
} from "../helpers/admin/validateAuthReqData";

export const adminAuthController = {
  login: (req: Request, res: Response) => {
    try {
      validateAdminLoginData(req.body)
        .then((loginInfo: any) => {
          getAdminByEmail(loginInfo?.email)
            .then((adminData: any) => {
              if (adminData?.length <= 0) {
                res.status(404).json({
                  ok: false,
                  message: "invalid email",
                  errorType: "client",
                });
              } else {
                adminData = adminData[0];
                validatePassword(loginInfo.password, adminData.password).then(
                  (result) => {
                    if (result) {
                      createTokenForAdmin(adminData)
                        .then((token) => {
                          res.status(200).json({
                            ok: true,
                            jwt: token,
                            message: "login successful",
                          });
                        })
                        .catch((err) => {
                          res.status(500).json({
                            ok: false,
                            message:
                              "some error occurred in the server try again after some times",
                            errorType: "server",
                          });
                        });
                    } else {
                      res.status(406).json({
                        ok: false,
                        message: "password is incorrect",
                        errorType: "client",
                      });
                    }
                  }
                );
              }
            })
            .catch((err) => {
              res.status(406).json({
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
  resendOtp: (req: Request, res: Response) => {
    try {
      getAdminEmail()
        .then((result: any) => {
          let email = result[0].email;
          saveOtpToDB(email)
            .then((result: any) => {
              sentOtpEmail(email, result.otp)
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
              res.status(500).json({
                ok: false,
                message: "some error occurred please try again later",
                response: err,
                errorType: "server",
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
      checkValidateOtpInfo(req.body)
        .then((result: any) => {
          getOtpFromDB(result?.email)
            .then((otp: any) => {
              if (otp.length <= 0) {
                return res.status(406).json({
                  ok: false,
                  message: "invalid email",
                  errorType: "client",
                });
              }

              otp = otp[0]?.otp;

              if (otp == result.otp) {
                activateAdmin(result.email)
                  .then(() => {
                    res
                      .status(202)
                      .json({ ok: true, message: "login successful" });
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
};
