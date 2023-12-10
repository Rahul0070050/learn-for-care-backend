import { downloadFromS3, removeFromS3, uploadFileToS3 } from "../../AWS/S3.js";
import {
  addNewCourse,
  getAllCoursesFromDb,
  getCourseByCategory,
  getCourseByIdFromDb,
  updateCourseData,
  updateCourseSingleFieldMediaById,
  deleteCourseFromDb,
} from "../../db/mysql/admin/course.js";
import {
  getAllPurchasedCourseFromDb,
  getReportFromDb,
  getReportFromDbGroupByYear,
} from "../../db/mysql/admin/purchasedCourse.js";
import {
  getManagerBundleMatrixData,
  getManagerMatrixData,
} from "../../db/mysql/users/enrolledCourse.js";
import {
  checkAddCourseReqBodyAndFile,
  checkGetCourseByCategoryBody,
  checkGetSingleCourseParams,
  checkUpdateCourseDataReqBodyAndFile,
  checkUpdateCourseIntroVideoReqBodyAndFile,
  checkUpdateCoursePptReqBodyAndFile,
  checkUpdateCourseResourceReqBodyAndFile,
  checkUpdateCourseThumbnailReqBodyAndFile,
  checkUpdateCourseVideoReqBodyAndFile,
  checkDeleteCourseParams,
} from "../../helpers/admin/validateCourseReqData.js";

