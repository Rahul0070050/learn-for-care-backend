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
  per
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
          "/certificate/certificate.jpg"
        ),
        0,
        0,
        {
          cover: [doc.page.width, doc.page.height],
        }
      );

      let date = new Date().toLocaleDateString().split("/");
      let newDate = date[1] + "/" + date[0] + "/" + date[2];

      const userNameWidth = doc.widthOfString(userName);
      const userNameHeight = doc.heightOfString(userName);
      const centerX = (612 - userNameWidth) / 2;
      const centerY = (860 - userNameHeight) / 2;

      doc.font(path.join(__dirname, "../", "/font/Montserrat/static/Montserrat-Bold.ttf"));
      
      doc.fontSize(20);

      doc.fillColor("#F3A024");
      doc.text(userName, centerX - 20, centerY - 30);
      
      // doc.font("Helvetica");
      
      doc.font(path.join(__dirname, "../", "/font/Montserrat/static/Montserrat-Regular.ttf"));
      
      doc.fillColor("#212A4F");

      doc.fontSize(15);

      doc.text(courseName, 255, 469);

      doc.text(newDate, 255, 512);
  
      doc.text(sl, 255, 555);
  
      doc.text("80%", 255, 598);
  
      doc.text(newDate, 110, 692);

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
