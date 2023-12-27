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

export function getAllCoupons() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT *, DATE_FORMAT(valid_till, '%d/%m/%Y') AS date FROM coupons ORDER BY id DESC;";
      db.query(getQuery, (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function saveToVolumeCoupon(data) {
  return new Promise((resolve, reject) => {
    try {
      const { coupon_code, max_val, min_val, percent } = data;
      let insertQuery =
        "INSERT INTO volume_coupons (coupon_code, max_val, min_val, percent) VALUES (?,?,?,?);";
      db.query(
        insertQuery,
        [coupon_code, max_val, min_val, percent],
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}
export function updateVolumeCoupon(data) {
  return new Promise((resolve, reject) => {
    try {
      const { coupon_id, coupon_code, max_val, min_val, amount } = data;
      let updateQuery = `UPDATE volume_coupons SET coupon_code = ?, max_val = ?, min_val = ?, amount = ? WHERE id = ?`;
      db.query(
        updateQuery,
        [coupon_code, max_val, min_val, amount, coupon_id],
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllVolumeCoupon() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT * FROM volume_coupons;";
      db.query(getQuery,(err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllOfferTextFromDb() {
  return new Promise((resolve, reject) => {
    try {
      let getQuery = "SELECT * FROM offer_text;";
      db.query(getQuery,(err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function deleteVolumeCoupon(id) {
  return new Promise((resolve, reject) => {
    try {
      let deleteQuery = "DELETE FROM volume_coupons WHERE id = ?;";
      db.query(deleteQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function saveOfferText(data) {
  return new Promise((resolve, reject) => {
    try {
      const { offer_text, hight_light_text, is_active, image } = data;
      let deleteQuery =
        "INSERT INTO offer_text (offer_text, hight_light_text, is_active,image) VALUES (?,?,?,?)";
      db.query(
        deleteQuery,
        [offer_text, hight_light_text, is_active, image],
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function deleteOfferText(id) {
  return new Promise((resolve, reject) => {
    try {
      let deleteQuery = "DELETE FROM offer_text WHERE id = ?;";
      db.query(deleteQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function changeActiveStatus(data) {
  return new Promise((resolve, reject) => {
    try {
      const { offer_text, hight_light_text, is_active } = data;
      let deleteQuery =
        "INSERT INTO offer_text (offer_text, hight_light_text, is_active) VALUES (?,?,?)";
      db.query(
        deleteQuery,
        [offer_text, hight_light_text, is_active],
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}
