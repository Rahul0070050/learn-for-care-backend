import {
  downloadFromS3,
  removeFromS3,
  uploadFileToS3,
  uploadPdfToS3,
} from "../../AWS/S3.js";
import {
  deleteExperienceFromDb,
  deleteQualificationFromDb,
  getAdminInfoFromDb,
  getAdminQualificationsDocs,
  getAllExperiencesData,
  getAllIndividualsAndCompaniesFromDb,
  getAllQualificationsFromDB,
  getAllTransactionsFromDb,
  getAllUsersReportFromDb,
  getCourseWiseIndividualReportsFromAdminDb,
  getCourseWiseManager,
  getDashboardData,
  getExperienceDocFromDbByAdminIdAndDocId,
  getExperienceDocFromDbById,
  getIndividualReportFromDb,
  getManagerReport,
  getManagerReportForAdmin,
  getQualificationDocFromDbByAdminIdAndDocId,
  getQualificationDocFromDbById,
  saveBannerToDb,
  saveImageToDb,
  saveNewExperience,
  saveNewQualifications,
  setAdminInfoToDb,
  setStaffCVToDb,
  updateAdminExperienceToDb,
  updateAdminQualificationToDb,
  updateExperienceDocDbByAdminIdAndDocId,
  updateQualificationDocDbByAdminIdAndDocId,
} from "../../db/mysql/admin/admin.js";
import sendEmailAndPassByEmail from "../../helpers/sentEmailAndPassUserFromAdmin.js";
import { assignBundleToUser } from "../../db/mysql/admin/bundle.js";
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
  checkSetAdminProfileBannerReqData,
  checkSetAdminProfileImageReqData,
  checkUpdateAdminExperienceDocReqData,
  checkUpdateQualificationDocReqData,
  checkValidateGetUserByIdReqBody,
  validateAssignBundleReqData,
  validateBlockUserInfo,
  validateCreateUserInfo,
  validateDeleteExperienceReqData,
  validateDeleteQualificationReqData,
  validateGetQualificationReqData,
  validateSetAdminExperienceReqData,
  validateSetAdminInfoReqData,
  validateSetAdminQualificationsReqBody,
  validateUnBlockUserInfo,
  validateUpdateAdminQualificationsReqBody,
  validateUpdateExperienceReqData,
  validateUpdateQualificationReqData,
} from "../../helpers/admin/validateAdminReqData.js";
import {
  checkCreateSubAdminReqData,
  checkDeleteSubAdminReqData,
} from "../../helpers/admin/validateSubAdminReqData.js";
import sentOtpEmail from "../../helpers/sendOtpEmail.js";
import { hashPassword } from "../../helpers/validatePasswords.js";
import { generatorOtp, getUser } from "../../utils/auth.js";

