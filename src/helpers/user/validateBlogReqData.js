import {number, object} from 'yup'
export function checkGetBlogByIdReqDate(id) {
  return new Promise((resolve, reject) => {
    try {
      let blog_id = number().required("please provide valid blog id");

      blog_id
        .validate(id)
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

export function checkUpdateBlogViewCountReqBody(body) {
  return new Promise((resolve, reject) => {
    let bodyTemplate = object({
      blog_id: number().required("please provide valid blog id"),
    });

    try {
      bodyTemplate.validate(body).then((result) => {
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
