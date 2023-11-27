import {
  getQuestionsById,
  getQuestionsForExamByCourseId,
} from "../../db/mysql/admin/exam.js";
import {
  checkGetExamReqBody,
  validateValidateExamReqData,
} from "../../helpers/user/validateExamReqData.js";

export const examController = {
  getExam: (req, res) => {
    try {
      checkGetExamReqBody(req.body)
        .then((result) => {
          getQuestionsForExamByCourseId(result.course_id)
            .then((exam) => {
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
  validate: (req, res) => {
    try {
      validateValidateExamReqData(req.body).then(async (result) => {
        let answers = JSON.parse(result.answer);
        let questions = await getQuestionsById(result.question_id);
        let realAnswers = JSON.parse(questions[0].exam)
        let points = 0;
        realAnswers.map(item => {
          let ans = answers.find(i => i.question == item.question)
          if(ans.answer == item.answer) {
            ++points
          }
        })
        console.log(points)
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
