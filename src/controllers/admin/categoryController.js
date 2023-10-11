import {
  checkCreateCategoryReqBody,
  checkUpdateCategoryReqBody,
} from "../../helpers/admin/validateCategoryReqData.js";
import {
  insertNewCategory,
  updateCategory,
} from "../../db/mysql/admin/category.js";

export const categoryController = {
  createCategory: (req, res) => {
    try {
      checkCreateCategoryReqBody(req.body)
        .then((result) => {
          insertNewCategory(result.category)
            .then((result) => {
              res.status(201).json({
                success: true,
                data: {
                  code: 201,
                  message: "new category added",
                },
              });
            })
            .catch((error) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "value not acceptable",
                    error: error,
                  },
                ],
                errorType: "client",
              });
            });
        })
        .catch((error) => {
          res.status(406).json({
            success: false,
            errors: [
              { code: 406, message: "value not acceptable", error: error },
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
  updateCategory: (req, res) => {
    try {
      checkUpdateCategoryReqBody(req.body)
        .then((result) => {
          updateCategory(result)
            .then((result) => {
              res.status(201).json({
                success: true,
                data: {
                  code: 201,
                  message: "category updated successfully",
                },
              });
            })
            .catch((error) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "value not acceptable",
                    error: error,
                  },
                ],
                errorType: "client",
              });
            });
        })
        .catch((error) => {
          res.status(406).json({
            success: false,
            errors: [
              { code: 406, message: "value not acceptable", error: error },
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
