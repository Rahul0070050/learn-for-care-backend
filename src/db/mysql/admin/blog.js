import { db } from "../../../conf/mysql.js";

export function insertNewBlog(blog) {
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
        console.log(blogInfo.header,blogInfo.content, blogInfo.blog_id);
        let updateBlogImageQuery = "UPDATE blogs SET header = ?, content = ? WHERE id = ?;";
        db.query(
          updateBlogImageQuery,
          [blogInfo.header,blogInfo.content, blogInfo.blog_id],
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
          if(!result[0]) {
            return reject('No Blog Found')
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
        let getBlogByIdQuery = "DELETE FROM blogs WHERE id = ?;";
        db.query(getBlogByIdQuery, [id], (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result[0]);
        });
      } catch (error) {
        reject(error?.message);
      }
    });
  }