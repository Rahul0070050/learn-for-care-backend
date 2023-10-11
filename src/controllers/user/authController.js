import {
  checkOtpInfo,
  checkReSendOtpInfo,
  validateUserInfo,
  validateUserLoginData,
} from "../../helpers/user/validateAuthReqData.js";
import sentOtpEmail from "../../helpers/sendOtpEmail.js";
import {
  activateUser,
  getOtpFromDB,
  insertUser,
  getUserByEmail,
  saveOtpToDB,
} from "../../db/mysql/users.js";
import {
  hashPassword,
  validatePassword,
} from "../../helpers/validatePasswords.js";
import { createTokenForUser } from "../../helpers/jwt.js";
import { generatorOtp } from "../../utils/auth.js";

export const userAuthController = {
  signup: (req, res) => {
    try {
      validateUserInfo(req.body)
        .then((result) => {
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
    } catch (error) {
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
  resendOtp: (req, res) => {
    try {
      checkReSendOtpInfo(req.body)
        .then((result) => {
          saveOtpToDB(result?.email)
            .then((result) => {
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
    } catch (error) {
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
  validateOtp: (req, res) => {
    try {
      checkOtpInfo(req.body)
        .then(async (result) => {
          getOtpFromDB(result.email)
            .then((otp) => {
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
    } catch (error) {
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
  login: (req, res) => {
    try {
      validateUserLoginData(req.body)
        .then((loginInfo) => {
          getUserByEmail(loginInfo)
            .then((userData) => {
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
                      createTokenForUser(userData).then((token) => {
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
    } catch (error) {
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
