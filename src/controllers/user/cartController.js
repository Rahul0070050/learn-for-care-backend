import { checkAddToCartReqBody } from "../../helpers/user/validateCartReqBody.js";

export const cartController = {
  addToCart: (req, res) => {
    try {
        checkAddToCartReqBody(req.body)
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
