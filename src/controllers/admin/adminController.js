import { saveNewSubAdminToDb } from "../../db/mysql/admin/subAdmin.js";
import { checkCreateSubAdminReqData } from "../../helpers/admin/validateSubAdminReqData.js";
import { hashPassword } from "../../helpers/validatePasswords.js";

export const subAdminController = {
  createSubAdmin: (req, res) => {
    try {
      checkCreateSubAdminReqData(req.body)
        .then(async (result) => {
          let password = await hashPassword(result.password);
          result.password = password
          saveNewSubAdminToDb(result)
            .then(() => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: "new sub admin created",
                  response: "",
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
};
