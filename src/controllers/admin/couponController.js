import {
  deleteCoupon,
  deleteOfferText,
  deleteVolumeCoupon,
  getAllCoupons,
  saveCouponToDb,
  saveOfferText,
  saveToVolumeCoupon,
  updateCouponToDb,
  updateVolumeCoupon,
} from "../../db/mysql/admin/coupons.js";
import {
  validateCreateCouponInfo,
  validateCreateOfferTextInfo,
  validateCreateVolumeCouponInfo,
  validateDeleteCouponInfo,
  validateDeleteOfferTextInfo,
  validateEditCouponInfo,
  validateUpdateVolumeCouponInfo,
} from "../../helpers/admin/validateCouponReqData.js";
import { generatorOtp, getUser } from "../../utils/auth.js";

export const couponController = {
  createCoupon: (req, res) => {
    try {
      validateCreateCouponInfo(req.body)
        .then((result) => {
          saveCouponToDb(result)
            .then(() => {
              res.status(201).json({
                success: true,
                data: {
                  code: 201,
                  message: "coupon created",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "error from db",
                    error: err,
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  editCoupon: (req, res) => {
    try {
      validateEditCouponInfo(req.body)
        .then((result) => {
          updateCouponToDb(result)
            .then(() => {
              res.status(201).json({
                success: true,
                data: {
                  code: 201,
                  message: "coupon updated",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "error from db",
                    error: err,
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  deleteCoupon: (req, res) => {
    try {
      validateDeleteCouponInfo(req.params)
        .then((result) => {
          deleteCoupon(result.id)
            .then(() => {
              res.status(201).json({
                success: true,
                data: {
                  code: 201,
                  message: "coupon deleted",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "error from db",
                    error: err,
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAllCoupons: (req, res) => {
    try {
      getAllCoupons()
        .then((result) => {
          res.status(201).json({
            success: true,
            data: {
              code: 201,
              message: "got all coupons",
              response: result,
            },
          });
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  createVolumeCoupon: (req, res) => {
    try {
      validateCreateVolumeCouponInfo(req.body)
        .then((result) => {
          saveToVolumeCoupon(result)
            .then(() => {
              res.status(201).json({
                success: true,
                data: {
                  code: 201,
                  message: "volume coupons inserted",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "error from db",
                    error: err,
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  updateVolumeCoupon: (req, res) => {
    try {
      validateUpdateVolumeCouponInfo(req.body)
        .then((result) => {
          updateVolumeCoupon(result)
            .then(() => {
              res.status(201).json({
                success: true,
                data: {
                  code: 201,
                  message: "volume coupons updated",
                },
              });
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  deleteVolumeCoupon: (req, res) => {
    try {
      validateDeleteCouponInfo(req.params)
        .then((result) => {
          deleteVolumeCoupon(result.id)
            .then(() => {
              res.status(201).json({
                success: true,
                data: {
                  code: 201,
                  message: "coupon deleted",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "error from db",
                    error: err,
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  createOfferText: (req, res) => {
    try {
      validateCreateOfferTextInfo(req.body)
        .then((result) => {
          saveOfferText(result)
            .then(() => {
              res.status(201).json({
                success: true,
                data: {
                  code: 201,
                  message: "offer text created",
                },
              });
            })
            .catch((err) => {
              res.status(406).json({
                success: false,
                errors: [
                  {
                    code: 406,
                    message: "error from db",
                    error: err,
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  },
  deleteDeleteOfferText:(req,res) => {
    try {
      validateDeleteOfferTextInfo(req.params)
      .then((result) => {
        deleteOfferText(result.id)
          .then(() => {
            res.status(201).json({
              success: true,
              data: {
                code: 201,
                message: "offer text deleted",
              },
            });
          })
          .catch((err) => {
            res.status(406).json({
              success: false,
              errors: [
                {
                  code: 406,
                  message: "error from db",
                  error: err,
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
            message: "some error occurred please try again later",
            error: err,
          },
        ],
        errorType: "server",
      });
    }
  }
};
