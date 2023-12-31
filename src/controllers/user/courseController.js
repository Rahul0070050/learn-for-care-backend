import {
  checkGetCourseByCategoryBody,
  checkGetCourseByLimitReqData,
  checkGetSingleCourseParams,
  checkStartCourseReqData,
} from "../../helpers/user/validateCourseReqData.js";
import {
  decrementTheCourseCount,
  getAllAssignedCourseFromDb,
  getAllCoursesFromDb,
  getAllPurchasedCourseByUserId,
  getCourseByCategory,
  getCourseByIdFromDb,
  getPurchasedCourseByUserId,
} from "../../db/mysql/users/course.js";
import { downloadFromS3 } from "../../AWS/S3.js";
import { getUser } from "../../utils/auth.js";
import { getCourseByLimitFromDb } from "../../db/mysql/admin/course.js";
import {
  addCourseToEnrolledCourse,
  getManagerBundleMatrixData,
  getManagerMatrixData,
} from "../../db/mysql/users/enrolledCourse.js";
export const courseController = {
  getCourseById: (req, res) => {
    try {
      let id = Number(req?.params?.id);
      checkGetSingleCourseParams(id)
        .then((result) => {
          getCourseByIdFromDb(id)
            .then(async (result) => {
              let newResult = await result.map(async (course, i) => {
                let intro_video = await downloadFromS3(
                  course.id,
                  course.intro_video
                );

                course["aims"] = JSON.parse(course.aims || "[]");
                course["objectives_point"] = JSON.parse(
                  course.objectives_point || "[]"
                );
                course["what_you_will_learn_point"] = JSON.parse(
                  course.what_you_will_learn_point || "[]"
                );
                course["who_should_attend"] = JSON.parse(
                  course.who_should_attend || "[]"
                );

                let thumbnail = await downloadFromS3(
                  course.id,
                  course.thumbnail
                );

                course["intro_video"] = intro_video?.url;
                course["thumbnail"] = thumbnail?.url;

                return course;
              });

              Promise.all(newResult)
                .then((result) => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: `got one course by id of '${id}'`,
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
  getCourseByCategory: (req, res) => {
    try {
      checkGetCourseByCategoryBody(req.body)
        .then((result) => {
          getCourseByCategory(result.category)
            .then(async (result) => {
              let newResult = await result.map(async (course, i) => {
                let intro_video = await downloadFromS3(
                  course.id,
                  course.intro_video
                );

                let thumbnail = await downloadFromS3(
                  course.id,
                  course.thumbnail
                );

                course["intro_video"] = intro_video?.url;
                course["thumbnail"] = thumbnail?.url;

                return course;
              });

              Promise.all(newResult)
                .then((result) => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: `got all courses by category`,
                      response: result,
                    },
                  });
                })
                .catch((Err) => {
                  res.status(500).json({
                    success: false,
                    errors: [
                      {
                        code: 500,
                        message:
                          "try another category or try again after some times",
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
                      "try another category or try again after some times",
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
  getAllCourses: (req, res) => {
    try {
      getAllCoursesFromDb()
        .then(async (result) => {
          let newResult = await result.map(async (course, i) => {
            let intro_video = await downloadFromS3(
              course.id,
              course.intro_video
            );

            let thumbnail = await downloadFromS3(course.id, course.thumbnail);

            course["intro_video"] = intro_video?.url;
            course["thumbnail"] = thumbnail?.url;

            return course;
          });

          Promise.all(newResult)
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "got all courses",
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
  getCoursesByLimit: (req, res) => {
    try {
      checkGetCourseByLimitReqData(req.params)
        .then((result) => {
          getCourseByLimitFromDb(result.limit)
            .then(async (courseResult) => {
              let newResult = await courseResult.course.map(
                async (course, i) => {
                  let thumbnail = await downloadFromS3(i, course.thumbnail);

                  course["thumbnail"] = thumbnail?.url;

                  return course;
                }
              );

              Promise.all(newResult)
                .then((result) => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "got courses",
                      response: { courses: result, count: courseResult.count },
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
  getBoughtCourses: (req, res) => {
    try {
      let userId = getUser(req).id;
      getPurchasedCourseByUserId(userId)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all courses",
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAllBoughtCourses: (req, res) => {
    try {
      let userId = getUser(req).id;
      getAllPurchasedCourseByUserId(userId)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all courses",
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAllAssignedCourses: (req, res) => {
    try {
      let user = getUser(req);
      getAllAssignedCourseFromDb(user.id, user.type_of_account)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all assigned courses",
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
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  startCourse: (req, res) => {
    try {
      checkStartCourseReqData(req.body)
        .then((result) => {
          let user = getUser(req);
          decrementTheCourseCount(result)
            .then((course) => {
              try {
                addCourseToEnrolledCourse(
                  course.id,
                  user.id,
                  course.validity,
                  user.type_of_account
                )
                  .then((result) => {
                    res.status(200).json({
                      success: true,
                      data: {
                        code: 200,
                        message: "success",
                        response: { id: result.id },
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
                console.log(error);
              }
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
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message: "some error occurred please try again later",
            error,
          },
        ],
        errorType: "server",
      });
    }
  },
  getManagerMatrix: (req, res) => {
    try {
      let userId = req.body?.manager_id || getUser(req).id;
      console.log(getUser(req).type_of_account);
      console.log(getUser(req).id);
      let from = "user";
      if (
        userId == getUser(req).id &&
        getUser(req).type_of_account == "manager"
      ) {
        from = "self"; // if the account is manager then get the matrix data also from the manager
      } else if (userId == getUser(req).id) {
        from = "user";
      } else {
        from = "not user";
      }
      getManagerMatrixData(userId, from)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all the data",
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
            error,
          },
        ],
        errorType: "server",
      });
    }
  },
  getManagerMatrixBundle: (req, res) => {
    try {
      let userId = req.body?.manager_id || getUser(req).id;
      console.log(getUser(req).type_of_account);
      console.log(getUser(req).id);
      let from = "user";
      if (
        userId == getUser(req).id &&
        getUser(req).type_of_account == "manager"
      ) {
        from = "self"; // if the account is manager then get the matrix data also from the manager
      } else if (userId == getUser(req).id) {
        from = "user";
      } else {
        from = "not user";
      }
      getManagerBundleMatrixData(userId, from)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all the data",
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
            error,
          },
        ],
        errorType: "server",
      });
    }
  },
};
