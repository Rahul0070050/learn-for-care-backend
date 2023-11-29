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

export function validateStartBundleReqData(data) {
  return new Promise((resolve, reject) => { 
    try {
      let template = object({
        bundle_id: number().required("please provide valid bundle id"),
        from: string().required("please provide valid from field")
      })
      
      template.validate(data).then((result) => {
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

export function validateGetBundleInfoReqData(data) {
  return new Promise((resolve, reject) => { 
    try {
      let template = object({
        id: number().required("please provide valid bundle id"),
      })
      
      template.validate(data).then((result) => {
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

export function validateSTartBundleCourseReqData(data) {
  return new Promise((resolve, reject) => { 
    try {
      let template = object({
        course_id: number().required("please provide valid course id"),
        enrolled_bundle_id: number().required("please provide valid bundle id"),
      })
      
      template.validate(data).then((result) => {
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

export function validateGetCourseReqData(data) {
  return new Promise((resolve, reject) => { 
    try {
      let template = object({
        course_id: number().required("please provide valid course id"),
        bundleId: number().required("please provide valid bundle id"),
      })
      
      template.validate(data).then((result) => {
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

export function validateGetExamReqData(data) {
  return new Promise((resolve, reject) => { 
    try {
      let template = object({
        bundle_id: number().required("please provide valid bundle id"),
        course_id: number().required("please provide valid course id"),
      })
      
      template.validate(data).then((result) => {
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