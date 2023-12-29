import nodemailer from "nodemailer";

export function mailer() {
  return nodemailer.createTransport({
    // service: "Outlook",
    service: "live.smtp.mailtrap.io",
    secure: false,
    port: 587,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}
