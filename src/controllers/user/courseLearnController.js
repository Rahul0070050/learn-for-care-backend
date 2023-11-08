import { getOnGoingCourseByIdFromDb } from "../../db/mysql/users/onGoingCourse.js";
import { checkGetOnGoingCourseByIdReqData } from "../../helpers/user/validateOnGoingCourseReqData.js";

export const onGoingCourseController = {
  getOnGoingCourseById: (req, res) => {
    try {
      req.param.id = Number(req.param.id);
      checkGetOnGoingCourseByIdReqData(req.param.id)
        .then((result) => {
          getOnGoingCourseByIdFromDb(result)
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
};
