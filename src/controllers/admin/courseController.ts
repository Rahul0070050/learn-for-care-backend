import { Request, Response } from "express";
import {
  checkAddCourseReqBodyAndFile,
  checkGetSingleCourseParams,
} from "../../helpers/admin/validateCourseReqData";

export const courseController = {
  createCourse: (req: Request, res: Response) => {
    return new Promise((resolve, reject) => {
      try {
        checkAddCourseReqBodyAndFile(req.body, req.files)
          .then((result) => {
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
              message: "one course data",
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
  getAllCourses: (req: Request, res: Response) => {
    try {
        // getAllCouserFromBD()
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
