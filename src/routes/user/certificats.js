import { Router } from "express";

import { certificateController } from "../../controllers/user/certificateController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.get("/get-certificate-by-user-id/:id",validateAdmin, certificateController.getCertificateByUsersId);

export default route;
