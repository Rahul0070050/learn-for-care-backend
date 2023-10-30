import yup from "yup";

export function checkGetExamReqBody(body) {
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = yup.object().shape({
        course_id: yup.number().required("invalid course id")
      });

      let bodyData = bodyTemplate.validate(body);

      bodyData
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
