import { mixed, number, object, string } from "yup";
import { CourseBodyType } from "../../type/course";
import { validateFile } from "../validateFileTypes";

export function checkAddCourseReqBodyAndFile(body: CourseBodyType, files: any) {
  return new Promise((resolve, reject) => {
    try {
      let VideoFile = validateFile({ video: files.video }, "video");
      let introVideoFile = validateFile(
        { intro_video: files.intro_video },
        "intro_video"
      );
      let ImageFile = validateFile({ thumbnail: files.thumbnail }, "thumbnail");
      let PdfFile = validateFile({ pdf: files.pdf }, "pdf");
      let PptFile = validateFile({ ppt: files.ppt }, "ppt");

      let bodyTemplate = object({
        description: string().required("please enter valid description"),
        price: number().required("please enter valid price"),
        category: string().required("please enter valid category"),
        name: string().required("please enter valid name"),
      });

      let bodData = bodyTemplate.validate(body);

      Promise.all([
        bodData,
        VideoFile,
        introVideoFile,
        ImageFile,
        PdfFile,
        PptFile,
      ])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          if (
            err?.message ==
            'price must be a `number` type, but the final value was: `NaN` (cast from the value `""`).'
          ) {
            return reject("please enter price");
          }
          return reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkGetSingleCourseParams(id: number) {
  return new Promise((resolve, reject) => {
    let paramsTemplate = number().required("please provide valid course id");
    try {
      paramsTemplate
        .validate(id)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          if (
            err?.message ===
            "this must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`)."
          ) {
            return reject("please provide a valid id");
          }
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkGetCourseByCategoryBody(body: { category: string }) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      category: string().required("please enter valid category"),
    });

    try {
      bodyTemplate
        .validate(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          return reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkUpdateCourseVideoReqBodyAndFile(
  file: any,
  body: { course_id: number }
) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: number().required("please provide valid course id"),
      });

      let videoFile = validateFile(file, "video");
      let bodyData = bodyTemplate.validate(body);

      Promise.all([videoFile, bodyData])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkUpdateCoursePdfReqBodyAndFile(
  files: any,
  body: { course_id: number }
) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: number().required("please provide valid course id"),
      });

      let bodyData = bodyTemplate.validate(body);

      let pdfFile = [];

      if (Array.isArray(files?.pdf)) {
        files.pdf.forEach((file: any) =>
          pdfFile.push(validateFile({ pdf: file }, "pdf"))
        );
      } else {
        pdfFile.push(validateFile(files, "pdf"));
      }

      Promise.all([...pdfFile, bodyData])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}
export function checkUpdateCoursePptReqBodyAndFile(
  file: any,
  body: { course_id: number }
) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: number().required("please provide valid course id"),
      });

      let pptFile = validateFile(file, "ppt");
      let bodyData = bodyTemplate.validate(body);

      Promise.all([pptFile, bodyData])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}
export function checkUpdateCourseIntroVideoReqBodyAndFile(
  file: any,
  body: { course_id: number }
) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: number().required("please provide valid course id"),
      });

      let videoFile = validateFile(file, "intro_video");
      let bodyData = bodyTemplate.validate(body);

      Promise.all([videoFile, bodyData])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkUpdateCourseThumbnailReqBodyAndFile(
  file: any,
  body: { course_id: number }
) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: number().required("please provide valid course id"),
      });

      let imageFile = validateFile(file, "thumbnail");
      let bodyData = bodyTemplate.validate(body);

      Promise.all([imageFile, bodyData])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}

export function checkUpdateCourseDataReqBodyAndFile(body: CourseBodyType) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: string().required("please enter valid course id"),
        description: string().required("please enter valid description"),
        price: string().required("please enter valid price"),
        category: string().required("please enter valid category"),
        name: string().required("please enter valid name"),
      });

      bodyTemplate
        .validate(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}
