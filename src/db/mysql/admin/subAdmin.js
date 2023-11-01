import { db } from "../../../conf/mysql.js";

export function saveNewSubAdminToDb(data) {
  return new Promise((resolve, reject) => {
    try {
      const { email, password } = data;
      let getQuery = `INSERT INTO sub_admin (email,password) VALUES (?,?);`;
      db.query(getQuery, [email, password], (err, result) => {
        if (err) {
            if(err.message === `ER_DUP_ENTRY: Duplicate entry '${email}' for key 'sub_admin.email'`){
                return reject("email already exist");
            }else {
                return reject(err.message);
            }
        }
        else return resolve(result);
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
