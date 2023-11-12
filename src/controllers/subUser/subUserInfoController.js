import { getSubUserById } from "../../db/mysql/subAdmin/subUser";
import { getUser } from "../../utils/auth";

export const subUserInfoController = {
  getInfo: (req, res) => {
    let user = getUser(req);
    getSubUserById(user.id)
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
};
