import { db } from "../../../conf/mysql.js";

export function saveNewSubAdminToDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const { name, email, password } = data;
      let getQuery = `INSERT INTO sub_admin (name,email,password) VALUES (?,?,?);`;
      db.query(getQuery, [name, email, password], (err, result) => {
        if (err) {
          if (
            err.message ===
            `ER_DUP_ENTRY: Duplicate entry '${email}' for key 'sub_admin.email'`
          ) {
            return reject("email already exist");
          } else {
            return reject(err.message);
          }
        } else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function deleteSubAdminFomDb(id) {
  return new Promise((resolve, reject) => {
    try {
      let deleteQuery = `DELETE FROM sub_admin WHERE id = ?;`;
      db.query(deleteQuery, [id], (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function getAllSubAdminFomDb() {
  return new Promise((resolve, reject) => {
    try {
      let getAllQuery = `SELECT id,email,block FROM sub_admin;`;
      db.query(getAllQuery, (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
