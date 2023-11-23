import { downloadFromS3, uploadFileToS3 } from "../../AWS/S3.js";
import {
  getPurchasedCourseById,
  getPurchasedCourseFromDbByUserId,
} from "../../db/mysql/users/purchasedCourse.js";
import {
  assignCourseToMAnager,
  assignCourseToMAnagerIndividual,
  blockSubUserBySubUserId,
  getAllAssignedCourseProgressFromDb,
  getAllBlockedUser,
  getAllMAnagers,
  getAllManagerIndividualFromDb,
  getAllSubUsersFrom,
  getAssignedBundleToManagerFromDb,
  getUserById,
  saveAManagerToDb,
  saveASubUserToDb,
  saveUserProfileImage,
  unBlockSubUserBySubUserId,
  updateUserData,
} from "../../db/mysql/users/users.js";
import sentOtpEmail from "../../helpers/sendOtpEmail.js";
import sentEmailToSubUserEmailAndPassword from "../../helpers/sentEmailAndPassToSubUser.js";
import {
  checkAssignCourseToManagerIndividualReqData,
  checkAssignCourseToManagerReqData,
  checkBlockSubUserRewData,
  checkCreateManagerIndividualReqBody,
  checkCreateManagerReqBody,
  checkCreateSubUSerReqBody,
  checkSetUserProfileImageReqData,
  checkUnBlockSubUserRewData,
  validateUpdateUserInfo,
} from "../../helpers/user/validateUserReqData.js";
import { hashPassword } from "../../helpers/validatePasswords.js";
import { getUser } from "../../utils/auth.js";

export const userController = {
  getUserData: (req, res) => {
    let user = getUser(req);
    getUserById(user.id)
      .then(async (result) => {
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
  blockSubUser: (req, res) => {
    try {
      checkBlockSubUserRewData(req.body)
        .then((result) => {
          blockSubUserBySubUserId(result.sub_user_id)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "blocked sub-user successful",
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
  unBlockSubUser: (req, res) => {
    try {
      checkUnBlockSubUserRewData(req.body)
        .then((result) => {
          unBlockSubUserBySubUserId(result.sub_user_id)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "unBlocked sub-user successful",
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

          let course = await getAssignedCourseById(result.course_id); // course_id is purchased courses tables id

          console.log(course);
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
            assigned:true
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
  getAllManagerIndividual: (req, res) => {
    try {
      let user = getUser(req);
      getAllManagerIndividualFromDb(user.id)
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
      getPurchasedCourseFromDbByUserId(user.id)
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
};
