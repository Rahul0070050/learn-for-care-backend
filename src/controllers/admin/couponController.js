import {
  deleteCoupon,
  deleteOfferText,
  deleteVolumeCoupon,
  getAllCoupons,
  getAllOfferTextFromDb,
  getAllVolumeCoupon,
  saveCouponToDb,
  saveOfferText,
  saveToVolumeCoupon,
  updateCouponToDb,
  updateVolumeCoupon,
} from "../../db/mysql/admin/coupons.js";
import {
  validateCreateCouponInfo,
  validateCreateOfferTextImageRoute,
  validateCreateOfferTextInfo,
  validateCreateVolumeCouponInfo,
  validateDeleteCouponInfo,
  validateDeleteOfferTextInfo,
  validateEditCouponInfo,
  validateUpdateVolumeCouponInfo,
} from "../../helpers/admin/validateCouponReqData.js";
import { generatorOtp, getUser } from "../../utils/auth.js";
import { downloadFromS3, removeFromS3, uploadFileToS3 } from "../../AWS/S3.js";

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
  getAllVolumeCoupon: (req, res) => {
    try {
      getAllVolumeCoupon()
        .then((result) => {
          res.status(201).json({
            success: true,
            data: {
              code: 201,
              message: "got volume coupons",
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
                message: "err from db",
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
        .then(async (result) => {
          try {
            
            console.log(req.files);
            const { image } = req.files || {image: ""};
          let imageFile = null;
          if (image) {
            imageFile = await uploadFileToS3("/offer-text-image", image);
          } else {
            imageFile = { file: "" }
          }
          saveOfferText({ ...result, image: imageFile?.file || "" })
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
          } catch (error) {
            console.log(error);
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
          }
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
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  createOfferTextImage: (req, res) => {
    try {
      validateCreateOfferTextImageRoute(req.files, req.body)
        .then((result) => {
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
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  getAllOfferText: (req, res) => {
    try {
      getAllOfferTextFromDb()
        .then(async (result) => {
          let newResult = await Promise.all(
            result.map(async (item) => {
              let image = await downloadFromS3("", item.image);
              item["image"] = image.url;
              return item;
            })
          );
          console.log(newResult);
          res.status(201).json({
            success: true,
            data: {
              code: 201,
              message: "got all offer text",
              response: newResult,
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
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [
          {
            code: 500,
            message: "some error occurred please try again later",
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
  deleteDeleteOfferText: (req, res) => {
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
            error: error,
          },
        ],
        errorType: "server",
      });
    }
  },
};
