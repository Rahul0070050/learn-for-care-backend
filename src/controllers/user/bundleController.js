import {
  checkGetBundleByIdReqDate,
  validateStartBundleReqData,
} from "../../helpers/user/validateBundleReqData.js";
import { downloadFromS3, uploadFileToS3 } from "../../AWS/S3.js";
import {
  getAllBBundle,
  getCourseBundleById,
  setNewBundleToEnroll,
  startANewBundle,
} from "../../db/mysql/users/courseBundle.js";
import { getCourseByIdFromDb } from "../../db/mysql/users/course.js";
import { getUser } from "../../utils/auth.js";

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
                console.log(startedResult);
                let data = {
                  bundle_id: startedResult.id,
                  validity: startedResult.validity,
                  bundle_name: startedResult.bundleName,
                  user_id: user.id,
                  course_count: JSON.parse(startedResult.course_count).split(",")
                    .length,
                  unfinished_course: JSON.parse(startedResult.course_count).split(
                    ","
                  ),
                };
                setNewBundleToEnroll(data).then(result => {
                  res.status(200).json({
                  success: true,
                  data: {
                    code: 200,
                    message: "bundle",
                    response: result,
                  },
                })
              }).catch(err => {
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
