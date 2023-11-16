import { saveCouponToDb } from "../../db/mysql/admin/coupons.js";
import { validateCreateCouponInfo } from "../../helpers/admin/validateCouponReqData.js";
import { generatorOtp, getUser } from "../../utils/auth.js";

export const couponController = {
  createCoupon: (req, res) => {
    try {
      validateCreateCouponInfo(req.body)
        .then((result) => {
          saveCouponToDb(result).then(() => {
            res.status(201).json({
              success: true,
              data: {
                code: 201,
                message: "coupon created",
              },
            });
          }).catch(err => {
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
          })
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
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
};
