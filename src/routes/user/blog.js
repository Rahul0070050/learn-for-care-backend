import { Router } from "express";

import { blogController } from "../../controllers/user/blogController.js";
import { validateUser } from "../../middlewares/userAuth.js";

const route = Router();

route.get("/get-blog-by-id/:id", blogController.getBlogById);
route.get("/get-all-blog", blogController.getAllBlog);
route.post("/update-blog-view-count", blogController.updateViewCount);

export default route;
