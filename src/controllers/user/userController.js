import { getUserById } from "../../db/mysql/users/users.js";
import { getUser } from "../../utils/auth.js";

export const userController = {
  getUserData: (req, res) => {
    let user = getUser(req);
    getUserById(user.id)
      .then((result) => {
        res.status(200).json({
          success: true,
          data: {
            code: 200,
            message: "got user",
            response: { ...result },
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          errors: [
            {
              code: 500,
              message: "some error occurred please try again later",
              error: err,
            },
          ],
          errorType: "server",
        });
      });
  },
  createSubUser: (req, res) => {
    try {
      
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
};
