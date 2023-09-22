import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10, // Number of connections in the pool
  multipleStatements: false,
});

export function mySqlConnect(done: CallableFunction) {
  db.getConnection((err) => {
    if (err) return done(err);

//     const userTable = `
//       CREATE TABLE IF NOT EXISTS users (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       username VARCHAR(50) NOT NULL,
//       email VARCHAR(50) NOT NULL UNIQUE,
//       type VARCHAR(50) NOT NULL,
//       password VARCHAR(500) NOT NULL,
//       country VARCHAR(50) NOT NULL,
//       city VARCHAR(50) NOT NULL,
//       profile_image VARCHAR(300) DEFAULT NULL,
//       activate BOOLEAN DEFAULT FALSE,
//       block BOOLEAN DEFAULT FALSE,
//       joined DATETIME DEFAULT NOW(),
//       otp INT,
//       certificates INT,
//       courses_id INT,
//       cart INT
//   );`;

//     db.query(userTable, (err, result) => {
//       if (err) console.log(err);
//       else console.log('user table created');
//     });

//     const unexpectedError = `
//       CREATE TABLE IF NOT EXISTS errors (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       date DATETIME DEFAULT NOW(),
//       error TEXT DEFAULT NULL,
//       lineNumber VARCHAR(50) DEFAULT NULL,
//       file varchar(100) DEFAULT NULL
//   );`;

//     db.query(unexpectedError, (err, result) => {
//       if (err) console.log(err);
//       else console.log('errors table created');
//     });

//     const createAdminTable = `
//     CREATE TABLE IF NOT EXISTS admin (
//     email VARCHAR(50) NOT NULL,
//     password VARCHAR(100) NOT NULL,
//     otp INT(6) DEFAULT NULL
//     activate BOOLEAN DEFAULT FALSE
// );`;

//   db.query(createAdminTable, (err, result) => {
//     if (err) console.log(err);
//     else console.log('admin table created');
//   })
    return done();
  });
}
