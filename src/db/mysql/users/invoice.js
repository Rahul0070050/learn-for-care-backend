import { downloadFromS3 } from "../../../AWS/S3.js";
import { db } from "../../../conf/mysql.js";

export function saveInvoiceToDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const { userId, image } = data;
      let insertQuery = "INSERT INTO invoice (user_id, img) VALUES (?,?);";
      db.query(insertQuery, [userId, image], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getInvoiceFromDb(userId) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT * FROM invoice WHERE user_id = ?;";
      db.query(getQuery, [userId], async (err, result) => {
        if (err) return reject(err?.message);
        else {
          result = result.flat(1);
          let newResult = await Promise.all(result.map((item) => {
              let image = downloadFromS3(item.img);
            item["img"] = image.url;
            return item;
        }));
        newResult = newResult.flat(1);
        return resolve(newResult);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
