import { db } from "../../../conf/mysql.js";

export function insertNewBlog(blog) {
  return new Promise((resolve, reject) => {
    try {
      let insertBlogQuery =
        "INSERT INTO blogs(header, img, content, author, tags) VALUES(?,?,?,?,?);";
      db.query(
        insertBlogQuery,
        [blog.header, blog.image, blog.content, blog.author, blog.tags],
        (err, result) => {
          if (err) return reject(err.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getBlogByIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getAllBlogsQuery = "SELECT * FROM blogs WHERE id = ?";
      db.query(getAllBlogsQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllBlogs() {
  return new Promise((resolve, reject) => {
    try {
      let getAllBlogsQuery = "SELECT * FROM blogs";
      db.query(getAllBlogsQuery, (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
export function updateBlogImage(blogInfo) {
  return new Promise((resolve, reject) => {
    try {
      let updateBlogImageQuery = "UPDATE blogs SET img = ? WHERE id = ?;";
      db.query(
        updateBlogImageQuery,
        [blogInfo.image, blogInfo.blog_id],
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function updateBlogData(blogInfo) {
  return new Promise((resolve, reject) => {
    try {
      let updateBlogInfoQuery =
        "UPDATE blogs SET header = ?, content = ? WHERE id = ?;";
      db.query(
        updateBlogInfoQuery,
        [blogInfo.header, blogInfo.content, blogInfo.blog_id],
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getBlogById(id) {
  return new Promise((resolve, reject) => {
    try {
      let getBlogByIdQuery = "SELECT * FROM blogs WHERE id = ?;";
      db.query(getBlogByIdQuery, [id], (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          if (!result[0]) {
            return reject("No Blog Found");
          }
          resolve(result[0]);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function deleteBlogById(id) {
  return new Promise((resolve, reject) => {
    try {
      let deleteBlogByIdQuery = "DELETE FROM blogs WHERE id = ?;";
      db.query(deleteBlogByIdQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result[0]);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
