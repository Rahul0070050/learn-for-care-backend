import { NextFunction, Request, Response } from "express";
import { validateAdminJwtToken } from "../helpers/jwt";

export function validateAdmin(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  console.log(authorization?.split(" ")[1]);
  const token = authorization?.split(" ")[1] || "";
  validateAdminJwtToken(token)
    .then((result) => {
      console.log(result);
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
