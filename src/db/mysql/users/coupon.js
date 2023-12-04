import { db } from "../../../conf/mysql.js";
import { getAllCartItemFromDB } from "./cart.js";

function findCouponFromDb(code) {
  return new Promise((resolve, reject) => {
    let getQuery1 = "SELECT * FROM coupons WHERE coupon_code = ?;";
    // let getQuery2 = "SELECT * FROM volume_coupons WHERE coupon_code = ?;";
    db.query(getQuery1, [code], (err, result) => {
      if (err) return reject(err?.message);
      else {
        if (result.length > 0) {
          if (result[0].coupon_type == "Percent") {
            resolve({ type: "Percent", amount: result[0] });
          } else {
            resolve({ type: "amount", amount: result[0] });
          }
        } else {
          reject("coupon not fount");
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
      try {
        let amount = await findCouponFromDb(code);
        let cart = await getAllCartItemFromDB(userId);
        let totalPrice = 0;
        cart.forEach((item) => {
          totalPrice += item.amount;
        });
        if (amount.amount.minimum_purchase <= totalPrice) {
          db.query(
            insertQuery,
            [userId, amount.amount.amount, amount.amount.id],
            (err, result) => {
              if (err) return reject(err?.message);
              else return resolve(amount.amount);
            }
          );
        } else {
          throw new Error("Minimum purchase is required.");
        }
      } catch (error) {
        reject(error);
      }
    } catch (error) {
      reject(error?.message);
    }
  });
}
