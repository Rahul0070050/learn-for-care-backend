import { uploadFileToS3 } from "../../AWS/S3.js";
import {
  getDashboardData,
  saveNewExperience,
  saveNewQualifications,
  setAdminInfoToDb,
} from "../../db/mysql/admin/admin.js";
import {
  deleteSubAdminFomDb,
  saveNewSubAdminToDb,
  getAllSubAdminFomDb,
} from "../../db/mysql/admin/subAdmin.js";
import {
  blockUserFromAdmin,
  getAllUsersFromDb,
  getUserByIdFromDb,
  insertUser,
  unBlockUserFromAdmin,
} from "../../db/mysql/admin/user.js";
import {
  checkValidateGetUserByIdReqBody,
  validateBlockUserInfo,
  validateCreateUserInfo,
  validateSetAdminExperienceReqData,
  validateSetAdminInfoReqData,
  validateSetAdminQualificationsReqBody,
  validateUnBlockUserInfo,
} from "../../helpers/admin/validateAdminReqData.js";
import {
  checkCreateSubAdminReqData,
  checkDeleteSubAdminReqData,
} from "../../helpers/admin/validateSubAdminReqData.js";
import sentOtpEmail from "../../helpers/sendOtpEmail.js";
import { hashPassword } from "../../helpers/validatePasswords.js";
import { generatorOtp, getUser } from "../../utils/auth.js";

export const subAdminController = {
  createSubAdmin: (req, res) => {
    try {
      checkCreateSubAdminReqData(req.body)
        .then(async (result) => {
          let password = await hashPassword(result.password);
          result.password = password;
          saveNewSubAdminToDb(result)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "new sub admin created",
                  response: "",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: true,
                data: {
                  code: 406,
                  message: "value not acceptable",
                  response: err,
                },
              });
            });
        })
        .catch((err) => {
          res.status(406).json({
            success: true,
            data: {
              code: 406,
              message: "value not acceptable",
              response: err,
            },
          });
        });
    } catch (error) {
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
    }
  },
  deleteSubAdmin: (req, res) => {
    try {
      checkDeleteSubAdminReqData(req.body)
        .then(async (result) => {
          deleteSubAdminFomDb(result.id)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "delete sub admin",
                  response: "",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: true,
                data: {
                  code: 406,
                  message: "value not acceptable",
                  response: err,
                },
              });
            });
        })
        .catch((err) => {
          res.status(406).json({
            success: true,
            data: {
              code: 406,
              message: "value not acceptable",
              response: err,
            },
          });
        });
    } catch (error) {
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
    }
  },
  listSubAdmin: (req, res) => {
    try {
      getAllSubAdminFomDb()
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "get all sub admin",
              response: result,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: true,
            data: {
              code: 406,
              message: "value not acceptable",
              response: err,
            },
          });
        });
    } catch (error) {
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
    }
  },
  createUser: (req, res) => {
    try {
      validateCreateUserInfo(req.body)
        .then((result) => {
          hashPassword(result.password)
            .then(async (hashedPassword) => {
              let otp = await Number(generatorOtp());
              result.password = hashedPassword;
              insertUser({ ...result, type_of_account: "individual" }, otp)
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "user created",
                      response: "",
                    },
                  });
                })
                .catch((err) => {
                  console.log(err);
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAllUsers: (req, res) => {
    try {
      getAllUsersFromDb()
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all users",
              response: result,
            },
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getUserDataById: (req, res) => {
    try {
      req.params.id = Number(req.params.id);
      checkValidateGetUserByIdReqBody(req.params)
        .then((result) => {
          getUserByIdFromDb(result.id)
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "got user info",
                  response: result,
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
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message: "some error occurred please try again later",
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  blockUser: (req, res) => {
    try {
      validateBlockUserInfo(req.params)
        .then((result) => {
          blockUserFromAdmin(result.id)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "successfully blocked",
                  response: "",
                },
              });
            })
            .catch(() => {
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  unBlockUser: (req, res) => {
    try {
      validateUnBlockUserInfo(req.params)
        .then((result) => {
          unBlockUserFromAdmin(result.id)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "successfully unblocked",
                  response: "",
                },
              });
            })
            .catch(() => {
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  superAdminDashboard: (req, res) => {
    try {
      getDashboardData(req.data)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "successfully unblocked",
              response: result,
            },
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  setAdminInfo: (req, res) => {
    try {
      validateSetAdminInfoReqData(req.body)
        .then((result) => {
          let admin = getUser(req);
          console.log(admin);
          setAdminInfoToDb({ ...result, admin_id: admin.id })
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "set admin info",
                  response: "",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "some error occurs while saving data",
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  setAdminQualifications: (req, res) => {
    try {
      validateSetAdminQualificationsReqBody(req.body, req.files)
        .then((result) => {
          result = result.flat();
          console.log(result);
          uploadFileToS3("/qualifications", result[0].pdf).then(
            (pdfSavedResult) => {
              console.log(pdfSavedResult.file);
              let admin = getUser(req);
              saveNewQualifications({
                admin_id: admin.id,
                university: result[1].university,
                note: result[1].note,
                doc: pdfSavedResult.file,
              })
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "set admin qualification",
                      response: "",
                    },
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
            }
          );
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
      // setNewExperience
    } catch (error) {
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
    }
  },
  setAdminExperience: (req, res) => {
    try {
      validateSetAdminExperienceReqData(req.body, req.files)
        .then((result) => {
          result = result.flat();
          console.log(result);
          uploadFileToS3("/experience", result[0].pdf).then(
            (pdfSavedResult) => {
              let admin = getUser(req);
              saveNewExperience({
                admin_id: admin.id,
                organization: result[1].organization,
                position: result[1].position,
                no_of_years: result[1].no_of_years,
                note: result[1].note,
                doc: pdfSavedResult.file,
              })
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "set admin qualification",
                      response: "",
                    },
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
            }
          );
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
      // setNewExperience
    } catch (error) {
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
    }
  }
};
