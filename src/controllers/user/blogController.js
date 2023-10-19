import { downloadFromS3 } from "../../AWS/S3.js";
import { getAllBlogs, getBlogByIdFromDb } from "../../db/mysql/users/blogs.js";
import { checkGetBlogByIdReqDate } from "../../helpers/user/validateBlogReqData.js";

export const blogController = {
  getBlogById: (req, res) => {
    try {
      checkGetBlogByIdReqDate(req.params.id)
        .then((result) => {
          getBlogByIdFromDb(result)
            .then(async (blog) => {
              if (blog.length) {
                let signedUrl = await downloadFromS3(blog.id, blog[0].img);
                blog[0].img = signedUrl.url;
              }
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "blog by id",
                  response: blog,
                },
              });
            })
            .catch((err) => {
              console.log(err);
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
  getAllBlog: (req, res) => {
    try {
      getAllBlogs()
        .then(async (result) => {
          let fileResponses = result.map((item) =>
            downloadFromS3(item.id, item.img)
          );

          let SignedUrl = await Promise.all(fileResponses);

          result.forEach((item) => {
            item.img = SignedUrl.find((url) => url.id == item.id).url;
          });
          
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "all blogs",
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
                error: err?.message,
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
