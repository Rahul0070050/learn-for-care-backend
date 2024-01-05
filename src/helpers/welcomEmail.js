import { config } from "dotenv";
import {mailer} from '../conf/nodeMailer.js'
import { downloadFromS3 } from "../AWS/S3.js";
import { welcomeEmail } from "../emailTemplates/welcome.js";
import { MailtrapClient } from "mailtrap";

config();

export default function sendWelcomeEmail(email) {
  return new Promise(async(resolve, reject) => {
    try {
      let image = await downloadFromS3("","/blogs/db3d45bc-f4eb-4e70-a3a8-0f9231c5d16f")
      const mailData = {
        from: {
          name: 'LearnForCare',
          address: process.env.EMAIL_ID
        },
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

export function sendWelcomeEmailByTrap(email) {
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
          category: "here is your otp",
          html: welcomeEmail(image.url)
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