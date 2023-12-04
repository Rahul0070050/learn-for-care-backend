import { applyCouponToCart } from "../../db/mysql/users/coupon.js";
import { validateApplyCouponReq } from "../../helpers/user/validateCouponReq.js";
import { getUser } from "../../utils/auth.js";

export const couponController = {
  applyCoupon: (req, res) => {
    try {
      validateApplyCouponReq(req.body)
        .then((result) => {
          let user = getUser(req);
          applyCouponToCart(result.code, user.id).then(() => {

          }).catch(err => {
            res.status(406).json({
                success: true,
                data: {
                  code: 406,
                  message: "value not acceptable",
                  response: err,
                },
              });
          })
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
};
