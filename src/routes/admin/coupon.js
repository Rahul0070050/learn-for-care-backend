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

export default route;
