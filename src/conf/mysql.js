import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
  multipleStatements: false,
});

export function mySqlConnect(done) {
  db.getConnection((err) => {
    if (err) return done(err);

    // const userTable = `
    //   CREATE TABLE IF NOT EXISTS users (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     username VARCHAR(50) NOT NULL,
    //     email VARCHAR(50) NOT NULL UNIQUE,
    //     type_of_account VARCHAR(50) NOT NULL,
    //     password VARCHAR(500) NOT NULL,
    //     country VARCHAR(50) NOT NULL,
    //     city VARCHAR(50) NOT NULL,
    //     company_name VARCHAR(100) DEFAULT NULL,
    //     otp INT DEFAULT NULL,
    //     joined DATETIME DEFAULT NOW(),
    //     profile_image VARCHAR(300) DEFAULT NULL,
    //     activate BOOLEAN DEFAULT FALSE,
    //     block BOOLEAN DEFAULT FALSE
    //   );`;

    // db.query(userTable, (err, result) => {
    //   if (err) console.log(err);
    //   else console.log("user table created");
    // });

    //   const createAdminTable = `
    //       CREATE TABLE IF NOT EXISTS admin (
    //       email VARCHAR(50) NOT NULL,
    //       password VARCHAR(300) NOT NULL,
    //       activate BOOLEAN DEFAULT FALSE,
    //       otp INT(6) DEFAULT NULL
    //   );`;

    //   db.query(createAdminTable, (err, result) => {
    //     if (err) console.log(err);
    //     else console.log("admin table created");
    //   });

    //   const createCategoryTable = `
    //   CREATE TABLE IF NOT EXISTS category (
    //   id INT AUTO_INCREMENT PRIMARY KEY,
    //   category VARCHAR(50) UNIQUE NOT NULL,
    //   productCount INT DEFAULT 0
    // );`;

      // db.query(createCategoryTable, (err, result) => {
      //   if (err) console.log(err);
      //   else console.log("category table created");
      // });

      const createCourseTable = `
        CREATE TABLE IF NOT EXISTS course (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        price INT NOT NULL,
        intro_video VARCHAR(200),
        thumbnail VARCHAR(200) NOT NULL,
        video VARCHAR(200) NOT NULL,
        ppt VARCHAR(200) NOT NULL,
        resource TEXT NOT NULL
    );`;

      db.query(createCourseTable, (err, result) => {
        if (err) console.log(err);
        else console.log("course table created");
      });

    // const createBlogTable = `
    //   CREATE TABLE IF NOT EXISTS blogs (
    //   id INT AUTO_INCREMENT PRIMARY KEY,
    //   header VARCHAR(150) NOT NULL,
    //   img VARCHAR(200) NOT NULL,
    //   content TEXT NOT NULL,
    //   date DATETIME DEFAULT NOW()
    // );`;

    // db.query(createBlogTable, (err, result) => {
    //   if (err) console.log(err);
    //   else console.log("blog table created");
    // });

    // const createCartTable = `
    // CREATE TABLE IF NOT EXISTS cart (
    //   id INT AUTO_INCREMENT PRIMARY KEY,
    //   user_id INT NOT NULL,
    //   course_id VARCHAR(255) NOT NULL,
    //   product_count VARCHAR(255) NOT NULL,
    //   amount INT NOT NULL
    // );`;

    // db.query(createCartTable, (err, result) => {
    //   if (err) console.log(err);
    //   else console.log("cart table created");
    // });

    return done();
  });
}
