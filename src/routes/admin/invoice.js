import express, { Router } from "express";

import { validateAdmin } from "../../middlewares/adminAuth.js";
import { invoiceController } from "../../controllers/admin/invoiceController.js";

const route = Router();

route.get("/get-invoice/:id", validateAdmin, invoiceController.getInvoiceById);
route.get("/get-all-invoice", validateAdmin, invoiceController.getAllInvoice);

export default route;
