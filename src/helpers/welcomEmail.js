import { config } from "dotenv";
import {mailer} from '../conf/nodeMailer.js'
import { downloadFromS3 } from "../AWS/S3.js";

config();

export default function welcomeEmail(email) {
  return new Promise(async(resolve, reject) => {
    try {
      let image = await downloadFromS3("","/blogs/e3ad1356-490e-4252-bbb8-2296a59a6db7")
      const mailData = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Learn For Care",
        text: "here is your otp",
        html: welcomeEmail(image.url),
      };

      mailer().sendMail(mailData, function (err, info) {
        if (err) {
          reject(err.message);
        } else {
          resolve({ accepted: info.accepted[0] });
        }
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
