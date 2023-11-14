import {
  getAllCertificateFromDb,
  getCertificateByIdFromDb,
  insertNewCertificate,
} from "../../db/mysql/admin/certificate.js";
import {
  validateCreateCertificateInfo,
  validateGetCertificateByIdInfo,
} from "../../helpers/admin/validateCertificateReqData.js"

export const certificateController = {
  createCategory: (req, res) => {
    try {
      validateCreateCertificateInfo(req.body)
        .then((result) => {
          insertNewCertificate(result)
            .then((result) => {
              res.status(201).json({
                success: true,
                data: {
                  code: 201,
                  message: "added new certificate",
                },
              });
            })
            .catch((error) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "value not acceptable",
                    error: error,
                  },
                ],
                errorType: "client",
              });
            });
        })
        .catch((error) => {
          res.status(406).json({
            success: false,
            errors: [
              { code: 406, message: "value not acceptable", error: error },
            ],
            errorType: "client",
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
  getCertificateById: (req, res) => {
    try {
      req.params.id = Number(req.params.id);
      validateGetCertificateByIdInfo(req.params)
        .then((result) => {
          getCertificateByIdFromDb(result.id)
            .then((result) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  Response: result,
                  message: "get the certificate",
                },
              });
            })
            .catch((error) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "value not acceptable",
                    error: error,
                  },
                ],
                errorType: "client",
              });
            });
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            errors: [
              {
                code: 406,
                message: "value not acceptable",
                error: error,
              },
            ],
            errorType: "client",
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
  getAllCertificates: (req, res) => {
    try {
      getAllCertificateFromDb()
        .then((result) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              Response: result,
              message: "get the certificate",
            },
          });
        })
        .catch((error) => {
          res.status(406).json({
            success: false,
            errors: [
              {
                code: 406,
                message: "value not acceptable",
                error: error,
              },
            ],
            errorType: "client",
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
