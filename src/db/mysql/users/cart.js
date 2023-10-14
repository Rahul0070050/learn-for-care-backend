import { db } from "../../../conf/mysql.js";

export function addCourseToCart(courseId, price, userId) {
  return new Promise((resolve, reject) => {
    try {
      let insertQuery = `INSERT INTO cart (user_id, course_id, product_count, amount)
                SELECT ?, ?, ?, ?
                WHERE NOT EXISTS (SELECT * FROM cart WHERE user_id = ? AND course_id = ?);      
              `;

      db.query(
        insertQuery,
        [userId, courseId, 1, price, userId, courseId],
        (err, result) => {
          if (err) {
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
      let updateCartCountQuery = null;
      if (body.identifier == 1) {
        updateCartCountQuery = `UPDATE cart SET product_count = product_count + 1, amount = product_count * ${price} WHERE user_id = ? AND course_id = ?;`;
      } else {
        updateCartCountQuery = `UPDATE cart SET product_count = product_count - 1, amount = product_count * ${price}   WHERE user_id = ? AND course_id = ?;`;
      }

      db.query(
        updateCartCountQuery,
        [userId, body.course_id],
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

export function deleteCourseFromDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let deleteItemFromCartQuery = `DELETE FROM cart WHERE id = ?`;
      db.query(
        deleteItemFromCartQuery,
        [id],
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
