import { Router } from "express";

import { certificateController } from "../../controllers/user/certificateController.js";
import { validateUser } from "../../middlewares/userAuth.js";

const route = Router();

route.get(
  "/get-certificates",
  validateUser,
  certificateController.getCertificateByUsersId
);

export default route;
