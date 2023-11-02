import { db } from "../../../conf/mysql.js";

export function addCourseToCart(
  courseId,
  price,
  thumbnail,
  userId,
  name,
  count
) {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery = `INSERT INTO cart (user_id, course_id, product_count, thumbnail, amount, name)
                SELECT ?, ?, ?, ?, ?, ?
                WHERE NOT EXISTS (SELECT * FROM cart WHERE user_id = ? AND course_id = ?);      
              `;

      db.query(
        insertQuery,
        [userId, courseId, count, thumbnail, price, name, userId, courseId],
        (err, result) => {
          if (err) {
            console.log(err?.message);
            reject(err?.message);
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

export function getAllCartItem(userId) {
  return new Promise((resolve, reject) => {
    try {
      let searchQuery = `SELECT * FROM cart WHERE user_id = ?;`;

      db.query(searchQuery, [userId], (err, result) => {
        if (err) {
          reject(err?.message);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function updateCourseCountInTheCart(body, userId, price) {
  return new Promise((resolve, reject) => {
    try {
        let updateCartCountQuery = `UPDATE cart SET product_count = product_count + ${body.count}, amount = product_count * ${price} WHERE user_id = ? AND course_id = ?;`;
        let deleteItemZeroCountCartItemQuery = `DELETE FROM cart WHERE product_count = ?`;

      db.query(
        updateCartCountQuery,
        [userId, body.course_id],
        (err, result) => {
          db.query(deleteItemZeroCountCartItemQuery, [0], (err, result) => {});
          if (err) return reject(err?.message);
          else return resolve(result);
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function deleteCourseFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let deleteItemFromCartQuery = `DELETE FROM cart WHERE id = ?`;
      db.query(deleteItemFromCartQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllCartItemFromDB(user_id) {
  return new Promise((resolve, reject) => {
    try {
      let getAllItemsFromCartQuery = `SELECT * FROM cart WHERE user_id = ?`;
      db.query(getAllItemsFromCartQuery, [user_id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getCartItemsByUserId(id) {
  return new Promise((resolve, reject) => {
    try {
      let getAllItemsFromCartByUserIdQuery = `SELECT * FROM cart WHERE user_id = ?`;
      db.query(getAllItemsFromCartByUserIdQuery, [id], (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
