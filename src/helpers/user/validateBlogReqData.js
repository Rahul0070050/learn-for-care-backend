import {number} from 'yup'
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

    let bodyResult = bodyTemplate.validate(body);
    try {
      Promise.all([bodyResult])
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