export const courseController = {
  createCourseWithResourceImages: (req, res) => {
    try {
      checkAddCourseReqBodyAndFile(req.body, req.files)
        .then((result) => {
          try {
            let video = uploadFileToS3("/course/video", result.video);

            let introVideo = null;

            if (result?.intro_video?.mv) {
              introVideo = uploadFileToS3(
                "/course/intro_video",
                result?.intro_video
              );
            } else {
              introVideo = Promise.resolve({ name: "intro_video", file: "" });
            }

            let thumbnail = uploadFileToS3(
              "/course/thumbnail",
              result.thumbnail
            );

            //  = uploadFileToS3("/course/ppt", result.ppt);

            let ppt = result.image.map((file) =>
              uploadFileToS3("/course/image", file)
            );
            let resource = result.resource.map((file) =>
              uploadFileToS3("/course/resource", file)
            );

            Promise.all([video, introVideo, thumbnail, ...ppt, ...resource])
              .then((uploadedResult) => {
                result.resource = [];
                result.image = [];
                uploadedResult.forEach((file) => {
                  if (file.name == "resource") {
                    result[file.name].push({
                      type: file.type,
                      file: file.file,
                      name: file.fileName,
                    });
                  } else if (file.name == "image") {
                    result[file.name].push({
                      type: file.type,
                      file: file.file,
                    });
                  } else {
                    result[file.name] = file.file;
                  }
                });
                console.log(result);
                addNewCourse(result)
                  .then(() => {
                    res.status(200).json({
                      success: true,
                      data: {
                        code: 200,
                        message: "course successfully created",
                        response: result[0],
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
                            "some error occurred while saving your data try again after some times",
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
            console.log(error);
          }
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
  createCourse: (req, res) => {
    try {
      checkAddCourseReqBodyAndFile(req.body, req.files)
        .then((result) => {
          let video = uploadFileToS3("/course/video", result.video);

          let introVideo = null;

          if (result?.intro_video?.mv) {
            introVideo = uploadFileToS3(
              "/course/intro_video",
              result?.intro_video
            );
          } else {
            introVideo = Promise.resolve({ name: "intro_video", file: "" });
          }

          let thumbnail = uploadFileToS3("/course/thumbnail", result.thumbnail);

          let ppt = uploadFileToS3("/course/ppt", result.ppt);

          let resource = result.resource.map((file) =>
            uploadFileToS3("/course/resource", file)
          );

          Promise.all([video, introVideo, thumbnail, ppt, ...resource])
            .then((uploadedResult) => {
              result.resource = [];
              uploadedResult.forEach((file) => {
                if (file.name == "resource") {
                  result[file.name].push({ type: file.type, file: file.file });
                } else {
                  result[file.name] = file.file;
                }
              });
              addNewCourse(result)
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "course successfully created",
                      response: result[0],
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
                          "some error occurred while saving your data try again after some times",
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
  getCourseById: (req, res) => {
    try {
      let id = Number(req?.params?.id);
      checkGetSingleCourseParams(id)
        .then((result) => {
          getCourseByIdFromDb(id)
            .then(async (result) => {
              console.log(result);
              let newResult = await result.map(async (course, i) => {
                try {
                  let resources = JSON.parse(course.resource);
                  let ppt = JSON.parse(course.ppt);

                  delete course.resource;
                  delete course.ppt;

                  course[`resourceCount`] = resources.length;
                  course[`pptCount`] = resources.length;

                  resources.forEach((item, i) => {
                    course[`resource${i}`] = item.file;
                  });

                  let images = [];

                  ppt.forEach((item, i) => {
                    course[`ppt${i}`] = item.file;
                  });

                  for (let index = 0; index < resources.length; index++) {
                    let urlstring = course[`resource${index}`];

                    let url = await downloadFromS3(index, urlstring);

                    course[`resource${index}`] = `${url.url}##${url.type}`;
                  }

                  for (let index = 0; index < ppt.length; index++) {
                    let urlstring = course[`ppt${index}`];

                    let url = await downloadFromS3(index, urlstring);

                    images.push(url.url);
                  }

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
                  // course["ppt"] = ppt;

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
                let resources = JSON.parse(course.resource);
                let ppt = JSON.parse(course.ppt);

                delete course.resource;
                delete course.ppt;

                course[`resourceCount`] = resources.length;
                course[`pptCount`] = resources.length;

                resources.forEach((item, i) => {
                  course[`resource${i}`] = item.file;
                });

                ppt.forEach((item, i) => {
                  course[`ppt-${i}`] = item.file + ":" + item.type;
                });

                for (let index = 0; index < resources.length; index++) {
                  let urlstring = course[`resource${index}`].split(":");

                  let type = urlstring.pop();

                  let key = urlstring.pop();

                  let url = await downloadFromS3(index, key);

                  course[`ppt-${index}`] = `${url.url}:${type}`;
                }

                for (let index = 0; index < resources.length; index++) {
                  let urlstring = course[`pptCount${index}`].split("##");

                  let type = urlstring.pop();

                  let key = urlstring.pop();

                  let url = await downloadFromS3(index, key);

                  course[`resource${index}`] = `${url.url}##${type}`;
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
                course["ppt"] = ppt?.url;

                return course;
              });

              Promise.all(newResult)
                .then((result) => {
                  // console.log();
                  // result.forEach((course) => {

                  // });

                  // result.forEach(course => {

                  // })

                  // console.log(result[0]);

                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: `got all courses by category`,
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
            try {
              let resources = JSON.parse(course.resource);
              let ppt = JSON.parse(course.ppt);

              delete course.resource;
              delete course.ppt;

              course[`resourceCount`] = resources.length;
              course[`pptCount`] = resources.length;

              resources.forEach((item, i) => {
                console.log(item.file + ":" + item.type);
                course[`resource${i}-`] = item.file + ":" + item.type;
              });

              ppt.forEach((item, i) => {
                course[`ppt${i}-`] = item.file + ":" + item.type;
              });

              let images = [];

              for (let index = 0; index < ppt.length; index++) {
                let urlstring = course[`ppt${index}-`].split(":");

                let type = urlstring.pop();

                let key = urlstring.pop();

                let url = await downloadFromS3(index, key);

                images.push(url.url);
              }

              for (let index = 0; index < resources.length; index++) {
                let urlstring = course[`resource${index}-`].split(":");

                let type = urlstring.pop();

                let key = urlstring.pop();

                let url = await downloadFromS3(index, key);

                course[`resource${index}`] = `${url.url}##${type}`;
              }

              let intro_video = await downloadFromS3(
                course.id,
                course.intro_video
              );

              let thumbnail = await downloadFromS3(course.id, course.thumbnail);

              let video = await downloadFromS3(course.id, course.video);

              course["intro_video"] = intro_video?.url;
              course["thumbnail"] = thumbnail?.url;
              course["video"] = video?.url;
              course["ppt"] = images;

              return course;
            } catch (error) {
              console.log(error);
            }
          });

          Promise.all(newResult)
            .then((result) => {
              // result[0] = result[2];
              // result[1] = result[2];
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
  getAllPurchasedCourse: (req, res) => {
    try {
      getAllPurchasedCourseFromDb()
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
  getAllPurchasedCourseReportGroupBy: (req, res) => {
    try {
      getReportFromDbGroupByYear()
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "get group by",
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
  updateCourseVideo: (req, res) => {
    try {
      checkUpdateCourseVideoReqBodyAndFile(req.files, req.body)
        .then((result) => {
          getCourseByIdFromDb(result[1].course_id)
            .then(async (course) => {
              let key = course.video;
              await removeFromS3(key);
              let uploadedResult = await uploadFileToS3(
                "/course/video",
                result[0][0].video
              );
              updateCourseSingleFieldMediaById(
                result[1].course_id,
                uploadedResult.file,
                "video"
              )
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "course video file updated",
                      response: "",
                    },
                  });
                })
                .catch((err) => {
                  res.status(406).json({
                    success: false,
                    errors: [
                      {
                        code: 500,
                        message:
                          "some error occurred in the server try again after some times",
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
                    message: "invalid id",
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
            message:
              "some error occurred in the server try again after some times",
            error: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
  updateCourseResource: (req, res) => {
    try {
      checkUpdateCourseResourceReqBodyAndFile(req.files, req.body)
        .then((result) => {
          getCourseByIdFromDb(Number(req.body.course_id))
            .then(async (course) => {
              try {
                let resourceFiles = req.files.resource;

                if (!Array.isArray(resourceFiles)) {
                  resourceFiles = [resourceFiles];
                }

                let resource = [];
                if (course.resource) {
                  resource = JSON.parse(course.resource);
                }

                resource.forEach((file) => {
                  let key = file.file;
                  removeFromS3(key);
                });

                let uploadedFileArray = resourceFiles.map((file) =>
                  uploadFileToS3("/course/resource", file)
                );

                let files = await Promise.all(uploadedFileArray);

                let resourceFilesS3Links = files.map((file) => {
                  return {
                    type: file.type,
                    file: file.file,
                    name: file.fileName,
                  };
                });

                resource = JSON.stringify(resourceFilesS3Links);

                updateCourseSingleFieldMediaById(
                  req.body.course_id,
                  resource,
                  "resource"
                )
                  .then(() => {
                    res.status(200).json({
                      success: true,
                      data: {
                        code: 200,
                        message: "course resource file updated",
                        response: "",
                      },
                    });
                  })
                  .catch((err) => {
                    res.status(406).json({
                      success: false,
                      errors: [
                        {
                          code: 500,
                          message:
                            "some error occurred in the server try again after some times",
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
                    message: "invalid id",
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
            message:
              "some error occurred in the server try again after some times",
            error: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
  updateCoursePpt: (req, res) => {
    try {
      checkUpdateCoursePptReqBodyAndFile(req.files, req.body)
        .then((result) => {
          console.log(result);
          // getCourseByIdFromDb(req.body.course_id)
          //   .then(async (course) => {
          //     let key = course.ppt;
          //     await removeFromS3(key);
          //     let uploadedResult = await uploadFileToS3(
          //       "/course/image",
          //       result[0][0].ppt
          //     );
          //     updateCourseSingleFieldMediaById(
          //       req.body.course_id,
          //       uploadedResult.file,
          //       "ppt"
          //     )
          //       .then(() => {
          //         res.status(200).json({
          //           success: true,
          //           data: {
          //             code: 200,
          //             message: "course ppt file updated",
          //             response: "",
          //           },
          //         });
          //       })
          //       .catch((err) => {
          //         res.status(406).json({
          //           success: false,
          //           errors: [
          //             {
          //               code: 500,
          //               message:
          //                 "some error occurred in the server try again after some times",
          //               error: err,
          //             },
          //           ],
          //           errorType: "client",
          //         });
          //       });
          //   })
          //   .catch((err) => {
          //     res.status(406).json({
          //       success: false,
          //       errors: [
          //         {
          //           code: 406,
          //           message: "invalid id",
          //           error: err,
          //         },
          //       ],
          //       errorType: "client",
          //     });
          //   });
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
  updateCourseIntroVideo: (req, res) => {
    try {
      checkUpdateCourseIntroVideoReqBodyAndFile(req.files, req.body)
        .then((result) => {
          getCourseByIdFromDb(req.body.course_id)
            .then(async (course) => {
              let key = course.intro_video;
              await removeFromS3(key);
              let uploadedResult = await uploadFileToS3(
                "/course/intro_video",
                result[0][0].intro_video
              );
              updateCourseSingleFieldMediaById(
                req.body.course_id,
                uploadedResult.file,
                "intro_video"
              )
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "course intro video file updated",
                      response: "",
                    },
                  });
                })
                .catch((err) => {
                  res.status(406).json({
                    success: false,
                    errors: [
                      {
                        code: 500,
                        message:
                          "some error occurred in the server try again after some times",
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
                    message: "invalid id",
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
            message:
              "some error occurred in the server try again after some times",
            error: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
  updateCourseThumbnail: (req, res) => {
    try {
      checkUpdateCourseThumbnailReqBodyAndFile(req.files, req.body)
        .then((result) => {
          getCourseByIdFromDb(req.body.course_id)
            .then(async (course) => {
              let key = course.thumbnail;
              await removeFromS3(key);
              let uploadedResult = await uploadFileToS3(
                "/course/thumbnail",
                result[0][0].thumbnail
              );
              updateCourseSingleFieldMediaById(
                req.body.course_id,
                uploadedResult.file,
                "thumbnail"
              )
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "course thumbnail file updated",
                      response: "",
                    },
                  });
                })
                .catch((err) => {
                  res.status(406).json({
                    success: false,
                    errors: [
                      {
                        code: 500,
                        message:
                          "some error occurred in the server try again after some times",
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
                    message: "invalid id",
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
            message:
              "some error occurred in the server try again after some times",
            error: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
  updateCourseData: (req, res) => {
    try {
      checkUpdateCourseDataReqBodyAndFile(req.body)
        .then((result) => {
          updateCourseData(result)
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "course data file updated",
                  response: "",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 500,
                    message:
                      "some error occurred in the server try again after some times",
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
            message:
              "some error occurred in the server try again after some times",
            error: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
  deleteCourse: (req, res) => {
    try {
      checkDeleteCourseParams(req.params.id)
        .then((result) => {
          deleteCourseFromDb(result)
            .then(async (course) => {
              await removeFromS3(course?.thumbnail || "");
              await removeFromS3(course?.video || "");
              await removeFromS3(course?.ppt || "");
              await removeFromS3(course?.intro_video || "");

              course?.resource?.forEach(async (url) => {
                await removeFromS3(url.file);
              });

              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "course deleted",
                  response: "",
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
                    error: error?.message,
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
                error: error?.message,
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
  getManagerMatrix: (req, res) => {
    try {
      let userId = req.body?.manager_id;
      getManagerMatrixData(userId)
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
            message:
              "some error occurred in the server try again after some times",
            error: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
  getManagerMatrixBundle: (req, res) => {
    try {
      let userId = req.body?.manager_id;
      getManagerBundleMatrixData(userId)
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
