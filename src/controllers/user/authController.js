import { config } from "dotenv";
import Cryptr from "cryptr";
import {
  checkChangePasswordReqData,
  checkForgotPasswordInfo,
  checkOtpInfo,
  checkReSendOtpInfo,
  validateUserInfo,
  validateUserLoginData,
} from "../../helpers/user/validateAuthReqData.js";
import sentOtpEmail, {
  sendOtpEmailByTrap,
} from "../../helpers/sendOtpEmail.js";
import {
  activateUser,
  getOtpFromDB,
  insertUser,
  getUserByEmail,
  saveOtpToDB,
  updateUserPassword,
} from "../../db/mysql/users/users.js";
import {
  hashPassword,
  validatePassword,
} from "../../helpers/validatePasswords.js";
import { createTokenForUser } from "../../helpers/jwt.js";
import { generatorOtp } from "../../utils/auth.js";
import {
  generateChangePassToken,
  validateChangePassToken,
} from "../../helpers/genarateToken.js";
import sendLinkToChangePasswordEmail from "../../helpers/sendForgotPassLink.js";
import sendWelcomeEmail, {
  sendWelcomeEmailByTrap,
} from "../../helpers/welcomEmail.js";

config();
let cryptr = new Cryptr(process.env.CRYPTER);

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
                .then(({ otp }) => {
                  sendOtpEmailByTrap(result.email, otp)
                    .then((sentOtpRes) => {
                      console.log(otp);
                      res.status(200).json({
                        success: true,
                        data: {
                          code: 200,
                          message: "OTP Sent Check Your Email",
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
                  console.log(err);
                  res.status(406).json({
                    success: false,
                    errors: [
                      {
                        code: 406,
                        message: "Values Not Acceptable",
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
              sendOtpEmailByTrap(result.email, result.otp)
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
                      message: "This User Not Exist",
                      error: "This Email Is Not Exist In Our Database",
                    },
                  ],
                  errorType: "client",
                });
              }

              otp = otp[0]?.otp;
              console.log(otp, result.otp);
              if (otp == result.otp) {
                activateUser(result.email)
                  .then(async () => {
                    await sendWelcomeEmailByTrap(result.email);
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
                res.status(406).json({
                  success: false,
                  errors: [
                    {
                      code: 406,
                      message: "You Provided An In Valid Email",
                      error: "Email Is Not Registered",
                    },
                  ],
                  errorType: "client",
                });
              } else {
                userData = userData[0];
                validatePassword(loginInfo.password, userData.password)
                  .then(async (result) => {
                    if (result) {
                      console.log(userData);
                      let token = await createTokenForUser(userData);
                      res.status(200).json({
                        success: true,
                        data: {
                          code: 200,
                          jwt_access_token: token.accessToken,
                          jwt_refresh_token: token.reFreshToken,
                          userType: userData.type_of_account,
                          message: "login successful",
                        },
                      });
                    } else {
                      res.status(406).json({
                        success: false,
                        errors: [
                          {
                            code: 406,
                            message: "Password Is Incorrect",
                            error: "Password Is Not Matching",
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
                message: "Values Not Acceptable",
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
  forgotPassword: (req, res) => {
    try {
      checkForgotPasswordInfo(req.body)
        .then(async (result) => {
          let user = await getUserByEmail({ email: result.email });
          console.log(user);
          if (user.length <= 0) {
            res.status(406).json({
              success: false,
              errors: [
                {
                  code: 406,
                  message: "Please provide a registered email",
                  error: "This user is not exist",
                },
              ],
              errorType: "Client",
            });
          } else {
            generateChangePassToken(result)
              .then(async (token) => {
                // let newToken = token.split(".").join("$");
                let newToken = cryptr.encrypt(token);
                let newEmail = cryptr.encrypt(result.email);
                let url =
                  process.env.FRONT_END_FORGOT_PASSWORD_URL +
                  newToken +
                  "$" +
                  newEmail;
                sendLinkToChangePasswordEmail(result.email, url)
                  .then(() => {
                    res.status(200).json({
                      success: true,
                      data: {
                        code: 200,
                        response: "check your email",
                        message: "successfully sent link",
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
                message: "value not acceptable",
                error: err,
              },
            ],
            errorType: "server",
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
  changePassword: (req, res) => {
    try {
      checkChangePasswordReqData(req.body)
        .then((result) => {
          let values = result.token.split("$");
          let token = cryptr.decrypt(values[0]);
          let email = cryptr.decrypt(values[1]);
          validateChangePassToken(token)
            .then(async () => {
              let user = await getUserByEmail({ email });
              console.log(result.password, user[0].password);
              validatePassword(result.password, user[0].password).then(
                (passwordVall) => {
                  if (passwordVall) {
                    res.status(406).json({
                      success: false,
                      errors: [
                        {
                          code: 406,
                          message:
                            "Your new password cannot be the same as your previous password",
                          error: "",
                        },
                      ],
                      errorType: "server",
                    });
                  } else {
                    hashPassword(result.password).then((hash) => {
                      updateUserPassword(email, hash)
                        .then(() => {
                          res.status(200).json({
                            success: true,
                            data: {
                              code: 200,
                              response: "",
                              message: "password updated",
                            },
                          });
                        })
                        .catch((err) => {
                          res.status(406).json({
                            success: false,
                            errors: [
                              {
                                code: 406,
                                message: "password not updated",
                                error: err,
                              },
                            ],
                            errorType: "server",
                          });
                        });
                    });
                  }
                }
              );
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "token timed out",
                    error: "token is invalid",
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
