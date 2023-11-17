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

// TODO: uncomment
export function mySqlConnect(done) {
  db.getConnection((err) => {
    if (err) return done(err);

    // const userTable = `
    //   CREATE TABLE IF NOT EXISTS users (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     first_name VARCHAR(50) NOT NULL,
    //     last_name VARCHAR(50) NOT NULL,
    //     email VARCHAR(50) NOT NULL UNIQUE,
    //     type_of_account VARCHAR(50) NOT NULL,
    //     password VARCHAR(500) NOT NULL,
    //     country VARCHAR(50) NOT NULL,
    //     city VARCHAR(50) NOT NULL,
    //     phone VARCHAR(15) NOT NULL,
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
    //     CREATE TABLE IF NOT EXISTS category (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     category VARCHAR(50) UNIQUE NOT NULL,
    //     productCount INT DEFAULT 0
    //   );`;

    // db.query(createCategoryTable, (err, result) => {
    //   if (err) console.log(err);
    //   else console.log("category table created");
    // });

    //   const createCourseTable = `
    //     CREATE TABLE IF NOT EXISTS course (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     name VARCHAR(200) NOT NULL,
    //     description TEXT NOT NULL,
    //     category VARCHAR(50) NOT NULL,
    //     price INT NOT NULL,
    //     intro_video VARCHAR(200),
    //     thumbnail VARCHAR(200) NOT NULL,
    //     video VARCHAR(200) NOT NULL,
    //     ppt VARCHAR(200) NOT NULL,
    //     resource TEXT NOT NULL
    // );`;

    //   db.query(createCourseTable, (err, result) => {
    //     if (err) console.log(err);
    //     else console.log("course table created");
    //   });

    const createBlogTable = `
      CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      header VARCHAR(150) NOT NULL,
      img VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      author VARCHAR(200) NOT NULL,
      tags VARCHAR(200) NOT NULL,
      views INT NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT FALSE,
      date DATETIME DEFAULT NOW()
    );`;

    db.query(createBlogTable, (err, result) => {
      if (err) console.log(err);
      else console.log("blog table created");
    });

    // const createCartTable = `
    // CREATE TABLE IF NOT EXISTS cart (
    //   id INT AUTO_INCREMENT PRIMARY KEY,
    //   user_id INT NOT NULL,
    //   course_id INT NOT NULL,
    //   product_count INT NOT NULL,
    //   thumbnail VARCHAR(255) NOT NULL,
    //   name VARCHAR(255) NOT NULL,
    //   item_type VARCHAR(20) NOT NULL,
    //   amount INT NOT NULL
    // );`;

    // db.query(createCartTable, (err, result) => {
    //   if (err) console.log(err);
    //   else console.log("cart table created");
    // });

    //   const purchasedCourseTable = `
    //     CREATE TABLE IF NOT EXISTS purchased_course (
    //       id INT AUTO_INCREMENT PRIMARY KEY,
    //       user_id INT NOT NULL,
    //       course_id INT NOT NULL,
    //       amount TEXT NOT NULL,
    //       course_count INT NOT NULL,
    //       fake_course_count INT NOT NULL,
    //       user_type VARCHAR(20) NOT NULL,
    //       status VARCHAR(20) NOT NULL DEFAULT 'not started',
    //       validity VARCHAR(10) NOT NULL,
    //       date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //     );
    //   `;


    //   db.query(purchasedCourseTable, (err, result) => {
    //     if (err) console.log(err.message);
    //     else console.log("purchasedCourse table created");
    //   });

    //   const enrolledCourseTable = `
    //     CREATE TABLE IF NOT EXISTS enrolled_course (
    //       id INT AUTO_INCREMENT PRIMARY KEY,
    //       user_id INT NOT NULL,
    //       course_id INT NOT NULL,
    //       progress VARCHAR(30) NOT NULL DEFAULT 0,
    //       validity VARCHAR(10) NOT NULL,
    //       color VARCHAR(15) NOT NULL,
    //       user_type VARCHAR(15) NOT NULL,
    //       date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //     );
    //   `;

    //   db.query(enrolledCourseTable, (err, result) => {
    //     if (err) console.log(err.message);
    //     else console.log("enrolled_course table created");
    //   });

    // const ExamTable = `
    //     CREATE TABLE IF NOT EXISTS exams (
    //       id INT AUTO_INCREMENT PRIMARY KEY,
    //       course_id INT NOT NULL UNIQUE,
    //       exam TEXT NOT NULL
    //     );
    //   `;

    // db.query(ExamTable, (err, result) => {
    //   if (err) console.log(err.message);
    //   else console.log("exam table created");
    // });

    //   const ExamAttemptsTable = `
    //     CREATE TABLE IF NOT EXISTS exam_attempts (
    //       id INT AUTO_INCREMENT PRIMARY KEY,
    //       course_id INT NOT NULL,
    //       user_id TEXT NOT NULL,
    //       attempts INT NOT NULL,
    //       percentage INT NOT NULL,
    //       status VARCHAR(10) NOT NULL
    //     );
    //   `;

    //   db.query(ExamAttemptsTable, (err, result) => {
    //     if (err) console.log(err.message);
    //     else console.log("exam_attempts table created");
    //   });

    // const subUserTable = `
    //   CREATE TABLE IF NOT EXISTS sub_user (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     first_name VARCHAR(250) NOT NULL,
    //     last_name VARCHAR(250) NOT NULL,
    //     password VARCHAR(250) NOT NULL,
    //     type_of_account VARCHAR(250) NOT NULL DEFAULT 'sub_user',
    //     email VARCHAR(250) NOT NULL UNIQUE,
    //     phone INT DEFAULT NULL,
    //     city VARCHAR(250) NOT NULL,
    //     country VARCHAR(250) NOT NULL,
    //     created_by INT NOT NULL,
    //     block BOOLEAN NOT NULL DEFAULT FALSE
    //   );
    // `;

    // db.query(subUserTable, (err, result) => {
    //   if (err) console.log(err.message);
    //   else console.log("sub_user table created");
    // });

    // const assignedCourseTable = `
    //   CREATE TABLE IF NOT EXISTS assigned_course (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     company_id INT NOT NULL,
    //     course_id INT NOT NULL,
    //     sub_user_id INT NOT NULL,
    //     progress INT NOT NULL DEFAULT 0,
    //     course_count INT NOT NULL DEFAULT 1,
    //     color VARCHAR(15) NOT NULL DEFAULT 'red',
    //     validity VARCHAR(15) NOT NULL
    //   );
    // `;

    //   db.query(assignedCourseTable, (err, result) => {
    //     if (err) console.log(err.message);
    //     else console.log("assigned course table created");
    //   });

    // const subAdminTable = `
    //   CREATE TABLE IF NOT EXISTS sub_admin (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     name VARCHAR(150) NOT NULL,
    //     email VARCHAR(150) NOT NULL UNIQUE,
    //     password VARCHAR(150) NOT NULL,
    //     block BOOLEAN DEFAULT FALSE
    //   );
    // `;

    // db.query(subAdminTable, (err, result) => {
    //   if (err) console.log(err.message);
    //   else console.log("assigned course table created");
    // });

    // const courseBundleTable = `
    //   CREATE TABLE IF NOT EXISTS course_bundle (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     name VARCHAR(150) NOT NULL,
    //     price INT NOT NULL,
    //     courses VARCHAR(150) NOT NULL,
    //     description TEXT NOT NULL
    //   );
    // `;

    // db.query(courseBundleTable, (err, result) => {
    //   if (err) console.log(err.message);
    //   else console.log("course bundle table created");
    // });

    // const managerTable = `
    //     CREATE TABLE IF NOT EXISTS manager (
    //       id INT AUTO_INCREMENT PRIMARY KEY,
    //       first_name VARCHAR(50) NOT NULL,
    //       last_name VARCHAR(50) NOT NULL,
    //       email VARCHAR(50) NOT NULL UNIQUE,
    //       password VARCHAR(500) NOT NULL,
    //       country VARCHAR(50) NOT NULL,
    //       city VARCHAR(50) NOT NULL,
    //       phone VARCHAR(15) NOT NULL,
    //       company_name VARCHAR(100) DEFAULT NULL,
    //       joined DATETIME DEFAULT NOW(),
    //       profile_image VARCHAR(300) DEFAULT NULL,
    //       block BOOLEAN DEFAULT FALSE
    //     );`;

    //   db.query(managerTable, (err, result) => {
    //     if (err) console.log(err);
    //     else console.log("user table created");
    //   });

    // const certificateTable = `
    //     CREATE TABLE IF NOT EXISTS certificate (
    //       id INT AUTO_INCREMENT PRIMARY KEY,
    //       user_id INT NOT NULL,
    //       course_name VARCHAR(50) NOT NULL,
    //       user_name VARCHAR(50) NOT NULL,
    //       date DATETIME NOT NULL DEFAULT NOW(),
    //       percentage INT NOT NULL,
    //       image VARCHAR(300) DEFAULT NULL
    //     ) AUTO_INCREMENT = 10000;
    //   `;

    // db.query(certificateTable, (err, result) => {
    //   if (err) console.log(err);
    //   else console.log("user table created");
    // });

    //   const adminInfoTable = `
    //   CREATE TABLE IF NOT EXISTS admin_info (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     admin_id INT NOT NULL UNIQUE,
    //     employee_id INT NOT NULL,
    //     employee_name VARCHAR(100) NOT NULL,
    //     email VARCHAR(100) NOT NULL UNIQUE,
    //     designation VARCHAR(250) NOT NULL,
    //     department VARCHAR(100) NOT NULL,
    //     phone VARCHAR(15) NOT NULL,
    //     contact_no VARCHAR(15) NOT NULL,
    //     gender VARCHAR(20) NOT NULL,
    //     date_of_birth VARCHAR(25) NOT NULL,
    //     next_to_kin VARCHAR(150) NOT NULL,
    //     payroll_reference_number INT NOT NULL,
    //     medical_details VARCHAR(250) NOT NULL,
    //     national_insurance_number INT NOT NULL,
    //     contract_type VARCHAR(150) NOT NULL,
    //     date_of_joining DATETIME NOT NULL,
    //     correspondence_address VARCHAR(250) NOT NULL,
    //     brief_profile TEXT NOT NULL
    //   )
    // `;

    // db.query(adminInfoTable, (err, result) => {
    //   if (err) console.log(err);
    //   else console.log("user table admin_info");
    // });

    const qualificationsTable = `
        CREATE TABLE IF NOT EXISTS qualifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          admin_id INT NOT NULL UNIQUE,
          university VARCHAR(100) NOT NULL,
          note VARCHAR(100) NOT NULL,
          doc VARCHAR(300) DEFAULT NULL
        );
      `;

    db.query(qualificationsTable, (err, result) => {
      if (err) console.log(err);
      else console.log("user table qualifications");
    });

    const certificateTable = `
        CREATE TABLE IF NOT EXISTS experience (
          id INT AUTO_INCREMENT PRIMARY KEY,
          admin_id INT NOT NULL UNIQUE,
          organization VARCHAR(100) NOT NULL,
          position VARCHAR(50) NOT NULL,
          no_of_years INT NOT NULL,
          note VARCHAR(100) NOT NULL,
          doc VARCHAR(300) DEFAULT NULL
        );
      `;

    db.query(certificateTable, (err, result) => {
      if (err) console.log(err);
      else console.log("user table experience");
    });

    const couponTable = `
        CREATE TABLE IF NOT EXISTS coupons (
          id INT AUTO_INCREMENT PRIMARY KEY,
          coupon_code VARCHAR(20) NOT NULL,
          valid_till DATETIME NOT NULL,
          coupon_type VARCHAR(50) NOT NULL,
          minimum_purchase INT NOT NULL,
          amount INT NOT NULL
        );
      `;

    db.query(couponTable, (err, result) => {
      if (err) console.log(err);
      else console.log("created table coupons");
    });

    const volumeCouponTable = `
        CREATE TABLE IF NOT EXISTS volume_coupons (
          id INT AUTO_INCREMENT PRIMARY KEY,
          coupon_code VARCHAR(20) NOT NULL,
          max_val INT NOT NULL,
          min_val INT NOT NULL,
          amount INT NOT NULL
        );
      `;

      db.query(volumeCouponTable, (err, result) => {
        if (err) console.log(err);
        else console.log("created table volume coupons");
      });

      const offerTextTable = `
      CREATE TABLE IF NOT EXISTS offer_text (
        id INT AUTO_INCREMENT PRIMARY KEY,
        offer_text TEXT NOT NULL,
        hight_light_text VARCHAR(250) NOT NULL,
        is_active BOOLEAN NOT NULL
      );
    `;

    db.query(offerTextTable, (err, result) => {
      if (err) console.log(err);
      else console.log("created table volume coupons");
    });

    return done();
  });
}
