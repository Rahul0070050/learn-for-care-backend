import { config } from "dotenv";
import { mailer } from "../conf/nodeMailer.js";
import { subUserCreated } from "../emailTemplates/subUserAccount.js";

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
        html: subUserCreated(name, email, password),
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
