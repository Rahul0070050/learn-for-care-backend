import { config } from "dotenv";
import { mailer } from "../conf/nodeMailer.js";
import { otpEMail } from "../emailTemplates/otpVerification.js";
import { downloadFromS3 } from "../AWS/S3.js";
import { MailtrapClient } from "mailtrap";
import { __dirname } from "../utils/filePath.js";
import path from "path";
import { invoiceTemplate } from "../emailTemplates/invoice.js";

config();

// export default function sentOtpEmail(email, otp) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let image = await downloadFromS3(
//         "",
//         "/blogs/e3ad1356-490e-4252-bbb8-2296a59a6db7"
//       );
//       const mailData = {
//         from: {
//           name: "support@learnforcare.co.uk",
//           address: process.env.EMAIL_ID,
//         },
//         to: email,
//         subject: "Learn For Care",
//         text: "here is your otp",
//         html: otpEMail(email, otp, image.url),
//       };

//       mailer().sendMail(mailData, function (err, info) {
//         if (err) {
//           console.log(err);
//           reject(err.message);
//         } else {
//           resolve({ accepted: info.accepted[0] });
//         }
//       });
//     } catch (error) {
//       reject(error?.message);
//     }
//   });
// }

export function sendInvoiceToUserByTrapEmail(email, name, invoice_number, invoice_date, filePath) {
  return new Promise(async (resolve, reject) => {
    try {
      let image = await downloadFromS3(
        "",
        "/blogs/e3ad1356-490e-4252-bbb8-2296a59a6db7"
      );

      let file_path = path.join(
        __dirname,
        "../",
        `/invoice/${filePath}`
      );

      console.log(file_path);
      console.log(filePath);

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
          text: "here is your invoice",
          category: "invoice",
          html: invoiceTemplate(name, invoice_number, invoice_date, image.url),
          attachments: [
            { 
                filename: 'invoice',
                path: file_path
            }
        ]
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
