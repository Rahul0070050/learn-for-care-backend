import { number, object, string, array } from "yup";
import { validateFile } from "../validateFileTypes.js";

export function checkGetBundleByIdReqDate(id) {
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
