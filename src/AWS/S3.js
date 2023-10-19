import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { v4 as uuid } from "uuid";

import { s3 } from "../conf/aws_s3.js";
import { __dirname } from "../utils/filePath.js";

dotenv.config({ path: "../../.env" });

export function uploadFileToS3(dir, file) {
  return new Promise(async (resolve, reject) => {
    try {
      let fileName = file.name.split(" ").join("");

      let uploadPath = path.join(__dirname, "../uploads/", fileName);

      file.mv(uploadPath, async function (err) {
        if (err) {
          reject(err?.message);
          return;
        }
        let blob = fs.readFileSync(uploadPath);
        let name = `${dir}/${uuid()}`;

        let fileUploading = await s3
          .upload({
            Bucket: process.env.AWS_S3_NAME || "",
            Key: name,
            Body: blob,
            ContentType: file.mimetype,
          })
          .promise();
        fs.unlinkSync(uploadPath);

        resolve({
          ok: true,
          file: fileUploading.key,
          name: dir.split("/").pop(),
        });
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
        Key: `${key}`,
      })
        .promise()
        .then((res) => {
          resolve({});
        })
        .catch((err) => {
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function downloadFromS3(id, key) {
  return new Promise(async (resolve, reject) => {
    try {
      let signedUrl = await s3.getSignedUrlPromise("getObject", {
        Bucket: process.env.AWS_S3_NAME || "",
        Key: key,
        Expires: 100 * 60,
      });

      resolve({ id, url: signedUrl });
    } catch (error) {
      reject(error.message);
    }
  });
}
