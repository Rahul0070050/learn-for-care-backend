import {
  checkAddToCartReqBody,
  checkDeleteCorseFromCartReqBody,
  checkUpdateCartCountReqBody,
} from "../../helpers/user/validateCartReqBody.js";
import { getUser } from "../../utils/auth.js";
import { getCourseByIdFromDb } from "../../db/mysql/admin/course.js";
import {
  addCourseToCart,
  deleteCourseFromDb,
  updateCourseCountInTheCart,
} from "../../db/mysql/users/cart.js";
export const cartController = {
  addToCart: (req, res) => {
    try {
      checkAddToCartReqBody(req.body.course_id)
        .then(async (courseId) => {
          let user = getUser(req);
          let course = await getCourseByIdFromDb(courseId);
          addCourseToCart(courseId, course.price, user.id)
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `product added to the cart`,
                },
              });
            })
            .catch((err) => {
              res.status(500).json({
                success: false,
                errors: [
                  {
                    code: 500,
                    message: "something went wrong try again after some times",
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
            response: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
  updateCartCount: (req, res) => {
    try {
      checkUpdateCartCountReqBody(req.body)
        .then(async (result) => {
          console.log(result);
          let user = await getUser(req);
          let course = await getCourseByIdFromDb(result.course_id);
          updateCourseCountInTheCart(result, user.id, course.price)
            .then((result) => {
              console.log(result);
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `updated cart count`,
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
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
            response: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
  deleteCourseFromCart: (req, res) => {
    try {
      checkDeleteCorseFromCartReqBody(req.body)
        .then((result) => {
          deleteCourseFromDb(result.cart_id)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `deleted cart item`,
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message:
                      "some error occurred white updating the db try again after some times",
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
            response: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
};
