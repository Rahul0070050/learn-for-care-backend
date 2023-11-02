import { isSubUser } from "../helpers/checkSubUser.js";
import { getUser } from "../utils/auth.js";

export function validateSubUser(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1] || "";

  isSubUser(getUser(req))
    .then((result) => {
      res.redirect('/sub-user-login')
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
