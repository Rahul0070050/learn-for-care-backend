import {
  checkGetBundleByIdReqDate,
  validateGetBundleInfoReqData,
  validateGetCourseReqData,
  validateGetExamReqData,
  validateSTartBundleCourseReqData,
  validateStartBundleReqData,
} from "../../helpers/user/validateBundleReqData.js";
import { downloadFromS3, uploadFileToS3, uploadPdfToS3 } from "../../AWS/S3.js";
import {
  getAllBBundle,
  getAllOnGoingBundles,
  getAllOnGoingBundlesFromDb,
  getBundleCourseByBundleId,
  getBundleCourseByBundleName,
  getBundleDataFromDb,
  getCourseBundleById,
  getCourseByCourseIdFromDb,
  getExamByCourseId,
  getOneCourseFromBundleCourse,
  setNewBundleToEnroll,
  startANewBundle,
  startBundleCourse,
  updateBundleProgress,
} from "../../db/mysql/users/courseBundle.js";
import { getCourseByIdFromDb } from "../../db/mysql/users/course.js";
import { getUser } from "../../utils/auth.js";
import { getOnGoingCourseByIdFromDb } from "../../db/mysql/users/onGoingCourse.js";
import { validateValidateExamReqData } from "../../helpers/user/validateExamReqData.js";
import {
  getQuestionsById,
  saveBundleExamResult,
  saveExamResult,
} from "../../db/mysql/admin/exam.js";
import { saveCertificate } from "../../certificate/courseCertificate.js";
import { v4 as uuid } from "uuid";
import { insertNewCertificate } from "../../db/mysql/admin/certificate.js";

