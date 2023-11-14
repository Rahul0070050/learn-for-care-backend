import { db } from "../../../conf/mysql.js";
import { getNewBlogs } from "./blog.js";
import { getAllPurchasedCourseFromDb } from "./purchasedCourse.js";
import { geCountOfAllCompanyUsers, geCountOfAllIndividualUsers, getNewUsers } from "./user.js";

export function getDashboardData() {
  return new Promise(async (resolve, reject) => {
    try {
      let purchasedCourse = await getAllPurchasedCourseFromDb();
      let newUsers = await getNewUsers();
      let newBlogs = await getNewBlogs();
      let company_users_count = await geCountOfAllCompanyUsers();
      let individual_users_count = await geCountOfAllIndividualUsers();

      let getQuery = `SELECT id, amount, fake_course_count FROM purchased_course;`;
      db.query(getQuery, (err, result) => {
        if (err) {
          return reject(err.message)
        }else {
          let response = {
            purchasedCourse: purchasedCourse,
            newUsers: newUsers,
            newBlogs: newBlogs,
            company_users_count: company_users_count[0]["COUNT(*)"],
            individual_users_count: individual_users_count[0]["COUNT(*)"],
            purchasedCourse: result
          }
          return resolve(response);
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
