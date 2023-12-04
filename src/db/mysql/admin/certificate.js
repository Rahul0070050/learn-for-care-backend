import { downloadFromS3 } from "../../../AWS/S3.js";
import { db } from "../../../conf/mysql.js";

export function insertNewCertificate(info) {
  return new Promise((resolve, reject) => {
    try {
      let { user_id, course_name, user_name, percentage, date, image } = info;

      console.log(info);
      let insertQuery =
        "INSERT INTO certificate (user_id, course_name, user_name, percentage, date, image) VALUES (?, ?, ?, ?, ?, ?);";
      db.query(
        insertQuery,
        [user_id, course_name, user_name, percentage, new Date(date), image],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject(err?.message);
          } else {
            return resolve();
          }
        }
      );
    } catch (error) {
      console.log(error);
      reject(error?.message);
    }
  });
}

export function getCertificateByIdFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT * FROM certificate WHERE id = ?";
      db.query(getQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllCertificateFromDb() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT * FROM certificate";
      db.query(getQuery, async (err, result) => {
        if (err) return reject(err?.message);
        else {
          result = result.flat(1);
          let newResult = await Promise.all(
            result.map(async (item) => {
              let image = await downloadFromS3("", item.image);
              item["image"] = image.url;
              return item;
            })
          );
          return resolve(newResult);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function geCountOfAllCertificates() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT COUNT(*) FROM certificate;`;
      db.query(getQuery, (err, result) => {
        if (err) {
          reject(err?.message);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function geCountOfAllCertificatesByUserId(id) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `
      SELECT COUNT(*) FROM certificate WHERE user_id = ?;`;
      db.query(getQuery, [id], (err, result) => {
        if (err) {
          reject(err?.message);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
