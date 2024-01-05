import { config } from "dotenv";
import { mailer } from "../conf/nodeMailer.js";
import { userCredentials } from "../emailTemplates/userCredentials.js";
import { MailtrapClient } from "mailtrap";
import { downloadFromS3 } from "../AWS/S3.js";

config();

export default function sentEmailToSubUserEmailAndPassword(
  name,
  email,
  password
) {
  return new Promise((resolve, reject) => {
    try {
      const mailData = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Learn For Care",
        text: "here is your otp",
        html: userCredentials(name, email, password),
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

export function sentEmailToSubUserEmailAndPasswordByTrap(
  name,
  email,
  password
) {
  return new Promise(async (resolve, reject) => {
    try {

      let image = await downloadFromS3(
        "",
        "/blogs/db3d45bc-f4eb-4e70-a3a8-0f9231c5d16f"
      );
      let mailTrapClient = new MailtrapClient({
        endpoint: process.env.MAILTRAP_ENDPOINT,
        token: process.env.MAILTRAP_TOKEN,
      });

      const sender = {
        email: process.env.EMAIL_ID,
        name: "support@learnforcare.co.uk",
      };

      const recipients = [
        {
          email: email,
        },
      ];

      mailTrapClient
        .send({
          from: sender,
          to: recipients,
          subject: "Learn For Care",
          text: "here is your otp",
          html: userCredentials(name, email, password, image.url),
        })
        .then((result) => {
          console.log(result);
          resolve(result);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
