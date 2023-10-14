import { Router } from "express";

import { blogController } from "../../controllers/admin/blogController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/create-blog",validateAdmin, blogController.createBlog);
route.get("/get-all-blog",validateAdmin, blogController.getAllBlog);
route.post("/update-blog-image",validateAdmin, blogController.updateBlogImage);
route.post("/update-blog-data",validateAdmin, blogController.updateBlogData);
route.delete("/delete-blog",validateAdmin, blogController.deleteBlog);

export default route;
