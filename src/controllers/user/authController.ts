import { Request, Response } from "express";

import {
  checkOtpInfo,
  checkReSendOtpInfo,
  validateUserInfo,
  validateUserLoginData,
} from "../../helpers/user/validateAuthReqData";
import sentOtpEmail from "../../helpers/sendOtpEmail";
import {
  activateUser,
  getOtpFromDB,
  insertUser,
  getUserByEmail,
  saveOtpToDB,
} from "../../db/mysql/users";
import {
  hashPassword,
  validatePassword,
} from "../../helpers/validatePasswords";
import { LoginData } from "../../type/auth";
import { createTokenForUser } from "../../helpers/jwt";
import { generatorOtp } from "../../utils/auth";

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
                        success: true,
                        data: {
                          code: 200,
                          message: "OTP sent check your email",
                          response: sentOtpRes,
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
                              "some error occurred please try again later",
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
        .catch((err) => {
          res.status(406).json({
            success: false,
            errors: [
              { code: 406, message: "values not acceptable", response: err },
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
  resendOtp: (req: Request, res: Response) => {
    try {
      checkReSendOtpInfo(req.body)
        .then((result: any) => {
          saveOtpToDB(result?.email)
            .then((result: any) => {
              sentOtpEmail(result.email, result.otp)
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "OTP sent check your email",
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
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "value not acceptable",
                    error: err,
                  },
                ],
                errorType: "client",
              });
            });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            errors: [
              {
                code: 406,
                message: "value not acceptable",
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
  validateOtp: (req: Request, res: Response) => {
    try {
      checkOtpInfo(req.body)
        .then(async (result: any) => {
          getOtpFromDB(result.email)
            .then((otp: any) => {
              if (otp.length <= 0) {
                return res.status(406).json({
                  success: false,
                  errors: [
                    {
                      code: 406,
                      message: "this user not exist",
                      error: "this email is not exist in our database",
                    },
                  ],
                  errorType: "client",
                });
              }

              otp = otp[0]?.otp;

              if (otp == result.otp) {
                activateUser(result.email)
                  .then(() => {
                    res.status(202).json({
                      success: true,
                      data: { code: 202, message: "signup successful" },
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
                      error: "you provided otp is not correct",
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
            error: error?.message,
          },
        ],
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
                  success: false,
                  errors: [
                    {
                      code: 404,
                      message: "you provided an in valid email",
                      error: "this email is not exist in our database",
                    },
                  ],
                  errorType: "client",
                });
              } else {
                userData = userData[0];
                validatePassword(loginInfo.password, userData.password)
                  .then((result) => {
                    if (result) {
                      createTokenForUser(userData).then((token: any) => {
                        res.status(200).json({
                          success: true,
                          data: {
                            code: 200,
                            jwt_access_token: token.accessToken,
                            jwt_refresh_token: token.reFreshToken,
                            message: "login successful",
                          },
                        });
                      });
                    } else {
                      res.status(406).json({
                        success: false,
                        errors: [
                          {
                            code: 406,
                            message: "password is incorrect",
                            error: "password is not matching",
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
            error: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
};
