import { mixed, number, object, string } from "yup";
import { CourseBodyType } from "../../type/course";

export function checkAddCourseReqBodyAndFile(body: CourseBodyType, files: any) {
  return new Promise((resolve, reject) => {
    const validFileExtensions = {
      image: ["jpg", "png", "jpeg", "webp"],
      video: ["mp4"],
      pptx: ["pptx"],
      pdf: ["pdf"],
    };

    function isValidFileType(
      fileName: any,
      fileType: "image" | "video" | "pdf" | "pptx"
    ): boolean {
      return (
        validFileExtensions[fileType].indexOf(fileName.split(".").pop() || "") >
        -1
      );
    }

    let bodyTemplate = object({
      name: string().required("please enter name"),
      description: string().required("please enter description"),
      category: string().required("please enter category"),
      price: number().required("please enter price"),
    });

    let fileTemplate = object().shape({
      thumbnail: mixed()
        .required("Not a valid thumbnail image type")
        .test("is-valid-type", "Not a valid image type", (value: any) =>
          isValidFileType(value[0]?.originalname?.toLowerCase() || "", "image")
        ),
      intro_video: mixed()
        .required("Not a valid intro video type")
        .test("is-valid-type", "Not a valid video type", (value: any) =>
          isValidFileType(value[0]?.originalname?.toLowerCase() || "", "video")
        ),
      video: mixed()
        .required("Not a valid video type")
        .test("is-valid-type", "Not a valid video type", (value: any) =>
          isValidFileType(value[0]?.originalname?.toLowerCase() || "", "video")
        ),
      ppt: mixed()
        .required("Not a valid ppt type")
        .test("is-valid-type", "Not a valid ppt type", (value: any) =>
          isValidFileType(value[0]?.originalname?.toLowerCase() || "", "pptx")
        ),
      pdf: mixed()
        .required("Not a valid pdf type")
        .test("is-valid-type", "Not a valid pdf type", (value: any) =>
          isValidFileType(value[0]?.originalname?.toLowerCase() || "", "pdf")
        ),
    });

    try {
      let fileResult = fileTemplate.validate(files);
      let bodyResult = bodyTemplate.validate(body);

      Promise.all([fileResult, bodyResult])
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
    let paramsTemplate = number().required("please provide valid course id")
    try {
      paramsTemplate
        .validate(id)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          if(err?.message === "this must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`).") {
            return reject("please provide a valid id")
          }
          reject(err?.message)
        });
    } catch (error: any) {
      reject(error?.message)
    }
  });
}
