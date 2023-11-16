import { Router } from "express";

import { couponController } from "../../controllers/admin/couponController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/create-coupon", validateAdmin, couponController.createCoupon);

export default route;
