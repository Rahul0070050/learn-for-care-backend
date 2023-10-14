import {
  checkCreateBlogReqBody,
  checkDeleteBlogReqBody,
  checkUpDateBlogImageBodyAndFile,
  checkUpdateBlogDataReqBody,
} from "../../helpers/admin/validateBlogReqData.js";
import { removeFromS3, uploadFileToS3 } from "../../AWS/S3.js";
import {
  deleteBlogById,
  getAllBlogs,
  getBlogById,
  insertNewBlog,
  updateBlogData,
  updateBlogImage,
} from "../../db/mysql/admin/blog.js";

export const blogController = {
  createBlog: (req, res) => {
    try {
      checkCreateBlogReqBody(req.body, req.files)
        .then(async (result) => {
          const blogImage = await uploadFileToS3("/blogs", result[1][0].image);
          insertNewBlog({ ...result[0], image: blogImage.file })
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `blog successfully created`,
                  response: "",
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
        })
        .catch((err) => {
          console.log(err);
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
  getAllBlog:(req, res) => {
    try {
      getAllBlogs().then(result => {
        res.status(200).json({
          success: true,
          data: {
            code: 200,
            message: "all blogs",
            response: result,
          },
        });
      }).catch(err => {
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
      })
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
  updateBlogImage: (req, res) => {
    try {
      checkUpDateBlogImageBodyAndFile(req.body, req.files)
        .then((result) => {
          getBlogById(result[0].blog_id)
            .then(async (blogImage) => {
              blogImage = blogImage.img.split("//").pop();
              await removeFromS3(blogImage);
              const uploadRes = await uploadFileToS3(
                "/blogs",
                result[1][0].image
              );
              updateBlogImage({
                blog_id: result[0].blog_id,
                image: uploadRes.file,
              })
                .then((result) => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: `blog successfully updated`,
                      response: "",
                    },
                  });
                })
                .catch((err) => {
                  res.status(406).json({
                    success: false,
                    errors: [
                      {
                        code: 500,
                        message: "some error occurs in the server",
                        error: err,
                      },
                    ],
                    errorType: "server",
                  });
                });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 500,
                    message: "some error occurs in the server",
                    error: err,
                  },
                ],
                errorType: "server",
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
  updateBlogData: (req, res) => {
    try {
      checkUpdateBlogDataReqBody(req.body)
        .then((result) => {
          updateBlogData(result[0])
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `blog successfully updated`,
                  response: "",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 500,
                    message: "some error occurs in the server",
                    error: err,
                  },
                ],
                errorType: "server",
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
  deleteBlog: (req, res) => {
    try {
      checkDeleteBlogReqBody(req.body)
        .then(async (result) => {
          getBlogById(result[0].blog_id)
            .then(async (blogResult) => {
              let blogImage = blogResult?.img?.split("//").pop() || "";
              await removeFromS3(blogImage);
              deleteBlogById(result[0].blog_id)
                .then((result) => {
                  res.status(200).json({
                    success: true,
                    data: {
                      code: 200,
                      message: `blog successfully deleted`,
                      response: "",
                    },
                  });
                })
                .catch((err) => {
                  res.status(406).json({
                    success: false,
                    errors: [
                      {
                        code: 500,
                        message: "some error occurs in the server",
                        error: err,
                      },
                    ],
                    errorType: "server",
                  });
                });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "id is not correct",
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
