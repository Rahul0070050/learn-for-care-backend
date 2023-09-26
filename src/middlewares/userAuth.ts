import { NextFunction, Request, Response } from "express";
import { validateUserJwtToken } from "../helpers/jwt";

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  console.log(authorization?.split(" ")[1]);
  const token = authorization?.split(" ")[1] || "";
  validateUserJwtToken(token)
    .then((result) => {
    //   console.log(result);
      next()
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        errors: [
          {
            code: 500,
            message: "please login",
            error: err,
          },
        ],
        errorType: "server",
      });
    });
}
