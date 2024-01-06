import {
  checkCreateBundleReqBody,
  validateDeleteBundle,
  validateEditBundle,
  validateEditBundleImage,
} from "../../helpers/admin/validateBundleReqData.js";
import { downloadFromS3, uploadFileToS3 } from "../../AWS/S3.js";
import {
  EditBundleFromDb,
  deleteBundleFromDb,
  getAllBundles,
  getCourseBundleById,
  insertNewBundle,
} from "../../db/mysql/admin/courseBundle.js";

export const bundleController = {
  createBundle: (req, res) => {
    try {
      checkCreateBundleReqBody(req.body, req.files)
        .then(async (result) => {
          const blogImage = await uploadFileToS3("/blogs", result[1][0]?.image);
          insertNewBundle({ ...req.body, image: blogImage.file })
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `bundle successfully created`,
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
  getAllCourseBundles: (req, res) => {
    try {
      getAllBundles()
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: `got all bundle`,
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
  deleteBundle: (req, res) => {
    try {
      validateDeleteBundle(req.params)
        .then((result) => {
          deleteBundleFromDb(result.id)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `bundle deleted`,
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
  editBundleInfo: (req, res) => {
    try {
      validateEditBundle(req.body)
        .then((result) => {
          EditBundleFromDb(result)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `bundle updated`,
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
  // editBundleImage: (req, res) => {
  //   try {
  //     validateEditBundleImage(req.body,req.files)
  //       .then((result) => {
  //         EditBundleFromDb(result)
  //           .then(() => {
  //             res.status(200).json({
  //               success: true,
  //               data: {
  //                 code: 200,
  //                 message: `bundle updated`,
  //                 response: result,
  //               },
  //             });
  //           })
  //           .catch((err) => {
  //             res.status(406).json({
  //               success: false,
  //               errors: [
  //                 {
  //                   code: 406,
  //                   message: "value not acceptable",
  //                   error: err,
  //                 },
  //               ],
  //               errorType: "client",
  //             });
  //           });
  //       })
  //       .catch((err) => {
  //         res.status(406).json({
  //           success: false,
  //           errors: [
  //             {
  //               code: 406,
  //               message: "value not acceptable",
  //               error: err,
  //             },
  //           ],
  //           errorType: "client",
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
  // },
};
