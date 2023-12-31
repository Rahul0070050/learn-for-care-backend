import { downloadFromS3 } from "../../../AWS/S3.js";
import { db } from "../../../conf/mysql.js";

export function saveInvoiceToDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const { userId, coupon, total } = data;
      let insertQuery =
        "INSERT INTO invoice (user_id, applied_coupon, total_price) VALUES (?,?,?);";
      let updateQuery = "UPDATE invoice SET transaction_id = ? WHERE id = ?";
      db.query(insertQuery, [userId, coupon, total], (err, result) => {
        if (err) return reject(err?.message);
        else {
          let insertId = null;
          if (Array.isArray(insertId)) {
            insertId = result[0].insertId;
          } else {
            insertId = result.insertId;
          }
          db.query(updateQuery, [insertId, insertId], (err, result) => {});
          return resolve(insertId);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function saveInvoiceImageToDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const { id, image } = data;
      let updateQuery = "UPDATE invoice SET img = ? WHERE id = ?";
      db.query(updateQuery, [image, id], (err, result) => {
        if (err) {
          reject(err?.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getInvoiceFromDb(userId) {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = `SELECT *, DATE_FORMAT(invoice.date, '%d/%m/%Y') AS date, invoice.date  AS time FROM invoice 
      INNER JOIN users ON users.id = invoice.user_id
      WHERE invoice.user_id = ?;`;
      db.query(getQuery, [userId], async (err, result) => {
        if (err) return reject(err?.message);
        else {
          result = result.flat(1);
          let newResult = await Promise.all(
            result.map(async (item) => {
              let image = await downloadFromS3("", item.img);
              item["img"] = image.url;
              return item;
            })
          );
          newResult = newResult.flat(1);
          return resolve(newResult);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
