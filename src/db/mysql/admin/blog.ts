import { db } from "../../../conf/mysql";
import { blogBody, updateBlogBody } from "../../../type/blog";

export function insertNewBlog(blog: blogBody) {
  return new Promise((resolve, reject) => {
    try {
      let insertBlogQuery =
        "INSERT INTO blogs(header, img, content) VALUES(?,?,?);";
      db.query(
        insertBlogQuery,
        [blog.header, blog.image, blog.content],
        (err, result) => {
          if (err) return reject(err.message);
          else return resolve(result);
        }
      );
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function updateBlogImage(blogInfo: updateBlogBody) {
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
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function updateBlogData(blogInfo: blogBody) {
    return new Promise((resolve, reject) => {
      try {
        let updateBlogImageQuery = "UPDATE blogs SET header = ? content = ? WHERE id = ?;";
        db.query(
          updateBlogImageQuery,
          [blogInfo.header,blogInfo.content, blogInfo.blog_id],
          (err, result) => {
            if (err) return reject(err?.message);
            else return resolve(result);
          }
        );
      } catch (error: any) {
        reject(error?.message);
      }
    });
  }

export function getBlogById(id: string) {
  return new Promise((resolve, reject) => {
    try {
      let getBlogByIdQuery = "SELECT * FROM blogs WHERE id = ?;";
      db.query(getBlogByIdQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result[0]);
      });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function deleteBlogById(id: string) {
    return new Promise((resolve, reject) => {
      try {
        let getBlogByIdQuery = "DELETE FROM blogs WHERE id = ?;";
        db.query(getBlogByIdQuery, [id], (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result[0]);
        });
      } catch (error: any) {
        reject(error?.message);
      }
    });
  }