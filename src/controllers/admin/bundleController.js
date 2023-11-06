import { checkCreateBundleReqBody } from "../../helpers/admin/validateBundleReqData.js";
import { downloadFromS3, uploadFileToS3 } from "../../AWS/S3.js";
import {
  getCourseBundleById,
  insertNewBundle,
} from "../../db/mysql/admin/courseBundle.js";

export const bundleController = {
  createBundle: (req, res) => {
    try {
      let courseId = req.body.courses.split(",").map((item) => Number(item));
      req.body.courses = courseId;
      checkCreateBundleReqBody(req.body, req.files)
        .then(async (result) => {
          const blogImage = await uploadFileToS3("/blogs", result[1][0]?.image);
          insertNewBundle({ ...result[0], image: blogImage.file })
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
          console.log(err);
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
  }
};
