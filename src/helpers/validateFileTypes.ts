import { mixed, object } from "yup";
import { isValidFileExtensions } from "../utils";

export function validateFile(file: any, key: string) {
  return new Promise((resolve, reject) => {
    let type: "image" | "video" | "pdf" | "pptx";
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
        .test("is-valid-type", `Not a valid ${key} type`, (value: any) =>
          isValidFileExtensions(value?.name?.toLowerCase() || "", type)
        ),
    });

    try {
      fileTemplate
        .validate(file)
        .then((result) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(new Error(`you provided ${key} is not a valid file`));
        });
    } catch (error: any) {
      reject(error?.message);
    }
  });
}
