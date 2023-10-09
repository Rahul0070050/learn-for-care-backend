import { number, object, string } from "yup";
import { blogBody } from "../../type/blog";
import { validateFile } from "../validateFileTypes";

export function checkCreateBlogReqBody(body: blogBody, file: any) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      header: string().required("please provide valid header"),
      content: string().required("please provide valid content"),
    });

    let imageFile = validateFile(file, "image");
    let bodyResult = bodyTemplate.validate(body);
    try {
      Promise.all([bodyResult, imageFile])
        .then((result) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkUpDateBlogImageBodyAndFile(
  body: { blog_id: number },
  file: any
) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      blog_id: number().required("please provide valid blog id"),
    });

    let imageFile = validateFile(file, "image");
    let bodyResult = bodyTemplate.validate(body);

    try {
      Promise.all([bodyResult, imageFile])
        .then((result) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkUpdateBlogDataReqBody(body: blogBody) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      blog_id: number().required("please provide valid blog id"),
      header: string().required("please provide valid header"),
      content: string().required("please provide valid content"),
    });

    let bodyResult = bodyTemplate.validate(body);
    try {
      Promise.all([bodyResult])
        .then((result) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkDeleteBlogReqBody(body: {blog_id:string}) {
  return new Promise((resolve, reject) => { 
    let bodyTemplate = object({
      blog_id: number().required("please provide valid blog id"),
    });

    let bodyResult = bodyTemplate.validate(body);
    try {
      Promise.all([bodyResult])
        .then((result) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
   })
}