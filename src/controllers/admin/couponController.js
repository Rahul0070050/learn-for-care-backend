import { generatorOtp, getUser } from "../../utils/auth.js";

export const couponController = {
  createCoupon: (req, res) => {
    try {
      
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
