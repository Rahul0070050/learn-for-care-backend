import { Router } from "express";

import { validateUser } from "../../middlewares/userAuth.js";
import { cartController } from "../../controllers/user/cartController.js";

const route = Router();

route.post("/add-to-cart",validateUser, cartController.addToCart);

export default route;
