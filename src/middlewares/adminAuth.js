import { validateAdminJwtToken } from "../helpers/jwt.js";

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
            code: 500,
            message: "please login",
            error: err,
          },
        ],
        errorType: "server",
      });
    });
}
