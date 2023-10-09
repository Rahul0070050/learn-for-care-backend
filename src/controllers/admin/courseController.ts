import { Request, Response } from "express";
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
} from "../../helpers/admin/validateCourseReqData";
import { uploadFileToS3 } from "../../AWS/S3";

export const courseController = {
  createCourse: (req: Request, res: Response) => {
    return new Promise((resolve, reject) => {
      try {
        checkAddCourseReqBodyAndFile(req.body, req.files)
          .then((result) => {
            console.log(result);
            // uploadFileToS3('/course/video')
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
      } catch (error: any) {
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
  getCourseById: (req: Request, res: Response) => {
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
    } catch (error: any) {
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
  getCourseByCategory: (req: Request, res: Response) => {
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
    } catch (error: any) {
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
  getAllCourses: (req: Request, res: Response) => {
    try {
      res.status(200).json({
        success: true,
        data: {
          code: 200,
          message: "got all courses",
          response: "",
        },
      });
    } catch (error: any) {
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
  updateCourseVideo: (req: Request, res: Response) => {
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
        .catch((err: any) => {
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
    } catch (error: any) {
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
  updateCoursePdf: (req: Request, res: Response) => {
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
    } catch (error: any) {
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
  updateCoursePpt: (req: Request, res: Response) => {
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
        .catch((err: any) => {
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
    } catch (error: any) {
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
  updateCourseIntroVideo: (req: Request, res: Response) => {
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
        .catch((err: any) => {
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
    } catch (error: any) {
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
  updateCourseThumbnail: (req: Request, res: Response) => {
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
        .catch((err: any) => {
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
    } catch (error: any) {
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
  updateCourseData: (req: Request, res: Response) => {
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
    } catch (error: any) {
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
