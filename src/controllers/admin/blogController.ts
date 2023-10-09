import { Request, Response } from "express";
import {
  checkCreateBlogReqBody,
  checkDeleteBlogReqBody,
  checkUpDateBlogImageBodyAndFile,
  checkUpdateBlogDataReqBody,
} from "../../helpers/admin/validateBlogReqData";
import { removeFromS3, uploadFileToS3 } from "../../AWS/S3";
import {
  deleteBlogById,
  getBlogById,
  insertNewBlog,
  updateBlogData,
  updateBlogImage,
} from "../../db/mysql/admin/blog";

export const blogController = {
  createBlog: (req: Request, res: Response) => {
    try {
      checkCreateBlogReqBody(req.body, req.files)
        .then(async (result: any) => {
          const blogImage = (await uploadFileToS3(
            "/blogs",
            result[1].image
          )) as { ok: boolean; file: string };
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
    } catch (error: any) {
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
  updateBlogImage: (req: Request, res: Response) => {
    try {
      checkUpDateBlogImageBodyAndFile(req.body, req.files)
        .then((result: any) => {
          getBlogById(result[0].blog_id)
            .then(async (blogImage: any) => {
              blogImage = blogImage.img.split("//").pop();
              await removeFromS3(blogImage);
              const uploadRes = (await uploadFileToS3(
                "/blogs",
                result[1].image
              )) as { ok: boolean; file: string };
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
    } catch (error: any) {
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
  updateBlogData: (req: Request, res: Response) => {
    try {
      checkUpdateBlogDataReqBody(req.body)
        .then((result: any) => {
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
    } catch (error: any) {
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
  deleteBlog: (req: Request, res: Response) => {
    try {
      checkDeleteBlogReqBody(req.body)
        .then(async (result: any) => {
          getBlogById(result[0].blog_id).then(async (blogResult:any) => {
            let blogImage = blogResult.img.split("//").pop();
            await removeFromS3(blogImage);
            deleteBlogById(result[0].blog_id).then(result => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `blog successfully deleted`,
                  response: "",
                },
              });
            }).catch(err => {
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
            })
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
    } catch (error: any) {
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
