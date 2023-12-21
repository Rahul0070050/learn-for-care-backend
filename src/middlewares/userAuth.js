import {
  validateUserJwtToken,
  checkCompanyUserOrManagerUserPrivileges,
} from "../helpers/jwt.js";
import { getUser } from "../utils/auth.js";

export function validateUser(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1] || "";

  validateUserJwtToken(token)
    .then((result) => {
      next();
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        errors: [
          {
            code: 401,
            message: "please login",
            error: err,
          },
        ],
        errorType: "server",
      });
    });
}

export function validateCompanyOrManagerUser(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1] || "";

  checkCompanyUserOrManagerUserPrivileges(token)
    .then((result) => {
      next();
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        errors: [
          {
            code: 401,
            message: "you don't have the privilege",
            error: err,
          },
        ],
        errorType: "server",
      });
    });
}
