import { insertQuestionsToExam } from "../../db/mysql/admin/exam.js";
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
            .then((result) => {})
            .catch((err) => {});
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

  getExam: (req, res) => {
    try {
      checkGetExamReqBody(req.body)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
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
