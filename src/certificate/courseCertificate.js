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

      let date = new Date().toLocaleDateString().split("/");
      let newdate = date[1] + "/" + date[0] + "/" + date[2];

      const userNameWidth = doc.widthOfString(userName);
      const userNameHeight = doc.heightOfString(userName);
      const centerX = (doc.page.width - userNameWidth) / 2;
      const centerY = (doc.page.height - userNameHeight) / 2;

      doc.font("Helvetica-Bold");
      doc.fontSize(16);
      doc.fillColor("black");
      doc.text(userName, centerX, centerY - 30);

      doc.font("Helvetica");

      doc.text(courseName, 220, 470);
      doc.text(newdate, 220, 510);
      doc.text(sl, 220, 550);
      doc.text("some text for course description".split(1, 60), 220, 600);
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
