import { number, object, string } from "yup";
import { validateFile } from "../validateFileTypes.js";
export function validateCreateCertificateInfo(userData) {
  return new Promise((resolve, reject) => {
    let user = object({
      user_id: number().required("please provide user id"),
      course_name: string().required("please provide course name"),
      category: string().required("please provide category"),
      user_name: string().required("please provide user name"),
      date: string().required("please provide date"),
      percentage: number().required("please provide percentage"),
    });

    try {
      user
        .validate(userData)
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

export function validateGetCertificateByIdInfo(data) {
  return new Promise((resolve, reject) => {
    let info = object({
      id: number().required("please provide user id"),
    });

    try {
      info
        .validate(data)
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

export function validateSaveCertificateByUserIdInfo(file, body) {
  return new Promise((resolve, reject) => {
    let info = object({
      id: number().required("please provide user id"),
    });

    let image = validateFile([{ image: file.iamge }], "image");
    let data = info.validate(body);

    try {
      Promise.all([image, data])
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
