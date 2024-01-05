import { config } from "dotenv";
import { mailer } from "../conf/nodeMailer.js";
import { otpEMail } from "../emailTemplates/otpVerification.js";
import { downloadFromS3 } from "../AWS/S3.js";
import { MailtrapClient } from "mailtrap";

config();

export default function sentOtpEmail(email, otp) {
  return new Promise(async (resolve, reject) => {
    try {
      let image = await downloadFromS3(
        "",
        "/blogs/e3ad1356-490e-4252-bbb8-2296a59a6db7"
      );
      const mailData = {
        from: {
          name: "support@learnforcare.co.uk",
          address: process.env.EMAIL_ID,
        },
        to: email,
        subject: "Learn For Care",
        text: "here is your otp",
        html: otpEMail(email, otp, image.url),
      };

      mailer().sendMail(mailData, function (err, info) {
        if (err) {
          console.log(err);
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

export function sendOtpEmailByTrap(email, otp) {
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
          category: "Integration Test",
          html: otpEMail(email, otp, image.url)
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
