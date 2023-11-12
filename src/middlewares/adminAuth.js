import { validateAdminJwtToken, validateAdminPrivilegeJwtToken } from "../helpers/jwt.js";

export function validateAdmin(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1] || "";
  validateAdminJwtToken(token)
    .then((result) => {
      next()
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

export function validateAdminPrivilege(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1] || "";
  validateAdminPrivilegeJwtToken(token)
    .then((result) => {
      next()
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