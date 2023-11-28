import { uploadPdfToS3 } from "../../AWS/S3.js";
import { convertHtmlToPdf } from "../../certificate/courseCertificate.js";
import { insertNewCertificate } from "../../db/mysql/admin/certificate.js";
import {
  getQuestionsById,
  getQuestionsForExamByCourseId,
  saveExamResult,
} from "../../db/mysql/admin/exam.js";
import {
  checkGetExamReqBody,
  validateValidateExamReqData,
} from "../../helpers/user/validateExamReqData.js";
import { getUser } from "../../utils/auth.js";
import { v4 as uuid} from "uuid";

export const examController = {
  getExam: (req, res) => {
    try {
      checkGetExamReqBody(req.body)
        .then((result) => {
          let user = getUser(req);
          getQuestionsForExamByCourseId(
            result.course_id,
            user.id,
            result.enrolled_course_id
          )
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
        let realAnswers = JSON.parse(questions[0].exam);
        let points = 0;
        let user = getUser(req);
        realAnswers.map((item) => {
          let ans = answers.find((i) => i.question == item.question);
          if (ans.answer == item.answer) {
            ++points;
          }
        });
        let per = (points / answers.length) * 100;
        saveExamResult(
          per,
          result.question_id,
          user.id,
          result.enrolled_course_id
        )
          .then(async () => {
            if (per > 80) {
              let filePath = uuid() + ".pdf";
              await convertHtmlToPdf(filePath);
              let url = await uploadPdfToS3(filePath);
              insertNewCertificate({ ...result, user_id: user.id, user_name: user.first_name+ " "+ user.last_name,per,date: new Date(),  image: url.file })
                .then(async (result) => {
                  res.status(201).json({
                    success: true,
                    data: {
                      code: 201,
                      message: "you successfully finished the course",
                      response: {
                        per: per + " %",
                        rightAnswers: points,
                        wrongAnswers: answers.length - points,
                      },
                    },
                  });
                })
                .catch((error) => {
                  res.status(406).json({
                    success: false,
                    errors: [
                      {
                        code: 406,
                        message: "error from db acceptable",
                        error: error,
                      },
                    ],
                    errorType: "client",
                  });
                });
            } else {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "result",
                  response: {
                    per: per + " %",
                    rightAnswers: points,
                    wrongAnswers: answers.length - points,
                  },
                },
              });
            }
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
        console.log(points);
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
