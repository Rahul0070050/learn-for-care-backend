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
          new Date(date_of_joining),
          correspondence_address,
          brief_profile,
        ],
        (err, result) => {
          if (err) {
            if (
              err.message ==
              `ER_DUP_ENTRY: Duplicate entry '${admin_id}' for key 'admin_info.admin_id'`
            ) {
              reject("admin already have the information");
            } else if (
              err.message ==
              `ER_DUP_ENTRY: Duplicate entry '${email}' for key 'admin_info.email'`
            ) {
              reject("this email already exist");
            } else {
              reject(err?.message);
            }
          } else {
            return resolve(result);
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}
export function saveNewQualifications(data) {
  return new Promise((resolve, reject) => {
    const { admin_id, university, note, doc } = data;
    let insertQuery =
      "INSERT INTO qualifications (admin_id, university, note, doc) VALUE (?,?,?,?)";
    db.query(insertQuery, [admin_id, university, note, doc], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function saveNewExperience(data) {
  return new Promise((resolve, reject) => {
    const { admin_id, organization, position, no_of_years, note, doc } = data;
    let insertQuery =
      "INSERT INTO experience (admin_id, organization, position, no_of_years, note, doc) VALUE (?,?,?,?,?,?)";
    db.query(
      insertQuery,
      [admin_id, organization, position, no_of_years, note, doc],
      (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      }
    );
  });
}

export function getQualificationDocFromDbByAdminIdAndDocId(id, adminId) {
  return new Promise((resolve, reject) => {
    let insertQuery =
      "SELECT * FROM qualifications WHERE id = ? AND admin_id = ?;";
    db.query(insertQuery, [id, adminId], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function updateQualificationDocDbByAdminIdAndDocId(id, adminId, doc) {
  return new Promise((resolve, reject) => {
    let insertQuery =
      "UPDATE qualifications SET doc = ? WHERE id = ? AND admin_id = ?;";
    db.query(insertQuery, [doc, id, adminId], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve();
    });
  });
}

export function getExperienceDocFromDbByAdminIdAndDocId(id, adminId) {
  return new Promise((resolve, reject) => {
    let insertQuery = "SELECT * FROM experience WHERE id = ? AND admin_id = ?;";
    db.query(insertQuery, [id, adminId], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function updateExperienceDocDbByAdminIdAndDocId(id, adminId, doc) {
  return new Promise((resolve, reject) => {
    let insertQuery =
      "UPDATE experience SET doc = ? WHERE id = ? AND admin_id = ?;";
    db.query(insertQuery, [doc, id, adminId], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve();
    });
  });
}

//
export function updateAdminExperienceToDb(info) {
  return new Promise((resolve, reject) => {
    const { doc_id, organization, position, no_of_years, note } = info;
    let updateQuery =
      "UPDATE experience SET organization = ?, position = ?, no_of_years = ?, note = ? WHERE id = ?";
    db.query(
      updateQuery,
      [organization, position, no_of_years, note, doc_id],
      (err, result) => {
        if (err) return reject(err?.message);
        else return resolve();
      }
    );
  });
}

export function updateAdminQualificationToDb(data) {
  return new Promise((resolve, reject) => {
    const { doc_id, university, note } = data;
    let updateQuery =
      "UPDATE qualifications SET university = ?, note = ? WHERE id = ?";
    db.query(updateQuery, [university, note, doc_id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve();
    });
  });
}
//
//  ================
export function getExperienceDocFromDbById(id) {
  return new Promise((resolve, reject) => {
    let insertQuery = "SELECT * FROM experience WHERE id = ?;";
    db.query(insertQuery, [id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function getQualificationDocFromDbById(id) {
  return new Promise((resolve, reject) => {
    let insertQuery = "SELECT * FROM experience WHERE id = ?;";
    db.query(insertQuery, [id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function deleteExperienceFromDb(id) {
  return new Promise((resolve, reject) => {
    let insertQuery = "DELETE FROM experience WHERE id = ?;";
    db.query(insertQuery, [id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function deleteQualificationFromDb(id) {
  return new Promise((resolve, reject) => {
    let insertQuery = "DELETE FROM qualifications WHERE id = ?;";
    db.query(insertQuery, [id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}
//  ================
export function getAdminQualificationsDocs(id) {
  return new Promise((resolve, reject) => {
    let insertQuery = "SELECT * FROM qualifications WHERE admin_id = ?;";
    db.query(insertQuery, [id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result.flat());
    });
  });
}
export function getAdminExperiencesDocs(id) {
  return new Promise((resolve, reject) => {
    let insertQuery = "SELECT * FROM experience WHERE admin_id = ?;";
    db.query(insertQuery, [id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result.flat());
    });
  });
}
