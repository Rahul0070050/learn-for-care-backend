import { validateUserJwtToken } from "../helpers/jwt.js";

export function validateUser(req, res, next) {
  const { authorization } = req.headers;
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
