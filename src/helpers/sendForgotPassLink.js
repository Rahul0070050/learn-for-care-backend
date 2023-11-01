import { config } from "dotenv";
import {mailer} from '../conf/nodeMailer.js'
import { otpEMail } from "../emailTemplates/otpVerification.js";
import { changePasswordEmail } from "../emailTemplates/changePassword.js";

config();

export default function sendLinkToChangePasswordEmail(email, url) {
  return new Promise((resolve, reject) => {
    try {
      const mailData = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Learn For Care",
        text: "here is your otp",
        html: changePasswordEmail(email,url),
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
