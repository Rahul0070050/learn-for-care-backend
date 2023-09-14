import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

export function sentEmail(email: string, otp: number) {
  return new Promise((resolve, reject) => {
    console.log(otp);

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailData = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: "learn for dare registration otp",
        text: "here is your otp",
        html: `<h3>OTP: ${otp}<h3/>`,
      };

      transporter.sendMail(mailData, function (err, info) {
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