export const adminController = {
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
            error: error,
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
            error: error,
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
              let password = hashedPassword;
              insertUser({ ...result, password: password, type_of_account: result.type }, otp)
                .then(async() => {
                  await sendEmailAndPassByEmail(
                    result.first_name + " " + result.last_name,
                    result.email,
                    result.password
                  );
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
            error: error,
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
            error: error,
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
            error: error,
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
            error: error,
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
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  getINdividualsAndManagers: (req, res) => {
    try {
      getAllIndividualsAndCompaniesFromDb()
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "get all users",
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
            error: error,
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
  getAdminInfo: (req, res) => {
    try {
      let admin = getUser(req);
      getAdminInfoFromDb(admin.id)
        .then(async (result) => {
          let staff_cv = await downloadFromS3("", result[0]?.staff_cv || "");
          let banner = await downloadFromS3(
            "",
            result[0]?.profile_banner || ""
          );
          let profile = await downloadFromS3(
            "",
            result[0]?.profile_image || ""
          );
          result[0].profile_banner = banner.url;
          result[0].profile_image = profile.url;
          result[0].staff_cv = staff_cv.url;
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "get admin info",
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
  updateStaffCV: (req, res) => {
    try {
      validateUpdateAdminQualificationsReqBody(req.files)
        .then(async (result) => {
          let uploadedResult = await uploadFileToS3("/staff-cv", result[0].pdf);
          let admin = getUser(req);
          await setStaffCVToDb({
            file: uploadedResult.file,
            adminId: admin.id,
          });
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "staff cv updated",
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
            message: "some error occurred please try again later",
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  setAdminQualification: (req, res) => {
    try {
      validateSetAdminQualificationsReqBody(req.body, req.files)
        .then((result) => {
          result = result.flat();
          console.log(result);
          uploadFileToS3("/qualifications", result[0].ExpAndQulFiles).then(
            (pdfSavedResult) => {
              console.log(pdfSavedResult.file);
              let admin = getUser(req);
              saveNewQualifications({
                admin_id: admin.id,
                university: result[1].university,
                content: result[1].content,
                course_name: result[1].course_name,
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
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  setAdminExperience: (req, res) => {
    try {
      console.log(req.body);
      validateSetAdminExperienceReqData(req.body, req.files)
        .then((result) => {
          result = result.flat();
          uploadFileToS3("/experience", result[0].ExpAndQulFiles).then(
            (pdfSavedResult) => {
              let admin = getUser(req);
              console.log(result);
              saveNewExperience({
                admin_id: admin.id,
                organization_name: result[1].organization,
                designation: result[1].designation,
                no_of_years: result[1].no_of_years,
                content: result[1].content,
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
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAdminQualification: (req, res) => {
    try {
      let admin = getUser(req);
      getAllQualificationsFromDB(admin.id)
        .then(async (result) => {
          let newResult = await result.map(async (qualification, i) => {
            let downloadFile = await downloadFromS3(i, qualification.doc);

            qualification["doc"] = downloadFile?.url;

            return qualification;
          });

          Promise.all(newResult)
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "got qualifications",
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
                    message: "some error happens in db",
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
                message: "some error happens in db",
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
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAdminExperience: (req, res) => {
    try {
      let admin = getUser(req);
      getAllExperiencesData(admin.id)
        .then(async (result) => {
          let newResult = await result.map(async (experience, i) => {
            let downloadFile = await downloadFromS3(i, experience.doc);

            experience["doc"] = downloadFile?.url;

            return experience;
          });

          Promise.all(newResult)
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "got experience",
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
                    message: "some error happens in db",
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
                message: "some error happens in db",
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
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  updateAdminQualificationDoc: (req, res) => {
    try {
      checkUpdateQualificationDocReqData(req.files, req.params)
        .then((result) => {
          result = result.flat();
          let admin = getUser(req);
          console.log(result);
          getQualificationDocFromDbByAdminIdAndDocId(result[1].id, admin.id)
            .then(async (docResult) => {
              console.log(docResult);
              await removeFromS3(docResult[0].doc);
              let docUploadedResult = await uploadFileToS3(
                "/qualifications",
                result[0].pdf
              );
              updateQualificationDocDbByAdminIdAndDocId(
                result[1].id,
                admin.id,
                docUploadedResult.file
              )
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "updated admin qualification",
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
  updateAdminExperience: (req, res) => {
    try {
      checkUpdateAdminExperienceDocReqData(req.files, req.params)
        .then((result) => {
          result = result.flat();
          let admin = getUser(req);
          getExperienceDocFromDbByAdminIdAndDocId(result[1].id, admin.id)
            .then(async (docResult) => {
              console.log("result ", docResult);
              await removeFromS3(docResult[0].doc);
              let docUploadedResult = await uploadFileToS3(
                "/experience",
                result[0].pdf
              );
              updateExperienceDocDbByAdminIdAndDocId(
                result[1].id,
                admin.id,
                docUploadedResult.file
              )
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "updated admin experience",
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
  updateAdminExperienceData: (req, res) => {
    try {
      validateUpdateExperienceReqData(req.body)
        .then((result) => {
          updateAdminExperienceToDb(result)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "updated admin experience data",
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
                    message: "values not acceptable while saving data",
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
  updateAdminQualificationData: (req, res) => {
    try {
      validateUpdateQualificationReqData(req.body)
        .then((result) => {
          updateAdminQualificationToDb(result)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "updated admin qualification data",
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
                    message: "values not acceptable while saving data",
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
  updateAdminProfileBanner: (req, res) => {
    try {
      checkSetAdminProfileBannerReqData(req.files)
        .then(async (result) => {
          let docUploadedResult = await uploadFileToS3(
            "/banner",
            result[0].image
          );
          let user = getUser(req);
          saveBannerToDb(user.id, docUploadedResult.file)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "updated admin profile banner",
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
  updateAdminProfileImage: (req, res) => {
    try {
      checkSetAdminProfileImageReqData(req.files, req.body)
        .then(async (result) => {
          let docUploadedResult = await uploadFileToS3(
            "/profile",
            result[0].image
          );
          let user = getUser(req);
          console.log(docUploadedResult);
          saveImageToDb(user.id, docUploadedResult.file)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "updated admin profile image",
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
  delateAdminExperience: (req, res) => {
    try {
      validateDeleteExperienceReqData(req.params)
        .then((result) => {
          getExperienceDocFromDbById(result.id)
            .then(async (experienceDoc) => {
              await removeFromS3(experienceDoc[0].doc);
              deleteExperienceFromDb(experienceDoc[0].id).then(() => {
                res.status(200).json({
                  success: true,
                  data: {
                    code: 200,
                    message: "experience deleted",
                    response: "",
                  },
                });
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "error from get experience from db",
                    error: err,
                  },
                ],
                errorType: "client",
              });
            });
          // getQualificationDocFromDbById;
          // deleteAdminExperienceFromDb
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
  delateAdminQualification: (req, res) => {
    try {
      validateDeleteQualificationReqData(req.params)
        .then((result) => {
          getQualificationDocFromDbById(result.id)
            .then(async (qualificationDoc) => {
              console.log(qualificationDoc);
              await removeFromS3(qualificationDoc[0].doc);
              deleteQualificationFromDb(result.id)
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "qualification deleted",
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
                        message: "error from from db",
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
                    message: "error from from db",
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
   getManagerReport: (req, res) => {
    try {
      getManagerReportForAdmin()
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got manager report",
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
                message: "error from from db",
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
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  getIndividualReport:(req,res) => {
    try {
      getAllUsersReportFromDb().then(result => {
        res.status(200).json({
          success: true,
          data: {
            code: 200,
            message: "got individual report",
            response: result,
          },
        });
      }).catch(err => {
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
      })
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
  getCourseWiseIndividualReports:(req,res) => {
    try {
      getCourseWiseIndividualReportsFromAdminDb().then(result => {
        res.status(200).json({
          success: true,
          data: {
            code: 200,
            message: "got individual report",
            response: result,
          },
        });
      }).catch(err => {
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
      })
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
  getCourseWiseIndividualManagerReports:(req,res) => {
    try {
      getCourseWiseManager().then(result => {
        res.status(200).json({
          success: true,
          data: {
            code: 200,
            message: "got individual report",
            response: result,
          },
        });
      }).catch(err => {
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
      })
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
  getAllTransactions: (req, res) => {
    try {
      getAllTransactionsFromDb()
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all transaction reports",
              response: result,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
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
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAllAdminQualifications: (req, res) => {
    let admin = getUser(req);
    getAdminQualificationsDocs(admin.id).then((result) => {});
    // getAdminExperiencesDocs
  },
  assignBundle: (req, res) => {
    try {
      validateAssignBundleReqData(req.body).then((result) => {
        let user = getUser(req);
        assignBundleToUser({ ...result, adminId: 0 })
          .then(() => {
            res.status(200).json({
              success: true,
              data: {
                code: 200,
                message: "bundle assigned",
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
};