export const bundleController = {
  getBundleById: (req, res) => {
    try {
      checkGetBundleByIdReqDate(req.params.id)
        .then((result) => {
          getCourseBundleById(result)
            .then(async (bundle) => {
              if (bundle.length) {
                let signedUrl = await downloadFromS3(
                  bundle[0].id,
                  bundle[0].image
                );
                bundle[0].image = signedUrl.url;
                let courseIds = JSON.parse(bundle[0].courses);

                Promise.all(
                  courseIds.map(async (id) => {
                    return await getCourseByIdFromDb(id);
                  })
                )
                  .then(async (result) => {
                    result = result.flat(1);
                    let urls = await Promise.all(
                      result.map(async (course, i) => {
                        return await downloadFromS3(
                          course.id,
                          course.thumbnail
                        );
                      })
                    );

                    let updatedCourse = result.map((course) => {
                      course.thumbnail = urls.find(
                        (url) => url.id === course.id
                      ).url;
                      return course;
                    });

                    bundle[0].courses = updatedCourse;

                    res.status(200).json({
                      success: true,
                      data: {
                        code: 200,
                        message: "bundle by id",
                        response: bundle,
                      },
                    });
                  })
                  .catch((err) => {
                    res.status(500).json({
                      success: false,
                      errors: [
                        {
                          code: 500,
                          message: "some error occur while getting the bundle",
                          error: err,
                        },
                      ],
                      errorType: "client",
                    });
                  });
              } else {
                res.status(404).json({
                  success: false,
                  errors: [
                    {
                      code: 404,
                      message: "bundle not found",
                      error: err,
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
                    message: "some error occur while getting the bundle",
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
  getAllBundle: (req, res) => {
    try {
      getAllBBundle()
        .then(async (result) => {
          let fileResponses = result.map((item) =>
            downloadFromS3(item.id, item.image)
          );

          let SignedUrl = await Promise.all(fileResponses);

          result.forEach((item) => {
            item.image = SignedUrl.find((url) => url.id == item.id).url;
          });

          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "all Bundle",
              response: result,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            errors: [
              {
                code: 500,
                message:
                  "some error occurred in the server try again after some times",
                error: err?.message,
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
  startBundle: (req, res) => {
    try {
      validateStartBundleReqData(req.body)
        .then(async (result) => {
          let user = getUser(req);
          startANewBundle({ ...result, id: user.id })
            .then((startedResult) => {
              try {
                let data = {
                  bundle_id: startedResult.id,
                  validity: startedResult.validity,
                  bundle_name: startedResult.bundleName,
                  user_id: user.id,
                  course_count: JSON.parse(
                    JSON.parse(startedResult.course_count)
                  ).length,
                  unfinished_course: JSON.parse(
                    JSON.parse(startedResult.course_count)
                  ),
                  all_courses: JSON.parse(
                    JSON.parse(startedResult.course_count)
                  ),
                };
                setNewBundleToEnroll(data)
                  .then((result) => {
                    res.status(200).json({
                      success: true,
                      data: {
                        code: 200,
                        message: "bundle",
                        response: {
                          id: result.insertId,
                        },
                      },
                    });
                  })
                  .catch((err) => {
                    res.status(406).json({
                      success: false,
                      errors: [
                        {
                          code: 406,
                          message: "error from db",
                          error: err,
                        },
                      ],
                      errorType: "client",
                    });
                  });
              } catch (error) {
                console.log(error);
              }
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
          console.log(err);
          res.status(500).json({
            success: false,
            errors: [
              {
                code: 500,
                message:
                  "some error occurred in the server try again after some times",
                error: err?.message,
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
  getBundleInfo: (req, res) => {
    try {
      validateGetBundleInfoReqData(req.params)
        .then((result) => {
          getBundleDataFromDb(result.id)
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "got courses",
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
  startBundleCourse: (req, res) => {
    try {
      validateSTartBundleCourseReqData(req.body)
        .then((result) => {
          startBundleCourse(result)
            .then((result) => {})
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
  getBundleCourse: (req, res) => {
    try {
      let bundleId = req.params.id; // bundle name or bundle id
      console.log(bundleId);
      if (Number.isInteger(Number(bundleId))) {
        console.log("from if ", bundleId);
        getBundleCourseByBundleId(bundleId)
          .then(async (result) => {
            let newResult = await Promise.all(
              result.allCourses.map(async (item) => {
                let image = await downloadFromS3("", item.thumbnail);
                item["thumbnail"] = image.url;
                return item;
              })
            );
            newResult = newResult.flat(1);
            result.allCourses = newResult;
            res.status(200).json({
              success: true,
              data: {
                code: 200,
                message: "got courses",
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
                  message: "value not acceptable",
                  error: err,
                },
              ],
              errorType: "client",
            });
          });
      } else {
        console.log("from else ", bundleId);
        getBundleCourseByBundleName(bundleId)
          .then(async (result) => {
            let newResult = await Promise.all(
              result.allCourses.map(async (item) => {
                let image = await downloadFromS3("", item.thumbnail);
                item["thumbnail"] = image.url;
                return item;
              })
            );
            newResult = newResult.flat(1);
            result.allCourses = newResult;
            res.status(200).json({
              success: true,
              data: {
                code: 200,
                message: "got courses",
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
                  message: "value not acceptable",
                  error: err,
                },
              ],
              errorType: "client",
            });
          });
      }
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
  getCourse: (req, res) => {
    try {
      validateGetCourseReqData(req.body)
        .then((result) => {
          getOneCourseFromBundleCourse(result)
            .then((result) => {
              console.log(result);
              getCourseByCourseIdFromDb(result.course_id).then(
                async (result) => {
                  let newResult = await result.map(async (course, i) => {
                    try {
                      let resources = JSON.parse(course.resource);
                      let ppt = JSON.parse(course.ppt);

                      delete course.resource;
                      delete course.ppt;

                      course[`resourceCount`] = resources.length;
                      course[`pptCount`] = resources.length;

                      resources.forEach((item, i) => {
                        course[`resource${i}-`] = `${item.file}&&${item.name}&&${item.type}`;
                      });

                      ppt.forEach((item, i) => {
                        course[`ppt${i}-`] = item.file;
                      });

                      let images = [];
                      let resource = [];

                      for (let index = 0; index < ppt.length; index++) {
                        let link = course[`ppt${index}-`];

                        // let key = urlstring.pop();

                        let url = await downloadFromS3(index, link);

                        delete course[`ppt${index}-`];

                        images.push(url.url);
                      }

                      for (let index = 0; index < resources.length; index++) {
                        let link = course[`resource${index}-`].split("&&");
                        let url = await downloadFromS3(index, link[0]);

                        let type = "";
                        if (
                          link[2] ==
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ) {
                          type = "docx";
                        }
                        if (
                          link[2] == "video/mp4" ||
                          link[2] == "video/mkv" ||
                          link[2] == "video/webm"
                        ) {
                          type = "video";
                        }
                        if (link[2] == "application/pdf") {
                          type = "pdf";
                        }
                        if (link[2] == "text/plain") {
                          type = "txt";
                        }
                        if (
                          link[2] == "image/jpg" ||
                          link[2] == "image/jpeg" ||
                          link[2] == "image/webp" ||
                          link[2] == "image/png"
                        ) {
                          type = "image";
                        }
                        resource.push({
                          url: url.url,
                          fileName: link[1],
                          type,
                        });

                        delete course[`resource${index}-`];
                      }

                      let intro_video = await downloadFromS3(
                        course.id,
                        course.intro_video
                      );

                      let thumbnail = await downloadFromS3(
                        course.id,
                        course.thumbnail
                      );

                      let video = await downloadFromS3(course.id, course.video);

                      course["intro_video"] = intro_video?.url;
                      course["thumbnail"] = thumbnail?.url;
                      course["video"] = video?.url;
                      course["ppt"] = images;
                      course["resource"] = resource;

                      return course;
                    } catch (error) {
                      console.log(error);
                    }
                  });

                  Promise.all(newResult)
                    .then((result) => {
                      res.status(200).json({
                        success: true,
                        data: {
                          code: 200,
                          message: `got one course`,
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
                }
              );
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
  getExam: (req, res) => {
    try {
      validateGetExamReqData(req.body)
        .then((result) => {
          let user = getUser(req);
          getExamByCourseId({ ...result, user_id: user.id })
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `got exam`,
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
  validateExamResult: (req, res) => {
    try {
      validateValidateExamReqData(req.body).then(async (result) => {
        try {
          let answers = JSON.parse(result.answer);
          let questions = await getQuestionsById(result.question_id);
          let realAnswers = JSON.parse(questions[0].exam);
          let course = await getCourseByIdFromDb(questions[0].course_id);
          let points = 0;
          let user = getUser(req);
          let wrongAnswers = [];
          realAnswers.map((item) => {
            let ans = answers.find((i) => i.question == item.question);
            if (ans.answer == item.answer) {
              ++points;
            } else {
              wrongAnswers.push({
                question: item.question,
                answer: item.answer,
              });
            }
          });
          let per = parseInt((points / answers.length) * 100);
          saveBundleExamResult(
            per,
            course[0].id,
            user.id,
            result.enrolled_course_id
          )
            .then(async (sl) => {
              try {
                if (per >= 80) {
                  let filePath = uuid() + ".pdf";

                  await saveCertificate({
                    filePath,
                    sl,
                    userName: user.first_name + " " + user.last_name,
                    courseName: course[0].name,
                    date: new Date(),
                    per: per
                  });
                  let url = await uploadPdfToS3(filePath);
                  updateBundleProgress(
                    result.enrolled_course_id,
                    questions[0].course_id,
                    per
                  );
                  insertNewCertificate({
                    ...result,
                    user_id: user.id,
                    user_name: user.first_name + " " + user.last_name,
                    percentage: per,
                    date: new Date(),
                    image: url.file,
                    course_name: course[0].name,
                  })
                    .then(async (result) => {
                      res.status(201).json({
                        success: true,
                        data: {
                          code: 201,
                          message: "you successfully finished the course",
                          response: {
                            per: per + " %",
                            rightAnswers: points,
                            wrongAnswers: wrongAnswers,
                            certificate: url.file,
                          },
                        },
                      });
                    })
                    .catch((error) => {
                      res.status(406).json({
                        success: false,
                        errors: [
                          {
                            code: 406,
                            message: "error from db acceptable",
                            error: error,
                          },
                        ],
                        errorType: "client",
                      });
                    });
                } else {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "result",
                      response: {
                        per: per + " %",
                        rightAnswers: points,
                        wrongAnswers: wrongAnswers,
                      },
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
          console.log(error);
        }
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
  getOnGoingBundles: (req, res) => {
    try {
      let user = getUser(req);
      getAllOnGoingBundlesFromDb(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: `got all on-going bundles`,
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
  // getBundleById: (req, res) => {
  //   try {
  //     getBBundleByIdFromDb()
  //       .then(async (result) => {
  //         let fileResponses = result.map((item) =>
  //           downloadFromS3(item.id, item.image)
  //         );

  //         let SignedUrl = await Promise.all(fileResponses);

  //         result.forEach((item) => {
  //           item.image = SignedUrl.find((url) => url.id == item.id).url;
  //         });

  //         res.status(200).json({
  //           success: true,
  //           data: {
  //             code: 200,
  //             message: "all Bundle",
  //             response: result,
  //           },
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         res.status(500).json({
  //           success: false,
  //           errors: [
  //             {
  //               code: 500,
  //               message:
  //                 "some error occurred in the server try again after some times",
  //               error: err?.message,
  //             },
  //           ],
  //           errorType: "server",
  //         });
  //       });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       errors: [
  //         {
  //           code: 500,
  //           message:
  //             "some error occurred in the server try again after some times",
  //           error: error?.message,
  //         },
  //       ],
  //       errorType: "server",
  //     });
  //   }
  // }
};
