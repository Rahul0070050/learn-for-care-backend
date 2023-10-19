import { validateUserJwtToken } from "../helpers/jwt.js";

export function validateUser(req, res, next) {

  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1] || "";

  validateUserJwtToken(token)
    .then((result) => {
      next();
    })
    .catch((err) => {
      console.log(err);
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
