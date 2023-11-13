import { getSubAdminByEmail } from "../../db/mysql/subAdmin/auth.js";

import {
  createTokenForAdmin,
  createTokenForSubAdmin,
} from "../../helpers/jwt.js";
import { validateSubAdminLoginReqBody } from "../../helpers/subAdmin/validateAuthReqData.js";
import { validatePassword } from "../../helpers/validatePasswords.js";

export const subAdminController = {
  login: (req, res) => {
    try {
      validateSubAdminLoginReqBody(req.body)
        .then((loginInfo) => {
          getSubAdminByEmail(loginInfo?.email)
            .then((adminData) => {
              if (adminData?.length <= 0) {
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
                adminData = adminData[0];
                validatePassword(loginInfo.password, adminData.password).then(
                  (result) => {
                    if (result) {
                      createTokenForAdmin({ adminData, type: "sub_admin" })
                        .then((token) => {
                          res.status(200).json({
                            success: true,
                            data: {
                              code: 200,
                              jwt_access_token: token.accessToken,
                              jwt_re_fresh_token: token.reFreshToken,
                              message: "login successful",
                              adminType: "aub-admin"
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
};
