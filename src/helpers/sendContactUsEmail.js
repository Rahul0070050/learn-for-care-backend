import { config } from "dotenv";
import {mailer} from '../conf/nodeMailer.js'
import { contactUs } from "../emailTemplates/contactUs.js";
import { downloadFromS3 } from "../AWS/S3.js";

config();

export default function sendConcatUsEmail(from, name, content,sub) {
  return new Promise(async(resolve, reject) => {
    try {
      let image = await downloadFromS3("","/blogs/db3d45bc-f4eb-4e70-a3a8-0f9231c5d16f")
      const mailData = {
        from: {
          name: '',
          address: from
        },
        to: 'support@learnforcare.com',
        subject: sub,
        text: "Learn For Care",
        html: contactUs(name, from, content, image.url),
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
