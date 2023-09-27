import { Request, Response } from "express";

import sentOtpEmail from "../../helpers/sendOtpEmail";
import {
  saveOtpToDB,
  activateAdmin,
  getOtpFromDB,
  getAdminByEmail,
} from "../../db/mysql/admin/auth";
import { validatePassword } from "../../helpers/validatePasswords";
import { createTokenForAdmin } from "../../helpers/jwt";
import { getAdminEmail } from "../../db/mysql/admin/auth";
import {
  checkValidateOtpReqBody,
  validateAdminLoginReqBody,
} from "../../helpers/admin/validateAuthReqData";

export const adminAuthController = {
  login: (req: Request, res: Response) => {
    try {
      validateAdminLoginReqBody(req.body)
        .then((loginInfo: any) => {
          getAdminByEmail(loginInfo?.email)
            .then((adminData: any) => {
              if (adminData?.length <= 0) {
                res.status(404).json({
                  success: false,
                  errors: [
                    {
                      code: 404,
                      message:
                        "this email is invalid please provide valid email",
                      error: "email in incorrect",
                    },
                  ],
                  errorType: "client",
                });
              } else {
                adminData = adminData[0];
                validatePassword(loginInfo.password, adminData.password).then(
                  (result) => {
                    if (result) {
                      createTokenForAdmin(adminData)
                        .then((token: any) => {
                          res.status(200).json({
                            success: true,
                            data: {
                              code: 200,
                              jwt_access_token: token.accessToken,
                              jwt_re_fresh_token: token.reFreshToken,
                              message: "login successful",
                            },
                          });
                        })
                        .catch((err) => {
                          res.status(500).json({
                            success: false,
                            errors: [
                              {
                                code: 500,
                                error: err,
                                message:
                                  "some error occurred in the server try again after some times",
                              },
                            ],
                            errorType: "server",
                          });
                        });
                    } else {
                      res.status(406).json({
                        success: false,
                        errors: [
                          {
                            code: 406,
                            message: "the password is incorrect",
                            error: "password not matching",
                          },
                        ],
                        errorType: "client",
                      });
                    }
                  }
                );
              }
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message:
                      "some error occurred in the server try again after some times",
                    error: err,
                  },
                ],
                errorType: "server",
              });
            });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            errors: [
              {
                code: 406,
                message: "values not acceptable",
                error: err,
              },
            ],
            errorType: "client",
          });
        });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message:
              "some error occurred in the server try again after some times",
            error: error?.message,
          },
        ],
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
                    success: true,
                    data: {
                      code: 200,
                      message: "OTP sent to the email",
                    },
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    success: false,
                    errors: [
                      {
                        code: 500,
                        message: "some error occurred please try again later",
                        error: err,
                      },
                    ],
                    errorType: "server",
                  });
                });
            })
            .catch((err: any) => {
              res.status(500).json({
                success: false,
                errors: [
                  {
                    code: 500,
                    message: "some error occurred please try again later",
                    error: err,
                  },
                ],
                errorType: "server",
              });
            });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            errors: [
              {
                code: 500,
                message: "some error occurred please try again later",
                error: err,
              },
            ],
            errorType: "server",
          });
        });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message:
              "some error occurred in the server try again after some times",
            error: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
  validateOtp: (req: Request, res: Response) => {
    try {
      checkValidateOtpReqBody(req.body)
        .then((result: any) => {
          getOtpFromDB(result?.email)
            .then((otp: any) => {
              if (otp.length <= 0) {
                return res.status(406).json({
                  success: false,
                  errors: [
                    {
                      code: 406,
                      message: "invalid email",
                      error: "this email is not exist in our database",
                    },
                  ],
                  errorType: "client",
                });
              }

              otp = otp[0]?.otp;

              if (otp == result.otp) {
                activateAdmin(result.email)
                  .then(() => {
                    res.status(202).json({
                      success: true,
                      data: {
                        code: 202,
                        message: "otp validation successful",
                      },
                    });
                  })
                  .catch((err) => {
                    res.status(500).json({
                      success: false,
                      errors: [
                        {
                          code: 500,
                          message:
                            "some error occurred in the server try again after some times",
                          error: err,
                        },
                      ],
                      errorType: "server",
                    });
                  });
              } else {
                res.status(406).json({
                  success: false,
                  errors: [
                    {
                      code: 406,
                      message: "incorrect otp",
                      error: "you provided otp is incorrect",
                    },
                  ],
                  errorType: "client",
                });
              }
            })
            .catch((err) => {
              res.status(500).json({
                success: false,
                errors: [
                  {
                    code: 500,
                    message:
                      "some error occurred in the server try again after some times",
                    error: err,
                  },
                ],
                errorType: "server",
              });
            });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            errors: [
              {
                code: 406,
                message: "values not acceptable",
                error: err,
              },
            ],
            errorType: "client",
          });
        });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message:
              "some error occurred in the server try again after some times",
            response: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
};
