import { db } from "../../../conf/mysql.js";

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