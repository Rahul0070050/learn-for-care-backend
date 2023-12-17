import { downloadFromS3 } from "../../../AWS/S3.js";
import { db } from "../../../conf/mysql.js";

export function insertNewBlog(blog) {
  return new Promise((resolve, reject) => {
    try {
      let insertBlogQuery =
        "INSERT INTO blogs(state, header, img, content, author, tags) VALUES(?,?,?,?,?,?);";
      db.query(
        insertBlogQuery,
        [blog.state, blog.header, blog.image, blog.content, blog.author, blog.tags],
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
      let getAllBlogsQuery = "SELECT *, DATE_FORMAT(date, '%d/%m/%Y') AS date FROM blogs WHERE state = 'published'";
      db.query(getAllBlogsQuery, (err, result) => {
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
      let getAllBlogsQuery = "SELECT *, DATE_FORMAT(date, '%d/%m/%Y') AS date FROM blogs";
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
        "UPDATE blogs SET header = ?, content = ?, author = ?, tags = ? WHERE id = ?;";
      db.query(
        updateBlogInfoQuery,
        [blogInfo.header, blogInfo.content, blogInfo.author, blogInfo.tags, blogInfo.blog_id],
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


export function getInactiveBlogs() {
  return new Promise((resolve, reject) => {
    try {
      let updateBlogInfoQuery = `SELECT * FROM blogs WHERE active = ?;`;
      db.query(updateBlogInfoQuery, [false], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
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

export function setBlogInactivate(id, status) {
  return new Promise((resolve, reject) => {
    try {
      let updateQuery = "UPDATE blogs SET state = ? WHERE id = ?;";
      db.query(updateQuery, [status, id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve();
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getNewBlogs() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT id, header, img FROM blogs ORDER BY id DESC LIMIT 3;`;
      db.query(getQuery, async (err, result) => {
        if (err) {
          return reject(err?.message);
        } else {
          let fileResponses = result.map((item) =>
            downloadFromS3(item.id, item.img)
          );

          let SignedUrl = await Promise.all(fileResponses);

          result.forEach((item) => {
            item.img = SignedUrl.find((url) => url.id == item.id).url;
          });
          return resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
