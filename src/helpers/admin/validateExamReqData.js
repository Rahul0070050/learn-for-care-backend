import yup from "yup";

export function checkAddExamReqBody(body) {
  console.log(body);
  return new Promise((resolve, reject) => {
    try {
      let bodyTemplate = yup.object().shape({
        course_id: yup.number().required("invalid course id"),
        questions: yup
          .array()
          .of(
            yup.object().shape({
              question: yup.string().required("please provide question"),
              options: yup
                .array()
                .of(yup.string())
                .required("please provide options"),
              answer: yup.string().required("please provide answer"),
            })
          )
          .required("please provide valid questions"),
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
