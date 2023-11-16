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
