import { checkCompanyUserPrivileges } from "../helpers/jwt.js";
import { getUser } from "../utils/auth.js";

export function validateCompanyUserUser(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1] || "";

  checkCompanyUserPrivileges(token)
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