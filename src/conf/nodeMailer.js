import nodemailer from "nodemailer";

export function mailer() {
  console.log(process.env.EMAIL_USER, " ", process.env.EMAIL_PASSWORD);
  return nodemailer.createTransport({
    // service: "Outlook",
    // secure: false,
    service: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}
