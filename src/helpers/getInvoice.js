import { downloadFromS3 } from "../AWS/S3.js";
import { db } from "../conf/mysql.js";
import { stripeObj } from "../conf/stripe.js";

export function getInvoice(id) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(id);
      const invoice = await stripeObj.invoices.retrieve(id);
      resolve(invoice);
    } catch (error) {
      console.log(error);
      reject(error?.message);
    }
  });
}

export function getAllInvoice() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT *, DATE_FORMAT(date, '%d/%m/%Y') AS date, TIME_FORMAT(date, '%h:%i:%s %p') AS time FROM invoice;";
      db.query(getQuery, async (err, result) => {
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
