import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

export let s3 = null;

export function s3Config() {

  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_S3_SECRET_KEY || "",
    region: process.env.AWS_S3_REGION || "",
  });

  s3.headBucket({ Bucket: process.env.AWS_S3_NAME || "" }, (err, data) => {
    if (err) {
      if (err.code === "NotFound") {
        // The bucket doesn't exist, so you can create it.
        s3.createBucket(
          { Bucket: process.env.AWS_S3_NAME || "" },
          (err, success) => {
            if (err) {
              console.log(err);
            }
          }
        );
      } else {
        console.log(err);
      }
    } else {
      // The bucket already exists.
      console.log("Bucket already exists: ", data);
    }
  });
}
