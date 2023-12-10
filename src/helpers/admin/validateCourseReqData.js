import { number, object, string } from "yup";
import { validateFile } from "../validateFileTypes.js";
import {
  isValidFileExtensions,
  validFileExtension,
} from "../../utils/index.js";

export function checkAddCourseReqBodyAndFile(body, files) {
  return new Promise((resolve, reject) => {
    let resources = files["resource[]"];
    let ppt = files["ppt[]"];
    delete files["resource[]"];
    if (!resources) {
      resources = files.resource;
    }
    if (!resources) {
      resources = files.resource;
    }

    files.resource = resources;
    files.ppt = ppt;
    try {
      let introVideoFile = null;

      let VideoFile = validateFile([{ video: files.video }], "video");

      if (files?.intro_video) {
        introVideoFile = validateFile(
          [{ intro_video: files.intro_video }],
          "intro_video"
        );
      } else {
        introVideoFile = validateFile(
          [{ intro_video: { name: "somevideos.mp4" } }],
          "intro_video"
        );
      }

      let ImageFile = validateFile(
        [{ thumbnail: files.thumbnail }],
        "thumbnail"
      );
      let PdfFile = validateFile([{ resource: files.resource }], "resource");
      let PptFile = validateFile([{ image: files.ppt }], "image"); // change files[0] to files in the frond ent

      let bodyTemplate = object({
        description: string().required("please enter valid description"),
        price: number().required("please enter valid price"),
        category: string().required("please enter valid category"),
        name: string().required("please enter valid name"),
        selling_price: string().required("please provide valid selling_price"),
        RRP: string().required("please provide valid RRP"),
        course_type: string().required("please provide valid course_type"),
        duration: string().required("please provide valid duration"),
        course_level: string().required("please provide valid course_level"),
        certificate: string().required("please provide valid certificate"),
        course_code: string().required("please provide valid course_code"),
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
          let values = {
            ...result[0],
            ...result[1][0],
            ...result[2][0],
            ...result[3][0],
            resource: result[4].map((item) => item.resource),
            image: result[5].map((item) => item.image),
          };
          resolve(values);
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
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkGetSingleCourseParams(id) {
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
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkGetCourseByCategoryBody(body) {
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
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkUpdateCourseVideoReqBodyAndFile(file, body) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: number().required("please provide valid course id"),
      });

      let videoFile = validateFile([file], "video");
      let bodyData = bodyTemplate.validate(body);

      Promise.all([videoFile, bodyData])
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

export function checkUpdateCourseResourceReqBodyAndFile(files, body) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: number().required("please provide valid course id"),
      });

      let bodyData = bodyTemplate.validate(body);

      let resourceFile = [];

      console.log(files);

      if (Array.isArray(files?.resource)) {
        files.resource.forEach((file) =>
          resourceFile.push(validateFile([{ resource: file }], "resource"))
        );
      } else {
        resourceFile.push(validateFile([files], "resource"));
      }

      Promise.all([...resourceFile, bodyData])
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
export function checkUpdateCoursePptReqBodyAndFile(file, body) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: number().required("please provide valid course id"),
      });

      let bodyData = bodyTemplate.validate(body);
      let images = file.image;

      let imageRes = images.find((img) => {
        if (!validFileExtension(img.name, "image")) {
          return true;
        }
      });
      Promise.all([pptFile, bodyData])
        .then((result) => {
          if (imageRes) {
            return reject("files not acceptable");
          } else {
            resolve(result);
          }
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}
export function checkUpdateCourseIntroVideoReqBodyAndFile(file, body) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: number().required("please provide valid course id"),
      });

      let videoFile = validateFile([file], "intro_video");
      let bodyData = bodyTemplate.validate(body);

      Promise.all([videoFile, bodyData])
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

export function checkUpdateCourseThumbnailReqBodyAndFile(file, body) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: number().required("please provide valid course id"),
      });

      let imageFile = validateFile([file], "thumbnail");
      let bodyData = bodyTemplate.validate(body);

      Promise.all([imageFile, bodyData])
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

export function checkUpdateCourseDataReqBodyAndFile(body) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = object({
        course_id: number().required("please enter valid course id"),
        description: string().required("please enter valid description"),
        selling_price: number().required("please enter valid price"),
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
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkDeleteCourseParams(id) {
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
    } catch (error) {
      reject(error?.message);
    }
  });
}
