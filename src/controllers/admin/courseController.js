import { removeFromS3, uploadFileToS3 } from "../../AWS/S3.js";
import {
  addNewCourse,
  getAllCoursesFromDb,
  getCourseByCategory,
  getCourseByIdFromDb,
  updateCourseData,
  updateCourseSingleFieldMediaById,
} from "../../db/mysql/admin/course.js";
import {
  checkAddCourseReqBodyAndFile,
  checkGetCourseByCategoryBody,
  checkGetSingleCourseParams,
  checkUpdateCourseDataReqBodyAndFile,
  checkUpdateCourseIntroVideoReqBodyAndFile,
  checkUpdateCoursePdfReqBodyAndFile,
  checkUpdateCoursePptReqBodyAndFile,
  checkUpdateCourseThumbnailReqBodyAndFile,
  checkUpdateCourseVideoReqBodyAndFile,
} from "../../helpers/admin/validateCourseReqData.js";

export const courseController = {
  createCourse: (req, res) => {
    try {
      checkAddCourseReqBodyAndFile(req.body, req.files)
        .then((result) => {
          let video = uploadFileToS3("/course/video", result[1][0].video);
          let introVideo = uploadFileToS3(
            "/course/intro_video",
            result[2][0].intro_video
          );
          let thumbnail = uploadFileToS3(
            "/course/thumbnail",
            result[3][0].thumbnail
          );
          let ppt = uploadFileToS3("/course/ppt", result[5][0].ppt);
          let pdf = result[4].map((file) =>
            uploadFileToS3("/course/pdf", file.pdf)
          );

          Promise.all([video, introVideo, thumbnail, ppt, ...pdf])
            .then((uploadedResult) => {
              uploadedResult.forEach((file) => {
                if (file.name == "pdf") {
                  if (Array.isArray(result[0][file.name])) {
                    result[0][file.name].push({ file: file.file });
                  } else {
                    result[0][file.name] = [{ file: file.file }];
                  }
                } else {
                  result[0][file.name] = file.file;
                }
              });
              addNewCourse(result[0])
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
                error: "err" + err,
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
            .then((result) => {
              result.pdf = JSON.parse(result.pdf);
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
        .then((result) => {
          result = result.map((course) => {
            course.pdf = JSON.parse(course.pdf);
            return course;
          });

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
  updateCourseVideo: (req, res) => {
    try {
      checkUpdateCourseVideoReqBodyAndFile(req.files, req.body)
        .then((result) => {
          getCourseByIdFromDb(result[1].course_id)
            .then(async (course) => {
              let key = course.video.split("//").pop();
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
  updateCoursePdf: (req, res) => {
    try {
      checkUpdateCoursePdfReqBodyAndFile(req.files, req.body)
        .then((result) => {
          getCourseByIdFromDb(req.body.course_id)
            .then(async (course) => {
              let pdfFiles = req.files.pdf;

              if (!Array.isArray(pdfFiles)) {
                pdfFiles = [pdfFiles];
              }

              let pdf = JSON.parse(course.pdf);

              pdf.forEach((file) => {
                let key = file.file.split("//").pop();
                removeFromS3(key);
              });

              let uploadedFileArray = pdfFiles.map((file) =>
                uploadFileToS3("/course/pdf", file)
              );

              let files = await Promise.all(uploadedFileArray);

              let pdfFilesS3Links = files.map((file) => {
                return { file: file.file };
              });

              pdf = JSON.stringify(pdfFilesS3Links);

              updateCourseSingleFieldMediaById(req.body.course_id, pdf, "pdf")
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "course pdf file updated",
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
  updateCoursePpt: (req, res) => {
    try {
      checkUpdateCoursePptReqBodyAndFile(req.files, req.body)
        .then((result) => {
          getCourseByIdFromDb(req.body.course_id)
            .then(async (course) => {
              let key = course.ppt.split("//").pop();
              console.log();
              await removeFromS3(key);
              let uploadedResult = await uploadFileToS3(
                "/course/ppt",
                result[0][0].ppt
              );
              updateCourseSingleFieldMediaById(
                req.body.course_id,
                uploadedResult.file,
                "ppt"
              )
                .then(() => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: "course ppt file updated",
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
  updateCourseIntroVideo: (req, res) => {
    try {
      checkUpdateCourseIntroVideoReqBodyAndFile(req.files, req.body)
        .then((result) => {
          getCourseByIdFromDb(req.body.course_id)
            .then(async (course) => {
              console.log(result[0][0].intro_video);
              let key = course.intro_video.split("//").pop();
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
              console.log(result[0][0].intro_video);
              let key = course.thumbnail.split("//").pop();
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
};
