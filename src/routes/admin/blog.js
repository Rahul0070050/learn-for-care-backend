import { Router } from "express";

import { blogController } from "../../controllers/admin/blogController.js";
import { validateAdmin } from "../../middlewares/adminAuth.js";

const route = Router();

route.post("/create-blog", validateAdmin, blogController.createBlog);
route.get("/get-blog-by-id/:id", validateAdmin, blogController.getBlogById);
route.get("/get-all-blog", validateAdmin, blogController.getAllBlog);
route.post("/update-blog-image", validateAdmin, blogController.updateBlogImage);
route.post("/update-blog-data", validateAdmin, blogController.updateBlogData);
route.delete("/delete-blog", validateAdmin, blogController.deleteBlog);
route.post("/update-blog-status", validateAdmin, blogController.updateBlogStatus);
route.post("/update-blog-view-count", validateAdmin, blogController.updateViewCount);
route.post("/get-all-inactive", validateAdmin, blogController.getAllInactiveBlogs);

export default route;
