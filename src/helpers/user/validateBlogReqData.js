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
