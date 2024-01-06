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

      let date = new Date().toLocaleDateString().split("/").map(d => d.length <= 1 ? "0"+d : d);
      let newDate = date[1] + "/" + date[0] + "/" + date[2];

      const userNameWidth = doc.widthOfString(userName);
      const userNameHeight = doc.heightOfString(userName);
      const centerX = (doc.page.width - (userNameWidth + 10)) / 2;
      const centerY = (doc.page.height - userNameHeight) / 2;

      doc.font("Times-Roman");
      
      doc.fontSize(22);

      doc.fillColor("#F3A024");
      doc.text(userName, centerX, centerY - 30);
      
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
