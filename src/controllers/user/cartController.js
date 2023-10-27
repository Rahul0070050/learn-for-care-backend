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
  getAllCartItemFromDB,
  getCartItemsByUserId,
  updateCourseCountInTheCart,
} from "../../db/mysql/users/cart.js";
import { downloadFromS3 } from "../../AWS/S3.js";
import { getStripeUrl } from "../../conf/stripe.js";
export const cartController = {
  addToCart: (req, res) => {
    try {
      checkAddToCartReqBody(req.body.course_id)
        .then(async (courseId) => {
          let user = getUser(req);
          let course = await getCourseByIdFromDb(courseId);
          addCourseToCart(
            courseId,
            course[0].price,
            course[0].thumbnail,
            user.id,
            course[0].name,
          )
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
    console.log(req.body);
    try {
      checkUpdateCartCountReqBody(req.body)
        .then(async (result) => {
          let user = await getUser(req);
          let course = await getCourseByIdFromDb(result.course_id);
          console.log('course',course);
          updateCourseCountInTheCart(result, user.id, course[0].price)
            .then((result) => {
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
  getAllCartItems: (req, res) => {
    try {
      getAllCartItemFromDB()
        .then((result) => {
          let newResult = result.map(async (item) => {
            let file = await downloadFromS3(null, item.thumbnail);
            item.thumbnail = file.url;
            return item;
          });

          Promise.all(newResult).then((result) => {
            res.status(200).json({
              success: true,
              data: {
                code: 200,
                message: `got all cart items`,
                response: result,
              },
            });
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            errors: [
              {
                code: 500,
                message:
                  "some error occurred white get the data from db try again after some times",
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
  checkout: async(req,res) => {
    try {
      let userId = getUser(req)?.id
      console.log(userId);
      let cart = await getCartItemsByUserId(userId)
      if(cart.length <= 0) {
        throw new Error("Your Cart is Empty")
      } else {
        let session = await getStripeUrl(cart)
        console.log(cart);
        res.status(200).json({
          success: true,
          data: {
            code: 200,
            message: "checkout success",
            response: session.url,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message: "some error occurred please try again later",
            error: error?.message ? error?.message : error,
          },
        ],
        errorType: "server",
      });
    }
  }
};
