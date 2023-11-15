import {
  getAllExam,
  insertQuestionsToExam,
} from "../../db/mysql/admin/exam.js";
import {
  checkAddExamReqBody,
  checkGetExamReqBody,
} from "../../helpers/admin/validateExamReqData.js";

export const examController = {
  createExam: (req, res) => {
    try {
      checkAddExamReqBody(req.body)
        .then((result) => {
          Promise.all(
            result.questions.map(async (question) => {
              return await insertQuestionsToExam({
                ...question,
                course_id: result.course_id,
              });
            })
          )
            .then((result) => {
              res.status(201).json({
                success: true,
                data: {
                  code: 201,
                  message: "exam assigned",
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
        })
        .catch((err) => {});
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
  getAllExam: (req, res) => {
    try {
      getAllExam()
        .then((result) => {
          res.status(201).json({
            success: true,
            data: {
              code: 201,
              message: "got exams",
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
  getExam: (req, res) => {
    try {
      checkGetExamReqBody(req.body)
        .then((result) => {
          res.status(201).json({
            success: true,
            data: {
              code: 201,
              message: "got exams",
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
};
