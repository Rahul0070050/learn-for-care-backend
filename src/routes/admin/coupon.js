import { Router } from "express";

import { couponController } from "../../controllers/admin/couponController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/create-coupon", validateAdmin, couponController.createCoupon);
route.patch("/edit-coupon", validateAdmin, couponController.editCoupon);
route.delete("/delete-coupon/:id", validateAdmin, couponController.deleteCoupon);
route.get("/list-coupons", validateAdmin, couponController.getAllCoupons);
route.post("/create-volume-coupon", validateAdmin, couponController.createVolumeCoupon);
route.patch("/update-volume-coupon", validateAdmin, couponController.updateVolumeCoupon);
route.get("/list-volume-coupon", validateAdmin, couponController.getAllVolumeCoupon);
route.delete("/delete-volume-coupon/:id", validateAdmin, couponController.deleteVolumeCoupon);

route.post("/create-offer-text", validateAdmin, couponController.createOfferText);
route.get("/get-all-offer-text", validateAdmin, couponController.getAllOfferText);
route.delete("/delete-offer-text/:id", validateAdmin, couponController.deleteDeleteOfferText);

export default route;
