import { Router } from "express";

import { certificateController } from "../../controllers/admin/certificateController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/create-certificate",validateAdmin, certificateController.createCategory);
route.get("/get-certificate-by-id/:id",validateAdmin, certificateController.getCertificateById);
route.get("/get-all-certificates",validateAdmin, certificateController.getAllCertificates);

export default route;
