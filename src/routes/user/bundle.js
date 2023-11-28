import { Router } from "express";

import { bundleController } from "../../controllers/user/bundleController.js";

const route = Router();

route.get("/get-bundle-by-id/:id", bundleController.getBundleById);
route.get("/get-all-bundles", bundleController.getAllBundle);
route.post("/start-bundle", bundleController.startBundle);

export default route;
