import {
  checkCreateBlogReqBody,
  checkDeleteBlogReqBody,
  checkGetBlogByIdReqDate,
  checkUpDateBlogImageBodyAndFile,
  checkUpdateBlogDataReqBody,
  checkUpdateBlogStatusReqBody
} from "../../helpers/admin/validateBlogReqData.js";
import { downloadFromS3, removeFromS3, uploadFileToS3 } from "../../AWS/S3.js";
import {
  deleteBlogById,
  getAllBlogs,
  getAllBlogsForAdmin,
  getBlogById,
  getBlogByIdFromDb,
  getInactiveBlogs,
  insertNewBlog,
  setBlogInactivate,
  updateBlogData,
  updateBlogImage,
} from "../../db/mysql/admin/blog.js";

export const blogController = {
  createBlog: (req, res) => {
    try {
      console.log(req.body, req.files);
      checkCreateBlogReqBody(req.body, req.files)
        .then(async (result) => {
          let tags = result[0].tags.split(",").map((tag) => "#" + tag);
          result[0].tags = JSON.stringify(tags);
          const blogImage = await uploadFileToS3("/blogs", result[1][0]?.image);
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
  getAllInactiveBlogs:(req,res) => {
    try {
      getInactiveBlogs().then(result => {
        res.status(200).json({
          success: true,
          data: {
            code: 200,
            message: `blog view count updated`,
            response: result,
          },
        });
      }).catch(err => {
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
  updateBlogStatus: (req, res) => {
    // seting active or inactive
    try {
      checkUpdateBlogStatusReqBody(req.body)
        .then((result) => {
          setBlogInactivate(result.id, result.status)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `blog status updated`,
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
                    message: "error from db",
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
              res.status(500).json({
                success: false,
                errors: [
                  {
                    code: 500,
                    message: "some error occur while getting the blogs",
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
  getAllBlog: (req, res) => {
    try {
      getAllBlogsForAdmin()
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
  updateBlogImage: (req, res) => {
    try {
      console.log(req.files);
      checkUpDateBlogImageBodyAndFile(req.body, req.files)
      .then((result) => {
          console.log(result);
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
          let tags = result[0].tags.split(",").map((tag) => "#" + tag);
          result[0].tags = JSON.stringify(tags);
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
              let blogImage = blogResult?.img;
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
