import { config } from "dotenv";
import { mailer } from "../conf/nodeMailer.js";
import { otpEMail } from "../emailTemplates/otpVerification.js";
import { changePasswordEmail } from "../emailTemplates/changePassword.js";
import { downloadFromS3 } from "../AWS/S3.js";
import { MailtrapClient } from "mailtrap";

config();

export default function sendLinkToChangePasswordEmail(email, url) {
  return new Promise(async (resolve, reject) => {
    let image = await downloadFromS3(
      "",
      "/blogs/e3ad1356-490e-4252-bbb8-2296a59a6db7"
    );
    try {
      const mailData = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Learn For Care",
        text: "here is your otp",
        html: changePasswordEmail(email, url, image.url),
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

export function sendLinkToChangePasswordEmailByTrap(email, url) {
  return new Promise(async (resolve, reject) => {
    try {
      let image = await downloadFromS3(
        "",
        "/blogs/e3ad1356-490e-4252-bbb8-2296a59a6db7"
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
          html: changePasswordEmail(email, url, image.url),
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