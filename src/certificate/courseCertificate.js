import fs from "fs";
import path from "path";
import { __dirname } from "../utils/filePath.js";
import PDFDocument from "pdfkit";

export async function saveCertificate({
  filePath,
  sl,
  userName,
  courseName,
  date,
}) {
  return new Promise((resolve, reject) => {
    try {
      let description = "some text";
      const doc = new PDFDocument({
        size: [612, 860],
      });

      let file_path = path.join(__dirname, "../", `/certificate/${filePath}`);
      let fileStream = fs.createWriteStream(file_path);
      doc.pipe(fileStream);
      doc.image(
        path.join(
          __dirname,
          "../",
          "/certificate/learnforcare-certificate.jpg"
        ),
        0,
        0,
        {
          cover: [doc.page.width, doc.page.height],
        }
      );

      const textWidth = doc.widthOfString(userName);
      const textHeight = doc.heightOfString(userName);
      const centerX = (doc.page.width - textWidth) / 2;
      const centerY = (doc.page.height - textHeight) / 2;
      
      doc.font("Helvetica-Bold");
      doc.fontSize(16);
      doc.fillColor("black");
      doc.text(userName, centerX, centerY - 30);

      doc.end();
      fileStream.on("finish", () => {
        resolve(file_path);
      });
    } catch (error) {
      console.log(error);
      reject(error.message);
    }
  });
}
