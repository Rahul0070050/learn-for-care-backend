import { db } from "../../../conf/mysql.js";

export function saveCouponToDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const { coupon_code, valid_till, coupon_type, minimum_purchase, amount } =
        data;
      let insertQuery =
        "INSERT INTO coupons (coupon_code, valid_till, coupon_type, minimum_purchase, amount) VALUES (?,?,?,?,?);";
      db.query(
        insertQuery,
        [
          coupon_code,
          new Date(valid_till),
          coupon_type,
          minimum_purchase,
          amount,
        ],
        (err, result) => {
          if (err) {
            if (
              err.message ==
              `ER_DUP_ENTRY: Duplicate entry '${coupon_code}' for key 'coupons.coupon_code'`
            ) {
              reject("this code already exist");
            } else {
              reject(err?.message);
            }
          } else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function updateCouponToDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const {
        coupon_id,
        coupon_code,
        valid_till,
        coupon_type,
        minimum_purchase,
        amount,
      } = data;
      let updateQuery = `UPDATE coupons SET coupon_code = ?, valid_till = ?, coupon_type = ?, minimum_purchase = ?, amount = ? WHERE id = ?`;
      db.query(
        updateQuery,
        [
          coupon_code,
          new Date(valid_till),
          coupon_type,
          minimum_purchase,
          amount,
          coupon_id,
        ],
        (err, result) => {
          if (err) {
            if (
              err.message ==
              `ER_DUP_ENTRY: Duplicate entry '${coupon_code}' for key 'coupons.coupon_code'`
            ) {
              resolve();
            } else {
              reject(err?.message);
            }
          } else {
            resolve(result);
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function deleteCoupon(id) {
  return new Promise((resolve, reject) => {
    try {
      let deleteQuery = "DELETE FROM coupons WHERE id = ?;";
      db.query(deleteQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
