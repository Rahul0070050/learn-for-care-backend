import { Router } from "express";

import { couponController } from "../../controllers/user/couponController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/apply-coupon",couponController.applyCoupon);
route.post("/get-applied-coupon",couponController.getAppliedCoupon);

export default route;
