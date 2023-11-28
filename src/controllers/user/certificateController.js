import { downloadFromS3 } from "../../AWS/S3.js";
import { getAllCertificatesByUserId } from "../../db/mysql/users/certificates.js";
import { getUser } from "../../utils/auth.js";

export const certificateController = {
  getCertificateByUsersId: (req, res) => {
    try {
      let user = getUser(req);
      getAllCertificatesByUserId(user.id)
        .then((certificates) => {
          Promise.all(
            certificates.map(async (item) => {
              let file = await downloadFromS3("", item.image);
              item["image"] = file.url
              return item 
            })
          )
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "got all certificates",
                  response: result,
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
