import {
  getQuestionsForExamByCourseId,
} from "../../db/mysql/admin/exam.js";
import { checkGetExamReqBody } from "../../helpers/user/validateExamReqData.js";

export const examController = {
  getExam: (req, res) => {
    try {
      checkGetExamReqBody(req.body)
        .then((result) => {
          console.log(result);
          getQuestionsForExamByCourseId(result.course_id)
            .then((exam) => {
              exam.map((item) => {
                let options = JSON.parse(item.options)
                item.options = options
                return item
              })
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "got exam",
                  response: exam,
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: true,
                data: {
                  code: 406,
                  message: "value not acceptable",
                  response: err,
                },
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
