import { config } from "dotenv";
import {mailer} from '../conf/nodeMailer'

config();

export default function sentOtpEmail(email: string, otp: number) {
  return new Promise((resolve, reject) => {
    console.log(otp);

    try {
      const mailData = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: "learn for dare registration otp",
        text: "here is your otp",
        html: `<h3>OTP: ${otp}<h3/>`,
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
