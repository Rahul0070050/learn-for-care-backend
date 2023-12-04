import { db } from "../../../conf/mysql.js";

function findCouponFromDb(codecode) {
  return new Promise((resolve, reject) => {
    let getQuery1 = "SELECT * FORM coupons WHERE coupon_code = ?;";
    let getQuery2 = "SELECT * FORM volume_coupons WHERE coupon_code = ?;";
    db.query(getQuery1, [code], (err, result) => {
      if (err) return reject(err?.message);
      else {
        if (result.length <= 0) {
          db.query(getQuery2, [code], (err, result) => {
            if (err) return reject(err?.message);
            else {
              resolve({ type: "percent", amount: result[0] });
            }
          });
        } else {
          resolve({ type: "amount", amount: result[0] });
        }
      }
    });
  });
}
export function applyCouponToCart(code, userId) {
  return new Promise(async (resolve, reject) => {
    try {
      let insertQuery =
        "INSERT INTO applied_coupon (user_id, coupon_id, price) VALUES (?,?,?);";
      let checkQuery =
        "SELECT * FORM applied_coupon WHERE user_id = ? AND state = ?;";
      db.query(checkQuery, [userId, true], async (err, result) => {
        if (err) return reject(err?.message);
        else {
          if (result.length <= 0) {
            let amount = await findCouponFromDb(code);
            let cart = await getAllCartItemFromDB(userId);
            console.log(amount);
            console.log(cart);
            // ("minimum_purchase");
            // ("max_val");
            // ("min_val");
            // ("amount");
            // db.query(insertQuery, (err, result) => {
            //   if (err) return reject(err?.message);
            //   else return resolve();
            // });
          } else {
            reject("coupon is already applied");
          }
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
