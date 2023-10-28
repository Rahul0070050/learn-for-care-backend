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
import { getStripeUrl, stripeObj } from "../../conf/stripe.js";
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
            course[0].name
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
          console.log("course", course);
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
  checkout: async (req, res) => {
    try {
      let userId = getUser(req)?.id;
      let cart = await getCartItemsByUserId(userId);
      if (cart.length <= 0) {
        res.status(500).json({
          success: false,
          errors: [
            {
              code: 500,
              message: "your cart is empty",
              response: {},
            },
          ],
          errorType: "client",
        });
      } else {
        let session = await getStripeUrl(cart);
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
      console.log(error);
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
  },
  stripResponse: async (req, res) => {
    try {
      const sig = req.headers["stripe-signature"];

      let event = stripeObj.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_ENDPOINTSECRET
      );

      // Handle the event
      switch (event.type) {
        case "charge.failed":
          const chargeFailed = event.data.object;
          console.log(chargeFailed);
          // Then define and call a function to handle the event charge.failed
          break;
        case "charge.pending":
          const chargePending = event.data.object;
          console.log(chargePending);
          // Then define and call a function to handle the event charge.pending
          break;
        case "charge.succeeded":
          const chargeSucceeded = event.data.object;
          console.log(chargeSucceeded);
          // Then define and call a function to handle the event charge.succeeded
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      console.log(err.message);
      // console.log(err.message);
      res.status(400).json({
        success: false,
        errors: [
          {
            code: 500,
            message: "some error occurred please try again later",
            error: err?.message ? err?.message : error,
          },
        ],
        errorType: "server",
      });
    }
  },
};
