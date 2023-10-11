import nodemailer from "nodemailer";

export function mailer() {
  return nodemailer.createTransport({
    service: "Outlook",
    secure: false,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}
