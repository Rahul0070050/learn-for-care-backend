import { getAllAssignedCourses } from "../../db/mysql/subAdmin/assignedCourse.js";
import { getSubUserByEmail } from "../../db/mysql/subUser/auth.js";

import { createTokenForUser } from "../../helpers/jwt.js";
import { validateSubUserLoginReqBody } from "../../helpers/subUser/validateAuthReqData.js";
import { validatePassword } from "../../helpers/validatePasswords.js";
import { getUser } from "../../utils/auth.js";

export const subUserController = {
  login: (req, res) => {
    try {
      validateSubUserLoginReqBody(req.body)
        .then((loginInfo) => {
          getSubUserByEmail(loginInfo?.email)
            .then((userData) => {
              if (userData?.length <= 0) {
                res.status(406).json({
                  success: false,
                  errors: [
                    {
                      code: 406,
                      message:
                        "this email is invalid please provide valid email",
                      error: "email in incorrect",
                    },
                  ],
                  errorType: "client",
                });
              } else {
                userData = userData[0];
                validatePassword(loginInfo.password, userData.password).then(
                  (result) => {
                    if (result) {
                      createTokenForUser(userData)
                        .then((token) => {
                          res.status(200).json({
                            success: true,
                            data: {
                              code: 200,
                              jwt_access_token: token.accessToken,
                              jwt_re_fresh_token: token.reFreshToken,
                              userType: userData.type_of_account,
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
  getAssignedCourse:(req,res) => {
    try {
      let user = getUser(req)
      getAllAssignedCourses(user.id).then(assignedCourse => {
        res.status(200).json({
          success: true,
          data: {
            code: 200,
            message: "got all assigned courses",
            response: assignedCourse
          },
        });
      }).catch(err => {
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
      })
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
  }
};
