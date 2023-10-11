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
    return new Promise((resolve, reject) => {
      try {
        checkAddCourseReqBodyAndFile(req.body, req.files)
          .then((result) => {
            console.log(result);
            // uploadFileToS3('/course/video',)
            res.status(200).json({
              success: true,
              data: {
                code: 200,
                message: "course successfully created",
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
    });
  },
  getCourseById: (req, res) => {
    try {
      let id = Number(req?.params?.id);
      checkGetSingleCourseParams(id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: `got one course by id of '${id}'`,
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
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: `got all courses by category`,
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
      res.status(200).json({
        success: true,
        data: {
          code: 200,
          message: "got all courses",
          response: "",
        },
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
          console.log(result);
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
                code: 406,
                message: "values not acceptable",
                error: err,
              },
            ],
            errorType: "client",
          });
        });
      console.log();
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
          console.log(result);

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
