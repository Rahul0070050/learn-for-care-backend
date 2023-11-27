import { downloadFromS3 } from "../../AWS/S3.js";
import {
  getAllOnGoingCourseByUserIdFromDb,
  getOnGoingCourseByIdFromDb,
} from "../../db/mysql/users/onGoingCourse.js";
import { checkGetOnGoingCourseByIdReqData } from "../../helpers/user/validateOnGoingCourseReqData.js";
import { getUser } from "../../utils/auth.js";

export const onGoingCourseController = {
  getOnGoingCourseById: (req, res) => {
    try {
      req.params.id = Number(req.params.id);
      checkGetOnGoingCourseByIdReqData(req.params.id)
        .then((result) => {
          let user = getUSer(req)
          console.log(user.id);
          getOnGoingCourseByIdFromDb(result,user.id).then(async (result) => {
            let newResult = await result.map(async (course, i) => {
              try {
                console.log(course);
                let resources = JSON.parse(course.resource);
                let ppt = JSON.parse(course.ppt);

                delete course.resource;
                delete course.ppt;

                course[`resourceCount`] = resources.length;
                course[`pptCount`] = resources.length;

                resources.forEach((item, i) => {
                  console.log(item.file + ":" + item.type);
                  course[`resource${i}-`] = item.file;
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

                  images.push(url.url);
                }

                for (let index = 0; index < resources.length; index++) {
                  let link = course[`resource${index}-`];
                  let url = await downloadFromS3(index, link);

                  resource.push(url.url);
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
};
