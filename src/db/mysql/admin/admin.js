import { db } from "../../../conf/mysql.js";
import { getNewBlogs } from "./blog.js";
import { geCountOfAllCertificates } from "./certificate.js";
import { geCountOfAllCourse } from "./course.js";
import { getAllPurchasedCourseFromDb } from "./purchasedCourse.js";
import {
  geCountOfAllCompanyUsers,
  geCountOfAllIndividualUsers,
  getNewCompanyUsers,
  getNewUsers,
} from "./user.js";

export function getDashboardData() {
  return new Promise(async (resolve, reject) => {
    try {
      let newUsers = await getNewUsers();
      let newCompanyUsers = await getNewCompanyUsers();
      let newBlogs = await getNewBlogs();
      let company_users_count = await geCountOfAllCompanyUsers();
      let individual_users_count = await geCountOfAllIndividualUsers();
      let certificates_count = await geCountOfAllCertificates();
      let course_count = await geCountOfAllCourse();

      let getQuery = `SELECT * FROM purchased_course ORDER BY id DESC;`;
      db.query(getQuery, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          let response = {
            newUsers: newUsers,
            newBlogs: newBlogs,
            ["new_company_users"]: newCompanyUsers,
            purchasedCourse: result,
            company_users_count: company_users_count[0]["COUNT(*)"],
            individual_users_count: individual_users_count[0]["COUNT(*)"],
            ["certificates_count"]: certificates_count[0]["COUNT(*)"],
            ["course_count"]: course_count[0]["COUNT(*)"],
          };
          return resolve(response);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function setAdminInfoToDb(userData) {
  return new Promise((resolve, reject) => {
    try {
      const {
        admin_id,
        employee_id,
        employee_name,
        designation,
        email,
        department,
        phone,
        contact_no,
        gender,
        date_of_birth,
        next_to_kin,
        payroll_reference_number,
        medical_details,
        national_insurance_number,
        contract_type,
        date_of_joining,
        correspondence_address,
        brief_profile,
      } = userData;
      let setQuery = `
      INSERT INTO admin_info (
        admin_id,
        employee_id,
        employee_name,
        designation,
        email,
        department,
        phone,
        contact_no,
        gender,
        date_of_birth,
        next_to_kin,
        payroll_reference_number,
        medical_details,
        national_insurance_number,
        contract_type,
        date_of_joining,
        correspondence_address,
        brief_profile
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
      db.query(
        setQuery,
        [
          admin_id,
          employee_id,
          employee_name,
          designation,
          email,
          department,
          phone,
          contact_no,
          gender,
          date_of_birth,
          next_to_kin,
          payroll_reference_number,
          medical_details,
          national_insurance_number,
          contract_type,
          date_of_joining,
          correspondence_address,
          brief_profile,
        ],
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
