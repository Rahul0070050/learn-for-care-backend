import { config } from "dotenv";
import {mailer} from '../conf/nodeMailer'
import { otpEMail } from "../emailTemplates/otpVerification";

config();

export default function sentOtpEmail(email: string, otp: number) {
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
    } catch (error:any) {
      reject(error?.message);
    }
  });
}
