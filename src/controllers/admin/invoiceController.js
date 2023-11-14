import {
  checkGetInvoiceByIdReqBody,
} from "../../helpers/admin/validateInvoiceReqData.js";
import { getAllInvoice, getInvoice } from "../../helpers/getInvoice.js";

export const invoiceController = {
  getInvoiceById: (req, res) => {
    try {
      checkGetInvoiceByIdReqBody(req.params)
        .then((result) => {
          getInvoice(result.id)
            .then((invoiceResult) => {
              res.status(200).json({
                success: true,
                data: {
                  code: 200,
                  message: `get invoice`,
                  response: invoiceResult,
                },
              });
            })
            .catch((err) => {
              res.status(500).json({
                success: false,
                errors: [
                  {
                    code: 500,
                    message: "something went wrong try again after some times",
                    error: err,
                  },
                ],
                errorType: "server",
              });
            });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            errors: [
              {
                code: 500,
                message: "something went wrong try again after some times",
                error: err,
              },
            ],
            errorType: "server",
          });
        });
    } catch (error) {
      res.status(400).json({
        success: false,
        errors: [
          {
            code: 400,
            message: "some error occurred please try again later",
            error: err?.message ? err?.message : error,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAllInvoice: (req, res) => {
    try {
      getAllInvoice()
        .then((invoiceResult) => {
          res.status(200).json({
            success: true,
            data: {
              code: 200,
              message: `get invoice`,
              response: invoiceResult,
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            errors: [
              {
                code: 500,
                message: "something went wrong try again after some times",
                error: err,
              },
            ],
            errorType: "server",
          });
        });
    } catch (error) {
      res.status(400).json({
        success: false,
        errors: [
          {
            code: 400,
            message: "some error occurred please try again later",
            error: err?.message ? err?.message : error,
          },
        ],
        errorType: "server",
      });
    }
  },
};
