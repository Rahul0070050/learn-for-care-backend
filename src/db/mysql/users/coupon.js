import { db } from "../../../conf/mysql.js";
import { getAllCartItemFromDB } from "./cart.js";

function findCouponFromDb(code) {
  return new Promise((resolve, reject) => {
    let getQuery1 = "SELECT * FROM coupons WHERE coupon_code = ?;";
    let getQuery2 = "SELECT * FROM volume_coupons WHERE coupon_code = ?;";
    db.query(getQuery1, [code], (err, result) => {
      if (err) return reject(err?.message);
      else {
        if (result.length < 1) {
          db.query(getQuery2, [code], (err, result) => {
            if (err) return reject(err?.message);
            else {
              if (result.length > 1) {
                resolve({ type: "percent", amount: result[0] });
              } else {
                reject("coupon not fount");
              }
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
        "SELECT * FROM applied_coupon WHERE user_id = ? AND state = ?;";
      db.query(checkQuery, [userId, true], async (err, result) => {
        if (err) return reject(err?.message);
        else {
          if (result.length <= 0) {
            let amount = await findCouponFromDb(code);
            if(amount.type == "non") {
                return reject("coupon not fount")
            } else {
                let cart = await getAllCartItemFromDB(userId);
                console.log(amount);
                console.log(cart);
            }
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
