import { uploadPdfToS3 } from "../../AWS/S3.js";
import { convertHtmlToPdf } from "../../certificate/courseCertificate.js";
import {
  getAllCertificateFromDb,
  getCertificateByIdFromDb,
  insertNewCertificate,
} from "../../db/mysql/admin/certificate.js";
import {
  validateCreateCertificateInfo,
  validateGetCertificateByIdInfo,
  validateSaveCertificateByUserIdInfo,
} from "../../helpers/admin/validateCertificateReqData.js";
import { v4 as uuid} from "uuid";

export const certificateController = {
  createCertificate: (req, res) => {
    try {
      validateCreateCertificateInfo(req.body)
        .then(async (result) => {
          let filePath = uuid() + ".pdf"
          await convertHtmlToPdf(filePath);
          let url = await uploadPdfToS3(filePath)
          insertNewCertificate({...result,image: url.file})
            .then(async (result) => {
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
                    message: "error from db acceptable",
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
  saveCertificateImage: (req, res) => {
    try {
      validateSaveCertificateByUserIdInfo(req.files, req.body)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          res.status(406).json({
            success: false,
            errors: [
              {
                code: 406,
                message: "value not acceptable",
                error: err,
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
