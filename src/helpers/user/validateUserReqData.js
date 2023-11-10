import yup, {object,number,string} from "yup";

export function validateUpdateUserInfo(userInfo) {
  return new Promise((resolve, reject) => {
    let user = object({
      first_name: string().required("please provide first_name"),
      last_name: string().required("please provide last_name"),
      phone: string().required("please provide phone"),
      city: string().required("please provide city"),
    });

    try {
      user
        .validate(userInfo)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}
export function checkCreateSubUSerReqBody(body) {
  return new Promise((resolve, reject) => {
    try {
      const schema = yup.object({
        first_name: yup.string().required("please provide valid first_name"),
        last_name: yup.string().required("please provide valid last_name"),
        password: yup.string().required("please provide valid password"),
        email: yup.string().email().required("please provide valid email"),
        city: yup.string().required("please provide valid city"),
        country: yup.string().required("please provide valid country"),
      });

      let value = schema.validate(body);

      value
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error.message);
    }
  });
}

export function checkBlockSubUserRewData(body) {
  return new Promise((resolve, reject) => {
    try {
      const schema = yup.object({
        sub_user_id: yup.string().required("please provide valid sub-user id"),
      });

      let value = schema.validate(body);

      value
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error.message);
    }
  });
}

export function checkUnBlockSubUserRewData(body) {
  return new Promise((resolve, reject) => {
    try {
      const schema = yup.object({
        sub_user_id: yup.string().required("please provide valid sub-user id"),
      });

      let value = schema.validate(body);

      value
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error.message);
    }
  });
}

export function checkAssignCourseToSubUserReqData(body) {
  return new Promise((resolve, reject) => {
    try {
      const schema = yup.object({
        sub_user_id: yup.string().required("please provide valid sub-user id"),
        course_id: yup.string().required("please provide valid sub-user id"),
        purchased_course_id: yup.string().required("please provide valid purchased course id"),
      });

      let value = schema.validate(body);

      value
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error.message);
    }
  });
}
