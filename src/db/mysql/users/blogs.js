import { db } from "../../../conf/mysql.js";

export function getBlogByIdFromDb(id) {
    return new Promise((resolve, reject) => {
      try {
        let getAllBlogsQuery = "SELECT *, DATE_FORMAT(date, '%d/%m/%Y') AS date FROM blogs WHERE id = ?";
        db.query(getAllBlogsQuery, [id], (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result);
        });
      } catch (error) {
        reject(error?.message);
      }
    });
  }

  export function setOneViewToBlog(id) {
    return new Promise((resolve, reject) => {
      try {
        console.log(id);
        let updateBlogInfoQuery = `UPDATE blogs SET views = views + ? WHERE id = ?;`;
        db.query(updateBlogInfoQuery, [1,id], (err, result) => {
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