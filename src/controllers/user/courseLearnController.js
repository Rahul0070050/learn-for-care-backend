import { downloadFromS3 } from "../../AWS/S3.js";
import { getOnGoingCourseByIdFromDb } from "../../db/mysql/users/onGoingCourse.js";
import { checkGetOnGoingCourseByIdReqData } from "../../helpers/user/validateOnGoingCourseReqData.js";

export const onGoingCourseController = {
  getOnGoingCourseById: (req, res) => {
    try {
      req.params.id = Number(req.params.id);
      checkGetOnGoingCourseByIdReqData(req.params.id)
        .then((result) => {
          getOnGoingCourseByIdFromDb(result).then(async (result) => {
            let newResult = await result.map(async (course, i) => {
              let resources = JSON.parse(course.resource);

              delete course.resource;

              course[`resourceCount`] = resources.length;

              resources.forEach((item, i) => {
                course[`resource${i}`] = `${item.file}##${item.type}`;
              });

              for (let index = 0; index < resources.length; index++) {
                let urlstring = course[`resource${index}`].split("##");

                let type = urlstring.pop();

                let key = urlstring.pop();

                let url = await downloadFromS3(index, key);

                course[`resource${index}`] = `${url.url}##${type}`;
              }

              let intro_video = await downloadFromS3(
                course.id,
                course.intro_video
              );

              let thumbnail = await downloadFromS3(course.id, course.thumbnail);

              let video = await downloadFromS3(course.id, course.video);

              let ppt = await downloadFromS3(course.id, course.ppt);

              course["intro_video"] = intro_video?.url;
              course["thumbnail"] = thumbnail?.url;
              course["video"] = video?.url;
              course["ppt"] = ppt?.url;

              return course;
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
};