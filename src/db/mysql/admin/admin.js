import { db } from "../../../conf/mysql.js";
import { getAllMAnagers } from "../users/users.js";
import { getNewBlogs } from "./blog.js";
import {
  getCountOfAssignedBundleByOwnerId,
  getCountOfBundleByOwnerId,
} from "./bundle.js";
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
  return new Promise(async (resolve, reject) => {
    console.log("userData ", userData);
    console.log("contact_no ", userData.account_no);
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
        bank_holder_name,
        bank_name,
        account_no,
        sort_code,
        roll_number,
        recent_qualification,
        next_to_kin_number,
        permanent_address,
      } = userData;
      let setQuery = `
      UPDATE admin
      SET employee_id = ?, employee_name = ?, designation = ?, department = ?,
      phone = ?, contact_no = ?, gender = ?, date_of_birth = ?, next_to_kin = ?,
      payroll_reference_number = ?, medical_details = ?, national_insurance_number = ?,
      contract_type = ?, date_of_joining = ?, correspondence_address = ?, brief_profile = ?,
      bank_holder_name = ?, bank_name = ?, account_no = ?, sort_code = ?, roll_number = ?,
      recent_qualification = ?, next_to_kin_number = ?, permanent_address = ?
      WHERE id = ?`;

      db.query(
        setQuery,
        [
          employee_id,
          employee_name,
          designation,
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
          bank_holder_name,
          bank_name,
          account_no,
          sort_code,
          roll_number,
          recent_qualification,
          next_to_kin_number,
          permanent_address,
          admin_id,
        ],
        (err, result) => {
          if (err) {
            if (
              err.message ==
              `ER_DUP_ENTRY: Duplicate entry '${admin_id}' for key 'admin.admin_id'`
            ) {
              reject("admin already have the information");
            } else if (
              err.message ==
              `ER_DUP_ENTRY: Duplicate entry '${email}' for key 'admin.email'`
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

export function getAllIndividualsAndCompaniesFromDb() {
  return new Promise((resolve, reject) => {
    let getQuery =
      "SELECT id, first_name, last_name, email, type_of_account FROM users WHERE type_of_account = 'individual' OR type_of_account = 'company'";
    db.query(getQuery, (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function saveNewQualifications(data) {
  return new Promise((resolve, reject) => {
    const { admin_id, university, content, doc, course_name } = data;
    let insertQuery =
      "INSERT INTO qualifications (admin_id, university, content, doc, course_name) VALUE (?,?,?,?,?)";
    db.query(
      insertQuery,
      [admin_id, university, content, doc, course_name],
      (err, result) => {
        if (err) return reject(err?.message);
        else return resolve(result);
      }
    );
  });
}
export function getAllQualificationsFromDB(admin_id) {
  return new Promise((resolve, reject) => {
    let insertQuery = "SELECT * FROM qualifications WHERE admin_id = ?;";
    db.query(insertQuery, [admin_id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function getAllExperiencesData(admin_id) {
  return new Promise((resolve, reject) => {
    let insertQuery = "SELECT * FROM experience WHERE admin_id = ?;";
    db.query(insertQuery, [admin_id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function saveNewExperience(data) {
  return new Promise((resolve, reject) => {
    const {
      admin_id,
      organization_name,
      designation,
      no_of_years,
      content,
      doc,
    } = data;
    let insertQuery =
      "INSERT INTO experience (admin_id, organization_name, designation, no_of_years, content, doc) VALUE (?,?,?,?,?,?)";
    db.query(
      insertQuery,
      [admin_id, organization_name, designation, no_of_years, content, doc],
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
    let insertQuery = "SELECT * FROM qualifications WHERE id = ?;";
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

export function getAdminInfoFromDb(id) {
  return new Promise((resolve, reject) => {
    let getQuery = "SELECT * FROM admin WHERE id = ?;";
    db.query(getQuery, [id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function setStaffCVToDb(data) {
  const { file, adminId } = data;
  return new Promise((resolve, reject) => {
    let getQuery = "UPDATE admin SET staff_cv = ? WHERE id = ?;";
    db.query(getQuery, [file, adminId], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}

export function saveBannerToDb(id, banner) {
  return new Promise((resolve, reject) => {
    let updateQuery = "UPDATE admin SET profile_banner = ? WHERE id = ?";
    db.query(updateQuery, [banner, id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve();
    });
  });
}

export function saveImageToDb(id, image) {
  return new Promise((resolve, reject) => {
    console.log(id, image);
    let updateQuery = "UPDATE admin SET profile_image = ? WHERE id = ?";
    db.query(updateQuery, [image, id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve();
    });
  });
}

export function getManagerReport(id) {
  return new Promise(async (resolve, reject) => {
    console.log(id);
    let managers = await getAllMAnagers(id);
    // managers.map(async(item) => {
    //   let count1 = await getCountOfAssignedBundleByOwnerId(item.id)
    //   let count2 = await getCountOfBundleByOwnerId(item.id)
    // })
    let updateQuery = `
    SELECT 
    users.*, 
    purchased_course.fake_course_count AS purchased_count, 
    purchased_course.course_type AS purchased_type
    FROM users
    LEFT JOIN purchased_course ON purchased_course.user_id = users.id
    WHERE type_of_account = ? AND created_by = ?;
    `;
    db.query(updateQuery, ["manager", id], (err, result) => {
      if (err) return reject(err?.message);
      else return resolve(result);
    });
  });
}
