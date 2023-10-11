import { config } from "dotenv";
import {mailer} from '../conf/nodeMailer.js'
import { otpEMail } from "../emailTemplates/otpVerification.js";

config();

export default function sentOtpEmail(email, otp) {
  return new Promise((resolve, reject) => {
    try {
      const mailData = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Learn For Care",
        text: "here is your otp",
        html: otpEMail(email,otp),
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
