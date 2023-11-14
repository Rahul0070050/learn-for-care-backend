import { number, object, string } from "yup";

export function checkGetInvoiceByIdReqBody(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      id: number().required("please provide invoice id"),
    });
    try {
      bodyTemplate
        .validate(body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}