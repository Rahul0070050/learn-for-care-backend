import yup, {object,number,string} from "yup";
import { validateFile } from "../validateFileTypes.js";

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
        phone: yup.number().required("please provide valid phone"),
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

export function checkAssignCourseToManagerReqData(body) {
  return new Promise((resolve, reject) => {
    try {
      const schema = yup.object({
        course_id: yup.number().required("please provide valid purchased id"), // purchased course primary key
        userId: yup.number().required("please provide valid sub-user id"), // manager id
        count: yup.number().required("please provide valid sub-user id"), // course count
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

export function checkCreateManagerReqBody(body) {
  return new Promise((resolve, reject) => {
    try {
      const schema = yup.object({
        first_name: yup.string().required("please provide valid first_name"),
        last_name: yup.string().required("please provide valid last_name"),
        password: yup.string().required("please provide valid password"),
        email: yup.string().email().required("please provide valid email"),
        city: yup.string().required("please provide valid city"),
        country: yup.string().required("please provide valid country"),
        phone: yup.number().required("please provide valid phone"),
        user_type: yup.string().required("please provide valid type of user"),
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


export function checkCreateManagerIndividualReqBody(body) {
  return new Promise((resolve, reject) => {
    try {
      const schema = yup.object({
        first_name: yup.string().required("please provide valid first_name"),
        last_name: yup.string().required("please provide valid last_name"),
        password: yup.string().required("please provide valid password"),
        email: yup.string().email().required("please provide valid email"),
        city: yup.string().required("please provide valid city"),
        country: yup.string().required("please provide valid country"),
        phone: yup.number().required("please provide valid phone"),
        user_type: yup.string().required("please provide valid type of user"),
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

export function checkSetUserProfileImageReqData(file) {
  return new Promise((resolve, reject) => {
    console.log(file);
    let image = validateFile([{ image: file.image }], "image");
    try {
      image.then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}