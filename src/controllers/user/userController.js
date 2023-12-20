import { downloadFromS3, uploadFileToS3 } from "../../AWS/S3.js";
import {
  getAssignedCourseById,
  getAssignedCourseForManagerById,
} from "../../db/mysql/users/assignedCourse.js";
import {
  getAssignedBundlesFromDbByUserId,
  getAssignedCourseToManagerById,
  getPurchasedCourseById,
  getPurchasedCourseBundlesFromDbByUserId,
  getAssignedBundlesFromDbByCompanyId,
  getAssignedCourseToCompanyById,
} from "../../db/mysql/users/purchasedCourse.js";
import {
  assignCourseToMAnager,
  assignCourseToMAnagerIndividual,
  assignCourseToMAnagerIndividualFromAssignedDb,
  blockUserById,
  getAllAssignedCourseProgressFromDb,
  getAllBlockedUser,
  getAllMAnagers,
  getAllIndividualUnderCompanyFromDb,
  getAllSubUsersFrom,
  getAssignedBundleToManagerFromDb,
  getAssignedCourseForManagerByManagerId,
  getUserById,
  saveAManagerToDb,
  saveASubUserToDb,
  saveUserProfileImage,
  unBlockUserBySubUserId,
  updateUserData,
  getAllManagerIndividualFromDb,
  assignCourseOrBundleToUser,
  getAllTransactionsFromDb,
  getAllMonthlyTransactionsFromDb,
  getAllManagerReportsFromDb,
  getAllIndividualReportsFromDb,
  managerAssignSelfCourse,
  getCourseWiseManagerReportsFromDb,
  getCourseWiseIndividualReportsFromDb,
  getIndividualReportFromDb,
  getCourseWiseIndividualFromManagerReportsFromDb,
  getMonthlyTransactionsFromDb,
  assignCourseToMAnagerIndividualFromAssignedToDb,
  assignCourseToMAnagerIndividualFromManagerAssigned,
  getAllManagerRealIndividualFromDb,
} from "../../db/mysql/users/users.js";
import sentOtpEmail from "../../helpers/sendOtpEmail.js";
import sentEmailToSubUserEmailAndPassword from "../../helpers/sentEmailAndPassToSubUser.js";
import {
  checkAssignCourseToManagerIndividualReqData,
  checkAssignCourseToManagerReqData,
  checkBlockUserRewData,
  checkCreateManagerIndividualReqBody,
  checkCreateManagerReqBody,
  checkCreateSubUSerReqBody,
  checkSetUserProfileImageReqData,
  checkUnBlockUserRewData,
  validateAssignCourseOrBundleReqData,
  validateManagerSelfAssignCourseReqData,
  validateUpdateUserInfo,
} from "../../helpers/user/validateUserReqData.js";
import { hashPassword } from "../../helpers/validatePasswords.js";
import { getUser } from "../../utils/auth.js";

