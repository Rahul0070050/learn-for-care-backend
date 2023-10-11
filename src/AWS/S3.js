import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { v4 as uuid } from 'uuid';

import { s3 } from "../conf/aws_s3.js";
import { __dirname } from "../utils/filePath.js";

dotenv.config({ path: "../../.env" });
export function uploadFileToS3(dir, file) {
  return new Promise(async (resolve, reject) => {
    try {
      let uploadPath = path.join(__dirname, "../uploads/", file.name);
      file.mv(uploadPath, async function (err) {
        if (err) {
          reject(err?.message);
          return;
        }
        let blob = fs.readFileSync(uploadPath);
        let name = `${dir}/${uuid()}`

        let fileUploading = await s3
          .upload({
            Bucket: process.env.AWS_S3_NAME || "",
            Key: name,
            Body: blob,
            ContentType: file.mimetype,
            ACL: "public-read",
          })
          .promise();
        fs.unlinkSync(uploadPath);

        console.log(fileUploading);
        resolve({ ok: true, file: fileUploading.Location });
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function removeFromS3(key) {
  return new Promise(async (resolve, reject) => {
    try {
      s3.deleteObject({
        Bucket: process.env.AWS_S3_NAME || "",
        Key: `/${key}`,
      })
        .promise()
        .then((res) => {
          console.log(res);
          resolve({});
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function downloadFromS3() {
  const params = {
    Bucket: process.env.AWS_S3_NAME || "",
    Key: "bc11bb1f1035f84f04145a91fc2cb0cb.jpg",
  };
  //   ETag: '"047731a283f1c3104acc165bf12952f5"',
  //   ServerSideEncryption: 'AES256'

  //   ETag: '"5553e8669f0598cb296610627dc846dc"',
  //   ServerSideEncryption: 'AES256'
  return new Promise(async (resolve, reject) => {
    // let fileUploading = s3.getObject({
    //   Bucket: process.env.AWS_S3_NAME || "",
    //   Key: "/blogs/1696662917401bc11bb1f1035f84f04145a91fc2cb0cb.jpg",
    // }).promise();
    // let a =await s3.listObjectsV2({Bucket: process.env.AWS_S3_NAME || ""},).promise()
    // resolve(a)
    //     s3.createBucket(
    //       {
    //         Bucket: process.env.AWS_S3_NAME || "" /* Put your bucket name */,
    //       },
    //       function () {
    //         s3.getObject(params, function (err, data) {
    //           if (err) {
    //             reject(err);
    //           } else {
    //             resolve(data);
    //           }
    //         });
    //       }
    //     );
  });
}
