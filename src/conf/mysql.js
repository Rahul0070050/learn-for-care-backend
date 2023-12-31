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

    const userTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        type_of_account VARCHAR(50) NOT NULL,
        password VARCHAR(500) NOT NULL,
        country VARCHAR(50) NOT NULL,
        city VARCHAR(50) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        company_name VARCHAR(100) DEFAULT NULL,
        otp INT DEFAULT NULL,
        joined DATETIME DEFAULT NOW(),
        created_by INT DEFAULT NULL,
        profile_image VARCHAR(300) DEFAULT NULL,
        activate BOOLEAN DEFAULT FALSE,
        block BOOLEAN DEFAULT FALSE
      );`;

    db.query(userTable, (err, result) => {
      if (err) console.log(err);
      else console.log("user table created");
    });

    const createAdminTable = `
          CREATE TABLE IF NOT EXISTS admin (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(200) NOT NULL,
            employee_id INT DEFAULT NULL,
            employee_name VARCHAR(100) DEFAULT NULL,
            designation VARCHAR(250) DEFAULT NULL,
            department VARCHAR(100) DEFAULT NULL,
            phone VARCHAR(15) DEFAULT NULL,
            contact_no VARCHAR(15) DEFAULT NULL,
            gender VARCHAR(20) DEFAULT NULL,
            date_of_birth VARCHAR(25) DEFAULT NULL,
            next_to_kin VARCHAR(150) DEFAULT NULL,
            payroll_reference_number INT DEFAULT NULL,
            medical_details VARCHAR(250) DEFAULT NULL,
            national_insurance_number INT DEFAULT NULL,
            contract_type VARCHAR(150) DEFAULT NULL,
            date_of_joining DATETIME DEFAULT NULL,
            profile_image VARCHAR(200) DEFAULT NULL,
            profile_banner VARCHAR(200) DEFAULT NULL,
            staff_cv VARCHAR(150) DEFAULT NULL,
            correspondence_address VARCHAR(250) DEFAULT NULL,
            bank_holder_name VARCHAR(100) DEFAULT NULL,
            bank_name	VARCHAR(100) DEFAULT NULL,
            account_no VARCHAR(100) DEFAULT NULL,
            sort_code	VARCHAR(100) DEFAULT NULL,
            roll_number VARCHAR(100) DEFAULT NULL,
            otp INT DEFAULT NULL,
            brief_profile TEXT DEFAULT NULL
      );`;

    db.query(createAdminTable, (err, result) => {
      if (err) console.log(err);
      else console.log("admin table created");
    });

      const createCourseTable = `
        CREATE TABLE IF NOT EXISTS course (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DOUBLE NOT NULL,
        intro_video VARCHAR(200),
        thumbnail VARCHAR(200) NOT NULL,
        video VARCHAR(200) NOT NULL,
        ppt LONGTEXT NOT NULL,
        resource TEXT NOT NULL,
        assessment TEXT DEFAULT NULL,
        certificate TEXT DEFAULT NULL,
        certificate_line TEXT DEFAULT NULL,
        objective_define TEXT DEFAULT NULL,
        What_you_will_learn TEXT DEFAULT NULL,
        aims TEXT DEFAULT NULL,
        who_should_attend TEXT DEFAULT NULL,
        objectives_point TEXT DEFAULT NULL,
        what_you_will_learn_point TEXT DEFAULT NULL,
        selling_price INT DEFAULT NULL,
        RRP DOUBLE DEFAULT NULL,
        course_type VARCHAR(250) DEFAULT NULL,
        duration VARCHAR(250) DEFAULT NULL,
        course_level VARCHAR(250) DEFAULT NULL,
        course_code VARCHAR(250) DEFAULT NULL
    );`;
    
      db.query(createCourseTable, (err, result) => {
        if (err) console.log(err);
        else console.log("course table created");
      });

    const createBlogTable = `
      CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      header VARCHAR(150) NOT NULL,
      img VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      author VARCHAR(200) NOT NULL,
      tags VARCHAR(200) NOT NULL,
      state VARCHAR(15) NOT NULL DEFAULT 'published',
      date DATETIME DEFAULT NOW()
    );`;

    db.query(createBlogTable, (err, result) => {
      if (err) console.log(err);
      else console.log("blog table created");
    });

    const createInvoiceTable = `
      CREATE TABLE IF NOT EXISTS invoice (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      transaction_id INT DEFAULT NULL,
      applied_coupon INT DEFAULT NULL,
      total_price INT NOT NULL,
      img TEXT NOT NULL,
      date DATETIME DEFAULT NOW()
    );`;

    db.query(createInvoiceTable, (err, result) => {
      if (err) console.log(err);
      else console.log("blog table created");
    });

  const createAppliedCouponTable = `
    CREATE TABLE IF NOT EXISTS applied_coupon (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(10) NOT NULL,
    amount INT DEFAULT NULL,
    state BOOLEAN NOT NULL DEFAULT TRUE 
  )`;

  db.query(createAppliedCouponTable, (err, result) => {
    if (err) console.log(err);
    else console.log("blog table created");
  });

    const createCartTable = `
    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      course_id INT NOT NULL,
      product_count INT NOT NULL,
      thumbnail VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      item_type VARCHAR(20) NOT NULL,
      amount DOUBLE NOT NULL
    );`;

    db.query(createCartTable, (err, result) => {
      if (err) console.log(err);
      else console.log("cart table created");
    });
    
    const purchasedCourseTable = `
      CREATE TABLE IF NOT EXISTS purchased_course (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        amount TEXT NOT NULL,
        course_count INT NOT NULL,
        fake_course_count INT NOT NULL,
        user_type VARCHAR(20) DEFAULT NULL,
        course_type VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'not started',
        validity DATETIME NOT NULL,
        transition_id INT DEFAULT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

      db.query(purchasedCourseTable, (err, result) => {
        if (err) console.log(err.message);
        else console.log("purchasedCourse table created");
      });

      const enrolledCourseTable = `
        CREATE TABLE IF NOT EXISTS enrolled_course (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          course_id INT NOT NULL,
          progress VARCHAR(30) NOT NULL DEFAULT 0,
          validity VARCHAR(10) NOT NULL,
          color VARCHAR(15) NOT NULL,
          user_type VARCHAR(15) NOT NULL,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      db.query(enrolledCourseTable, (err, result) => {
        if (err) console.log(err.message);
        else console.log("enrolled_course table created");
      });

    const ExamTable = `
        CREATE TABLE IF NOT EXISTS exams (
          id INT AUTO_INCREMENT PRIMARY KEY,
          course_id INT NOT NULL UNIQUE,
          exam TEXT NOT NULL
        );
      `;

    db.query(ExamTable, (err, result) => {
      if (err) console.log(err.message);
      else console.log("exam table created");
    });

    const ExamAttemptsTable = `
        CREATE TABLE IF NOT EXISTS exam_attempts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          course_id INT NOT NULL,
          user_id TEXT NOT NULL,
          percentage INT DEFAULT NULL,
          enrolled_course_id INT NOT NULL UNIQUE,
          status VARCHAR(10) DEFAULT NULL
        );
      `;

    db.query(ExamAttemptsTable, (err, result) => {
      if (err) console.log(err.message);
      else console.log("exam_attempts table created");
    });

    const bundleExamAttemptsTable = `
        CREATE TABLE IF NOT EXISTS bundle_exam_attempts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          enrolled_bundle_id INT NOT NULL,
          user_id TEXT NOT NULL,
          course_id INT DEFAULT NULL,
          attempts INT DEFAULT 0,
          percentage INT DEFAULT NULL,
          date DATETIME DEFAULT NOW(),
          status VARCHAR(10) DEFAULT NULL
        );
      `;

    db.query(bundleExamAttemptsTable, (err, result) => {
      if (err) console.log(err.message);
      else console.log("exam_attempts table created");
    });

    const assignedToManagerTable = `
      CREATE TABLE IF NOT EXISTS course_assigned_manager (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        manager_id INT NOT NULL,
        owner INT NOT NULL,
        course_type VARCHAR(25) NOT NULL,
        fake_count INT NOT NULL,
        count INT NOT NULL,
        validity DATETIME NOT NULL,
        date DATETIME NOT NULL DEFAULT NOW()
      );
    `;

    db.query(assignedToManagerTable, (err, result) => {
      if (err) console.log(err);
      else console.log("exam table created");
    });

    // owner is who assigned the course to the user (company or manager)
    const assignedCourseTable = `
      CREATE TABLE IF NOT EXISTS assigned_course (
        id INT AUTO_INCREMENT PRIMARY KEY,
        owner INT NOT NULL, 
        course_id INT NOT NULL,
        course_type VARCHAR(20) NOT NULL,
        user_id INT NOT NULL DEFAULT 0,
        count INT NOT NULL DEFAULT 1,
        fake_count INT NOT NULL DEFAULT 1,
        validity DATETIME NOT NULL,
        date DATETIME NOT NULL DEFAULT NOW()
      );
    `;
    // status VARCHAR(20) NOT NULL DEFAULT 'not started',

    db.query(assignedCourseTable, (err, result) => {
      if (err) console.log(err);
      else console.log("assigned course table created");
    });

    const courseBundleTable = `
      CREATE TABLE IF NOT EXISTS course_bundle (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DOUBLE NOT NULL,
        courses VARCHAR(150) NOT NULL,
        image VARCHAR(150) NOT NULL,
        description TEXT NOT NULL
      );
    `;

    db.query(courseBundleTable, (err, result) => {
      if (err) console.log(err.message);
      else console.log("course bundle table created");
    });

    const enrollBundleTable = `
    CREATE TABLE IF NOT EXISTS enrolled_bundle (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bundle_name VARCHAR(150) NOT NULL,
      bundle_id INT,
      user_id INT NOT NULL,
      course_count INT NOT NULL,
      validity DATETIME NOT NULL,
      all_courses TEXT NOT NULL,
      unfinished_course TEXT DEFAULT ('[]'),
      finished_course TEXT DEFAULT ('[]'),
      progress INT DEFAULT 0,
      color VARCHAR(15) DEFAULT 'yellow'
    );
  `;

    db.query(enrollBundleTable, (err, result) => {
      if (err) console.log(err.message);
      else console.log("enrolled bundle table created");
    });

    const certificateTable = `
        CREATE TABLE IF NOT EXISTS certificate (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          course_name VARCHAR(50) NOT NULL,
          user_name VARCHAR(50) NOT NULL,
          date DATETIME NOT NULL DEFAULT NOW(),
          percentage INT NOT NULL,
          image VARCHAR(300) DEFAULT NULL
        ) AUTO_INCREMENT = 10000;
      `;

    db.query(certificateTable, (err, result) => {
      if (err) console.log(err);
      else console.log("user table created");
    });

    const qualificationsTable = `
        CREATE TABLE IF NOT EXISTS qualifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          admin_id INT NOT NULL UNIQUE,
          course_name VARCHAR(100) NOT NULL,
          university VARCHAR(100) NOT NULL,
          note VARCHAR(100) NOT NULL,
          doc VARCHAR(300) DEFAULT NULL
        );
      `;

    db.query(qualificationsTable, (err, result) => {
      if (err) console.log(err);
      else console.log("user table qualifications");
    });

    const experienceTable = `
        CREATE TABLE IF NOT EXISTS experience (
          id INT AUTO_INCREMENT PRIMARY KEY,
          admin_id INT NOT NULL UNIQUE,
          course_name VARCHAR(100) NOT NULL,
          designation VARCHAR(50) NOT NULL,
          no_of_years INT NOT NULL,
          content VARCHAR(100) NOT NULL,
          doc VARCHAR(300) DEFAULT NULL
        );
      `;

    db.query(experienceTable, (err, result) => {
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
          amount DOUBLE NOT NULL
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
          percent INT NOT NULL
        );
      `;

    db.query(volumeCouponTable, (err, result) => {
      if (err) console.log(err);
      else console.log("created table volume coupons");
    });

    const offerTextTable = `
      CREATE TABLE IF NOT EXISTS offer_text (
        id INT AUTO_INCREMENT PRIMARY KEY,
        offer_text TEXT DEFAULT NULL,
        hight_light_text VARCHAR(250) DEFAULT NULL,
        is_active BOOLEAN DEFAULT NULL,
        image VARCHAR(250) DEFAULT NULL
      );
    `;

    db.query(offerTextTable, (err, result) => {
      if (err) console.log(err);
      else console.log("created table volume coupons");
    });

    return done();
  });
}