export const userController = {
  getUserData: (req, res) => {
    try {
      let user = getUser(req);
      getUserById(user.id)
        .then(async (result) => {
          try {
            let url = await downloadFromS3("", result[0]?.profile_image || "");
            result[0].profile_image = url?.url;
            res.status(200).json({
              success: true,
              data: {
                code: 200,
                message: "got user",
                response: result,
              },
            });
          } catch (error) {
            console.log(error);
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(406).json({
            success: false,
            errors: [
              {
                code: 406,
                message: "some error occurred please try again later",
                error: err,
              },
            ],
            errorType: "server",
          });
        });
    } catch (error) {
      console.log(err);
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
  updateUserData: (req, res) => {
    try {
      validateUpdateUserInfo(req.body)
        .then((result) => {
          let user = getUser(req);
          updateUserData({ ...result, id: user.id })
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "user data updated",
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
          console.log(err);
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
  createSubUser: (req, res) => {
    try {
      checkCreateSubUSerReqBody(req.body)
        .then(async (result) => {
          let userId = getUser(req).id;
          let password = await hashPassword(result.password);
          saveASubUserToDb({ ...result, password, userId })
            .then(() => {
              sentEmailToSubUserEmailAndPassword(
                `${result.first_name} ${result.last_name}`,
                result.email,
                result.password
              )
                .then((emailRes) => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "email sent",
                      response: emailRes,
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getSubUser: (req, res) => {
    try {
      let userId = getUser(req).id;
      getAllSubUsersFrom(userId)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all sub-users",
              response: result,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            data: {
              code: 406,
              message: "some error occur",
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
  blockUser: (req, res) => {
    try {
      checkBlockUserRewData(req.body)
        .then((result) => {
          blockUserById(result.userId)
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
                data: {
                  code: 406,
                  message: "some error occur",
                  response: err,
                },
              });
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAssignedBundles: (req, res) => {
    try {
      let user = getUser(req);
      getAssignedBundleToManagerFromDb(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all assigned Bundles",
              response: result,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            data: {
              code: 406,
              message: "some error occur",
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
  unBlockUser: (req, res) => {
    try {
      checkUnBlockUserRewData(req.body)
        .then((result) => {
          unBlockUserBySubUserId(result.userId)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "unBlocked successful",
                  response: "",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                data: {
                  code: 406,
                  message: "some error occur",
                  response: err,
                },
              });
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  assignCourseToManager: (req, res) => {
    try {
      checkAssignCourseToManagerReqData(req.body)
        .then(async (result) => {
          result.receiverId = result.userId;
          delete result.userId;

          let course = await getPurchasedCourseById(result.course_id); // course_id is purchased courses tablses id
          if (course[0].course_count >= result.count) {
            let realCourse_id = course[0].course_id;
            let realCourse_type = course[0].course_type;
            let realValidity = course[0].validity;
            let userId = getUser(req).id;
            assignCourseToMAnager({
              ...result,
              userId,
              realCourse_id,
              realCourse_type,
              realValidity,
              from: "purchased",
            })
              .then((result) => {
                res.status(200).json({
                  success: true,
                  data: {
                    code: 200,
                    message: "assigned successfully",
                    response: "",
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
          } else {
            res.status(406).json({
              success: false,
              data: {
                code: 406,
                message: "invalid course count",
                response: "you don't have that much course to assign",
              },
            });
          }
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  assignCourseToManagerFromAssigned: (req, res) => {
    try {
      checkAssignCourseToManagerReqData(req.body)
        .then(async (result) => {
          result.receiverId = result.userId;
          delete result.userId;

          let course = await getAssignedCourseToCompanyById(result.course_id); // course_id is purchased courses tablses id

          if (course[0].count >= result.count) {
            let realCourse_id = course[0].course_id;
            let realCourse_type = course[0].course_type;
            let realValidity = course[0].validity;
            let userId = getUser(req).id;
            assignCourseToMAnager({
              ...result,
              userId,
              realCourse_id,
              realCourse_type,
              realValidity,
              from: "assigned",
            })
              .then((result) => {
                res.status(200).json({
                  success: true,
                  data: {
                    code: 200,
                    message: "assigned successfully",
                    response: "",
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
          } else {
            res.status(406).json({
              success: false,
              data: {
                code: 406,
                message: "value not acceptable",
                response: "count",
              },
            });
          }
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  assignCourseToManagerIndividual: (req, res) => {
    try {
      checkAssignCourseToManagerIndividualReqData(req.body)
        .then(async (result) => {
          result.receiverId = result.userId;
          delete result.userId;

          let course = await getPurchasedCourseById(result.course_id); // course_id is purchased courses tables id

          if (course[0].course_count >= result.count) {
            let realCourse_id = course[0].course_id;
            let realCourse_type = course[0].course_type;
            let realValidity = course[0].validity;
            let userId = getUser(req).id;
            assignCourseToMAnagerIndividual({
              ...result,
              userId,
              realCourse_id,
              realCourse_type,
              realValidity,
            })
              .then((result) => {
                res.status(200).json({
                  success: true,
                  data: {
                    code: 200,
                    message: "assigned successfully",
                    response: "",
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
          } else {
            res.status(406).json({
              success: false,
              data: {
                code: 406,
                message: "value not acceptable",
                response: "count is not acceptable",
              },
            });
          }
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  assignCourseToManagerIndividualFromAssigned: (req, res) => {
    try {
      checkAssignCourseToManagerIndividualReqData(req.body)
        .then(async (result) => {
          try {
            result.receiverId = result.userId;
            delete result.userId;

            let course = await getAssignedCourseToCompanyById(result.course_id); // course_id is purchased courses tables or assigned course table id also works

            console.log(course);

            if (course[0].count >= result.count) {
              let realCourse_id = course[0].course_id;
              let realCourse_type = course[0].course_type;
              let realValidity = course[0].validity;
              let userId = getUser(req).id;
              assignCourseToMAnagerIndividualFromAssignedDb({
                ...result,
                userId,
                realCourse_id,
                realCourse_type,
                realValidity,
              })
                .then((result) => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "assigned successfully",
                      response: "",
                    },
                  });
                })
                .catch((err) => {
                  res.status(406).json({
                    success: false,
                    data: {
                      code: 406,
                      message: "err from db",
                      response: err,
                    },
                  });
                });
            } else {
              res.status(406).json({
                success: false,
                data: {
                  code: 406,
                  message: "invalid count",
                  response: "this count is not valid",
                },
              });
            }
          } catch (error) {
            console.log(error);
          }
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  assignCourseToManagerIndividualFromManagerAssigned: (req, res) => {
    try {
      checkAssignCourseToManagerIndividualReqData(req.body)
        .then(async (result) => {
          try {
            result.receiverId = result.userId;
            delete result.userId;

            let course = await getAssignedCourseForManagerById(
              result.course_id
            ); // course_id is purchased courses tables id

            console.log(course);

            if (course[0].count >= result.count) {
              let realCourse_id = course[0].course_id;
              let realCourse_type = course[0].course_type;
              let realValidity = course[0].validity;
              let userId = getUser(req).id;
              assignCourseToMAnagerIndividualFromAssignedToDb({
                ...result,
                userId,
                realCourse_id,
                realCourse_type,
                realValidity,
                from: "manager-assigned",
              })
                .then((result) => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "assigned successfully",
                      response: "",
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
            } else {
              res.status(406).json({
                success: false,
                data: {
                  code: 406,
                  message: "value is not acceptable",
                  response: "count is not valid to assign",
                },
              });
            }
          } catch (error) {
            console.log(error);
          }
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  assignCourseToManagerIndividualFromManager: (req, res) => {
    try {
      checkAssignCourseToManagerIndividualReqData(req.body)
        .then(async (result) => {
          result.receiverId = result.userId;
          delete result.userId;

          let course = await getAssignedCourseToManagerById(result.course_id); // course_id is purchased courses tables id
          if (course[0].count >= result.count) {
            let realCourse_id = course[0].course_id;
            let realCourse_type = course[0].course_type;
            let realValidity = course[0].validity;
            let userId = getUser(req).id;
            assignCourseToMAnagerIndividualFromManagerAssigned({
              ...result,
              userId,
              realCourse_id,
              realCourse_type,
              realValidity,
              assigned: true,
            })
              .then((result) => {
                res.status(200).json({
                  success: true,
                  data: {
                    code: 200,
                    message: "assigned successfully",
                    response: "",
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
          } else {
            res.status(406).json({
              success: false,
              data: {
                code: 406,
                message: "value is not acceptable",
                response: "No courses left",
              },
            });
          }
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getBlocked: (req, res) => {
    try {
      let user = getUser(req);
      getAllBlockedUser(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "get all sub users",
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAllAssignedCourseProgress: (req, res) => {
    try {
      let user = getUser(req);
      getAllAssignedCourseProgressFromDb(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "get all sub users",
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  assignCourseOrBundle: (req, res) => {
    try {
      validateAssignCourseOrBundleReqData(req.body).then((result) => {
        let user = getUser(req);
        assignCourseOrBundleToUser({ ...result, adminId: user.id })
          .then(() => {
            res.status(200).json({
              success: true,
              data: {
                code: 200,
                message: "successfully assigned",
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
  createManager: (req, res) => {
    try {
      checkCreateManagerReqBody(req.body)
        .then(async (result) => {
          let userId = getUser(req).id;
          let password = await hashPassword(result.password);
          saveAManagerToDb({ ...result, password, userId })
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "manager created",
                  response: "",
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAllManagers: (req, res) => {
    try {
      let userId = getUser(req).id;
      getAllMAnagers(userId)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all managers",
              response: result,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            data: {
              code: 406,
              message: "some error occur",
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
  createManagerIndividual: (req, res) => {
    try {
      checkCreateManagerIndividualReqBody(req.body)
        .then(async (result) => {
          let userId = getUser(req).id;
          let password = await hashPassword(result.password);
          saveAManagerToDb({ ...result, password, userId })
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "manager individual created",
                  response: "",
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
  getAssignedCourseForManager: (req, res) => {
    try {
      let user = getUser(req);
      console.log(user.id);
      getAssignedCourseForManagerByManagerId(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all assigned bundles",
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
  getAllManagerIndividual: (req, res) => {
    try {
      let user = getUser(req);
      getAllManagerRealIndividualFromDb(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all manager individual",
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
  getAllIndividualUnderCompany: (req, res) => {
    try {
      let user = getUser(req);
      getAllIndividualUnderCompanyFromDb(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all individual under company",
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
  setProfileImage: (req, res) => {
    try {
      console.log(req.files);
      checkSetUserProfileImageReqData(req.files)
        .then(async (result) => {
          let user = getUser(req);
          console.log(result);
          console.log(user);
          let uploadedResult = await uploadFileToS3(
            "/user-profile",
            result[0].image
          );
          saveUserProfileImage(user.id, uploadedResult.file)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "profile image updated",
                  response: "",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                data: {
                  code: 406,
                  message: "error from db",
                  response: err,
                },
              });
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
  getPurchasedBundles: (req, res) => {
    try {
      let user = getUser(req);
      getPurchasedCourseBundlesFromDbByUserId(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all purchased bundles",
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
  getAllAssignedBundlesForIndividuals: (req, res) => {
    try {
      let user = getUser(req);
      getAssignedBundlesFromDbByUserId(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all assigned bundles",
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
  getAllAssignedBundlesForCompany: (req, res) => {
    try {
      let user = getUser(req);
      getAssignedBundlesFromDbByCompanyId(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all assigned bundles",
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
  getAllTransactions: (req, res) => {
    try {
      let userId = getUser(req).id;
      getAllTransactionsFromDb(userId)
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
  getAllMonthlyTransactions: (req, res) => {
    try {
      let userId = getUser(req).id;
      getMonthlyTransactionsFromDb(userId)
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
  getAllManagerReports: (req, res) => {
    try {
      let userId = getUser(req).id;
      getAllManagerReportsFromDb(userId)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all managers reports",
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
  getAllIndReports: (req, res) => {
    try {
      let userId = getUser(req).id;
      getAllIndividualReportsFromDb(userId)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all individual reports",
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
  managerSelfAssignCourse: (req, res) => {
    try {
      validateManagerSelfAssignCourseReqData(req.body)
        .then(async (result) => {
          try {
            let course = "";
            if (result.from == "manager-assigned") {
              course = await getAssignedCourseToManagerById(result.id);
              if (!course[0].count >= result.count) {
                return res.status(406).json({
                  success: false,
                  data: {
                    code: 406,
                    message: "value is not acceptable",
                    response: "from manager-assigned",
                  },
                });
              }
            } else if (result.from == "manager-purchased") {
              course = await getPurchasedCourseById(result.id);
              if (!course[0].course_count >= result.count) {
                return res.status(406).json({
                  success: false,
                  data: {
                    code: 406,
                    message: "value is not acceptable",
                    response: "from manager-purchased",
                  },
                });
              }
            } else if(result.from == "company-assigned") {
              course = await getAssignedCourseToCompanyById(result.id);
              console.log(course);
              if (!course[0].count >= result.count) {
                return res.status(406).json({
                  success: false,
                  data: {
                    code: 406,
                    message: "value is not acceptable",
                    response: "form company-assigned",
                  },
                });
              }
            } else if (result.from == "company-purchased") {
              course = await getPurchasedCourseById(result.id);
              if (!course[0].course_count >= result.count) {
                return res.status(406).json({
                  success: false,
                  data: {
                    code: 406,
                    message: "value is not acceptable",
                    response: "from company-purchased",
                  },
                });
              }
            }

            console.log(result.id);

            let userId = getUser(req).id;
            result.purchased_course_id = result.id;
            managerAssignSelfCourse({
              ...result,
              type: course[0].course_type,
              validity: course[0].validity,
              course_id: course[0].course_id,
              userId,
            })
              .then((result) => {
                res.status(200).json({
                  success: true,
                  data: {
                    code: 200,
                    message: "assigned successfully",
                    response: result,
                  },
                });
              })
              .catch((err) => {
                res.status(406).json({
                  success: false,
                  data: {
                    code: 406,
                    message: "error from db",
                    response: err,
                  },
                });
              });
          } catch (error) {
            console.log(error);
          }
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
  getCourseWiseManagerReports: (req, res) => {
    try {
      let userId = getUser(req).id;
      getCourseWiseManagerReportsFromDb(userId)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all course wise reports",
              response: result,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            data: {
              code: 406,
              message: "error from db",
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
  getCourseWiseIndividualReports: (req, res) => {
    try {
      let userId = getUser(req).id;
      getCourseWiseIndividualReportsFromDb(userId)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all course wise ind reports",
              response: result,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            data: {
              code: 406,
              message: "error from db",
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
  getCourseWiseIndividualManagerReports: (req, res) => {
    try {
      let userId = getUser(req).id;
      getCourseWiseIndividualFromManagerReportsFromDb(userId)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all course wise ind reports",
              response: result,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            data: {
              code: 406,
              message: "error from db",
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
  getIndividualReport: (req, res) => {
    try {
      let userId = getUser(req).id;
      getIndividualReportFromDb(userId)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all ind report",
              response: result,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            data: {
              code: 406,
              message: "from err form db",
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
};
