import { mixed, object } from "yup";
import { isValidFileExtensions } from "../utils/index.js";

export function validateFile(files, key) {
  return new Promise((resolve, reject) => {
    let type = null;
    switch (key) {
      case "video":
        type = "video";
        break;
      case "intro_video":
        type = "video";
        break;
      case "thumbnail":
        type = "image";
        break;
      case "ppt":
        type = "pptx";
        break;
      case "pdf":
        type = "pdf";
        break;
      case "image":
        type = "image";
        break;
    }
    let fileTemplate = object().shape({
      [key]: mixed()
        .required(`Not a valid ${key} type`)
        .test("is-valid-type", `Not a valid ${key} type`, (value) =>
          isValidFileExtensions(value?.name?.toLowerCase() || "", type)
        ),
    });

    try {
      let fileUploads = null;
      if (Array.isArray(files[0][key])) {
        fileUploads = files[0][key].map((file) => fileTemplate.validate({[key]:file}));
      } else {
        fileUploads = files.map((file) => fileTemplate.validate(file));
      }

      Promise.all([...fileUploads])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(new Error(`you provided ${key} is not a valid file`));
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}
