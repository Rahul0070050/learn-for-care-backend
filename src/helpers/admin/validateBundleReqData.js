import { number, object, string, array } from "yup";
import { validateFile } from "../validateFileTypes.js";

export function checkCreateBundleReqBody(body, file) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      name: string().required("please provide valid name"),
      description: string().required("please provide valid description"),
      courses: string().required("please provide valid course"),
      price: string().required("please provide valid price")
      // category: string().required("please provide valid category"),
    });

    body.courses = JSON.stringify(body.courses);
    console.log(body);

    if (Array.isArray(file?.image)) {
      file = { image: file?.image[0] };
    }

    let image = validateFile([{ image: file.image }], "image");
    let bodyResult = bodyTemplate.validate(body);

    try {
      Promise.all([bodyResult, image])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function validateDeleteBundle(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      id: string().required("please provide valid id"),
    });

    let bodyResult = bodyTemplate.validate(body);

    try {
      bodyResult
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}
export function validateEditBundle(data) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      id: number().required("please provide valid id"),
      name: string().required("please provide valid name"),
      description: string().required("please provide valid description"),
      courses: array().of(number()).required("please provide valid course"),
      price: string().required("please provide valid price"),
    });

    let bodyResult = bodyTemplate.validate(data);

    try {
      bodyResult
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function validateEditBundleImage(data, files) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      id: number().required("please provide valid id"),
    });

    let bodyResult = bodyTemplate.validate(data);
    let image = validateFile([{ image: files.image }], "image");

    try {
      Promise.all([bodyResult, image])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkGetBlogByIdReqDate(id) {
  return new Promise((resolve, reject) => {
    try {
      let blog_id = number().required("please provide valid blog id");

      blog_id
        .validate(id)
        .then((result) => {
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
