import express, { Router } from "express";

import { validateUser } from "../../middlewares/userAuth.js";
import { cartController } from "../../controllers/user/cartController.js";

const route = Router();

route.post("/add",validateUser, cartController.addCourseToCart);
route.post("/add-bundle",validateUser, cartController.addBundleToCart);
route.patch("/update-cart-count",validateUser, cartController.updateCartCount);
route.delete("/delete-cart-item",validateUser, cartController.deleteCourseFromCart);
route.get("/get",validateUser, cartController.getAllCartItems);
route.post("/checkout", validateUser, cartController.checkout);
route.get("/get-invoice/:id", validateUser, cartController.getInvoiceById);
// ch_3OCIb5SDSvRnSaLU1aGdgqMx

export default route;
