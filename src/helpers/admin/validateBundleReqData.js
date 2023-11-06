import { number, object, string, array } from "yup";
import { validateFile } from "../validateFileTypes.js";

export function checkCreateBundleReqBody(body, file) {
  return new Promise((resolve, reject) => {
    
    let bodyTemplate = object({
      name: string().required("please provide valid name"),
      description: string().required("please provide valid description"),
      courses: array().of(number()).required("please provide valid course"),
      price: string().required("please provide valid price"),
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
