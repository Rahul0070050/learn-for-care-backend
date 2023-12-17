import { downloadFromS3 } from "../../AWS/S3.js";
import {
  getAllOnGoingCourseByUserIdFromDb,
  getCourseAttemptsByUserIdFromDb,
  getOnGoingCourseByIdFromDb,
} from "../../db/mysql/users/onGoingCourse.js";
import {
  checkGetOnGoingCourseByIdReqData,
  validateGetCourseAttemptsById,
} from "../../helpers/user/validateOnGoingCourseReqData.js";
import { getUser } from "../../utils/auth.js";

export const onGoingCourseController = {
  getOnGoingCourseById: (req, res) => {
    try {
      req.params.id = Number(req.params.id);
      checkGetOnGoingCourseByIdReqData(req.params.id)
        .then((result) => {
          let user = getUser(req);
          console.log(user);
          getOnGoingCourseByIdFromDb(result, user.id).then(async (result) => {
            let newResult = await result.map(async (course, i) => {
              try {
                let resources = JSON.parse(course.resource);
                let ppt = JSON.parse(course.ppt);

                delete course.resource;
                delete course.ppt;

                course[`resourceCount`] = resources.length;
                course[`pptCount`] = resources.length;

                resources.forEach((item, i) => {
                  course[`resource${i}-`] = `${item.file}&&${item.name}`;
                });

                ppt.forEach((item, i) => {
                  course[`ppt${i}-`] = item.file;
                });

                let images = [];
                let resource = [];

                for (let index = 0; index < ppt.length; index++) {
                  let link = course[`ppt${index}-`];

                  // let key = urlstring.pop();

                  let url = await downloadFromS3(index, link);

                  delete course[`ppt${index}-`];

                  images.push(url.url);
                }

                for (let index = 0; index < resources.length; index++) {
                  let link = course[`resource${index}-`].split("&&");
                  let url = await downloadFromS3(index, link[0]);

                  resource.push({ url: url.url, fileName: link[1] });

                  delete course[`resource${index}-`];
                }

                let intro_video = await downloadFromS3(
                  course.id,
                  course.intro_video
                );

                let thumbnail = await downloadFromS3(
                  course.id,
                  course.thumbnail
                );

                let video = await downloadFromS3(course.id, course.video);

                course["intro_video"] = intro_video?.url;
                course["thumbnail"] = thumbnail?.url;
                course["video"] = video?.url;
                course["ppt"] = images;
                course["resource"] = resource;

                return course;
              } catch (error) {
                console.log(error);
              }
            });

            Promise.all(newResult)
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
  getAllOnGoingCourseById: (req, res) => {
    try {
      let user = getUser(req);
      getAllOnGoingCourseByUserIdFromDb(user.id, user.type_of_account)
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
  getCourseAttemptsById: (req, res) => {
    try {
      validateGetCourseAttemptsById(req.params)
        .then((result) => {
          getCourseAttemptsByUserIdFromDb(result.id)
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `got data`,
                  response: result,
                },
              });
            })
            .catch((err) => {
              res.status(500).json({
                success: false,
                errors: [
                  {
                    code: 500,
                    message: "err form db",
                    error: err,
                  },
                ],
                errorType: "server",
              });
            });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            errors: [
              {
                code: 500,
                message: "value not acceptable",
                error: err,
              },
            ],
            errorType: "server",
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
