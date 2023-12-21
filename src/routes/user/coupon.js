import { Router } from "express";

import { couponController } from "../../controllers/user/couponController.js";
import { validateUser } from "../../middlewares/userAuth.js";

const route = Router();

route.post("/apply-coupon", validateUser, couponController.applyCoupon);
route.post("/remove-coupon", validateUser, couponController.removeCoupon);
route.post(
  "/get-applied-coupon",
  validateUser,
  couponController.getAppliedCoupon
);
route.get("/get-offer-text", validateUser, couponController.getOfferTexts);

export default route;
