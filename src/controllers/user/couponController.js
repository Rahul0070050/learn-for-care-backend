import { deleteAppliedCoupon } from "../../db/mysql/admin/course.js";
import {
  applyCouponToCart,
  getActiveCouponByUserId,
  getOfferTextsFromDb,
} from "../../db/mysql/users/coupon.js";
import { validateApplyCouponReq } from "../../helpers/user/validateCouponReq.js";
import { getUser } from "../../utils/auth.js";

export const couponController = {
  applyCoupon: (req, res) => {
    try {
      validateApplyCouponReq(req.body)
        .then((result) => {
          let user = getUser(req);
          applyCouponToCart(result.code, user.id)
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "coupon applied",
                  response: result,
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                data: {
                  code: 406,
                  message: "error from db",
                  response: err,
                },
              });
            });
        })
        .catch((err) => {
          res.status(406).json({
            success: true,
            data: {
              code: 406,
              message: "value not acceptable",
              response: err,
            },
          });
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message:
              "some error occurred while saving your data try again after some times",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  removeCoupon: (req, res) => {
    try {
      let user = getUser(req);
      deleteAppliedCoupon(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "coupon successfully removed",
              response: "",
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            data: {
              code: 406,
              message: "error from db",
              response: err,
            },
          });
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message:
              "some error occurred while saving your data try again after some times",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAppliedCoupon: (req, res) => {
    try {
      let user = getUser(req);
      getActiveCouponByUserId(user.id)
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got applied coupon",
              response: result,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            data: {
              code: 406,
              message: "error from db",
              response: err,
            },
          });
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message:
              "some error occurred while saving your data try again after some times",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getOfferTexts: (req, res) => {
    try {
      getOfferTextsFromDb()
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all offer text",
              response: result,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            data: {
              code: 406,
              message: "error from db",
              response: err,
            },
          });
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message:
              "some error occurred while saving your data try again after some times",
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
};
