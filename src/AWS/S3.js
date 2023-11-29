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
      let fileName = uuid() + file.name.split(" ").join("");

      let uploadPath = path.join(__dirname, "../../uploads/", fileName);
      file.mv(uploadPath, async function (err) {
        if (err) {
          reject(err?.message);
          return;
        }

        let blob = fs.readFileSync(uploadPath);
        let name = `${dir}/${uuid()}`;
        let type = file.mimetype;

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
          file: fileUploading.Key,
          name: dir.split("/").pop(),
          type,
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function uploadPdfToS3(uploadPath) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(uploadPath);
      setTimeout(async () => {
        let file_path = path.join(
          __dirname,
          "../",
          `/certificate/${uploadPath}`
        );
        console.log(file_path);
        let blob = await fs.readFileSync(file_path);
        let name = `certificate/${uploadPath}`;
        let type = "application/pdf";

        let fileUploading = await s3
          .upload({
            Bucket: process.env.AWS_S3_NAME || "",
            Key: name,
            Body: blob,
            ContentType: "application/pdf",
          })
          .promise();
        fs.unlinkSync(file_path);

        resolve({
          ok: true,
          file: fileUploading.Key,
          type,
        });
      }, 4000);
    } catch (error) {
      console.log(error);
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
          if (
            err?.message ===
            `Expected uri parameter to have length >= 1, but found "" for params.Key`
          ) {
            resolve({});
          }
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
      console.log(error);
      if (
        error.message ===
        `Expected uri parameter to have length >= 1, but found "" for params.Key`
      ) {
        resolve({ id, url: "" });
      } else {
        reject(error?.message);
      }
    }
  });
}


export function downloadFile(key = "") {
  return new Promise(async (resolve, reject) => {
    try {
      let signedUrl = await s3.getSignedUrlPromise("getObject", {
        Bucket: process.env.AWS_S3_NAME || "",
        Key: key,
        Expires: 100 * 60,
      });

      resolve({ id, url: signedUrl });
    } catch (error) {
      console.log(error);
      if (
        error.message ===
        `Expected uri parameter to have length >= 1, but found "" for params.Key`
      ) {
        resolve({ id, url: "" });
      } else {
        reject(error?.message);
      }
    }
  });
}