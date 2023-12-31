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

export function getActiveCouponByUserId(id) {
  return new Promise((resolve, reject) => {
    try {
      let checkQuery =
        "SELECT * FROM applied_coupon WHERE user_id = ? AND state = ?;";
      db.query(checkQuery, [id, true], (err, result) => {
        if (err) return reject(err.message);
        else resolve(result[0]);
      });
    } catch (error) {
      console.log(error);
    }
  });
}

export function getOfferTextsFromDb() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT * FROM offer_text WHERE is_active = ?;";
      db.query(getQuery, [true], (err, result) => {
        if (err) return reject(err.message);
        else {
          console.log(result);
          resolve(result);
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
}

export function disableCouponByUserId(id) {
  return new Promise((resolve, reject) => {
    try {
      let checkQuery = "UPDATE applied_coupon SET state = ? WHERE user_id = ?;";
      db.query(checkQuery, [false, id], (err, result) => {
        if (err) return reject(err.message);
        else resolve(result);
      });
    } catch (error) {
      console.log(error);
    }
  });
}
export function applyCouponToCart(code, userId) {
  return new Promise(async (resolve, reject) => {
    try {
      let coupon = await getActiveCouponByUserId(userId);
      let insertQuery =
        "INSERT INTO applied_coupon (user_id, type, amount) VALUES (?,?,?);";
      let updateQuery =
        "UPDATE applied_coupon SET type = ?, amount = ? WHERE user_id = ? AND state = ?;";
      try {
        let amount = await findCouponFromDb(code);
        let cart = await getAllCartItemFromDB(userId);
        let totalPrice = 0;
        cart.forEach((item) => {
          totalPrice += item.amount;
        });
        if (amount.amount.minimum_purchase <= totalPrice) {
          if (!coupon) {
            db.query(
              insertQuery,
              [userId, amount.amount.coupon_type, amount.amount.amount],
              (err, result) => {
                if (err) return reject(err?.message);
                else return resolve(amount.amount);
              }
            );
          } else {
            db.query(
              updateQuery,
              [amount.amount.coupon_type, amount.amount.amount, userId, true],
              (err, result) => {
                if (err) return reject(err?.message);
                else return resolve(amount.amount);
              }
            );
          }
        } else {
          reject("Minimum purchase is required.");
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    } catch (error) {
      console.log(error);
      reject(error?.message);
    }
  });
}
