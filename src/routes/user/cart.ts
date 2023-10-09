import { Router } from "express";

import { validateUser } from "../../middlewares/userAuth";
import { cartController } from "../../controllers/user/cartController";

const route = Router();

route.post("/add-to-cart",validateUser, cartController.addToCart);

export default route;
