import { number, object, string, array } from "yup";
import { validateFile } from "../validateFileTypes.js";

export function checkCreateBlogReqBody(body, file) {
  console.log(body);
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      header: string().required("please provide valid header"),
      content: string().required("please provide valid content"),
      author: string().required("please provide valid author name"),
      tags: string().required("please provide valid tags"),
    });

    if(Array.isArray(file?.image)) {
      file = {image: file?.image[0]}
    };

    let imageFile = validateFile([file], "image");
    let bodyResult = bodyTemplate.validate(body);

    try {
      Promise.all([bodyResult, imageFile])
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

export function checkUpdateBlogStatusReqBody(data) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      id: string().required("please provide valid id"),
      status: number().required("please provide status")
    });

    
    try {
      bodyTemplate.validate(data).then((result) => {
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
      let blog_id = number().required("please provide valid blog id")
      
      blog_id.validate(id).then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err?.message);
      });
    } catch (error) {
      reject(error?.message)
    }
   })
}

export function checkUpDateBlogImageBodyAndFile(
  body,
  file
) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      blog_id: number().required("please provide valid blog id"),
    });
    
    if(Array.isArray(file.image)) {
      file = {image: file.image[0]}
    };

    let imageFile = validateFile([file], "image");
    let bodyResult = bodyTemplate.validate(body);

    try {
      Promise.all([bodyResult, imageFile])
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

export function checkUpdateBlogDataReqBody(body) {
  return new Promise((resolve, reject) => {
    console.log(body);
    let bodyTemplate = object({
      blog_id: number().required("please provide valid blog id"),
      header: string().required("please provide valid header"),
      content: string().required("please provide valid content"),
      author: string().required("please provide valid content"),
      tags: string().required("please provide valid tags")
    });

    let bodyResult = bodyTemplate.validate(body);
    try {
      Promise.all([bodyResult])
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

export function checkUpdateBlogViewCountReqBody(body) {
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
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkDeleteBlogReqBody(body) {
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
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}
