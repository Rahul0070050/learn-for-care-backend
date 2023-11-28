import { getAllCertificatesByUserId } from "../../db/mysql/users/certificates.js";
import { getUser } from "../../utils/auth.js";

export const certificateController = {
  getCertificateByUsersId: (req, res) => {
    try {
      let user = getUser(req);
      getAllCertificatesByUserId(user.id)
        .then((certificates) => {
            // certificates.map(item => {
            //     return 
            // })
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: "got all certificates",
              response: certificates,
            },
          });
        })
        .catch((err) => {
          res.status(406).json({
            success: true,
            data: {
              code: 406,
              message: "value not acceptable",
              response: err,
            },
          });
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message:
              "some error occurred in the server try again after some times",
            error: error?.message,
          },
        ],
        errorType: "server",
      });
    }
  },
};
