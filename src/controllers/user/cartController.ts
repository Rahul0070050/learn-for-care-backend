import { Request, Response } from "express";
import { checkAddToCartReqBody } from "../../helpers/user/validateCartReqBody";

export const cartController = {
  addToCart: (req: Request, res: Response) => {
    try {
        checkAddToCartReqBody(req.body)
    } catch (error: any) {
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
