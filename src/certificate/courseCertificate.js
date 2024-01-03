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
      const centerX = (doc.page.width - userNameWidth) / 2;
      const centerY = (doc.page.height - userNameHeight) / 2;

      doc.font(path.join(__dirname, "../", "/font/Montserrat/Montserrat-VariableFont_wght.ttf"));
      
      doc.fontSize(20);

      doc.fillColor("#F3A024");
      doc.text(userName, centerX, centerY - 30);
      
      doc.fillColor("#000");
      // doc.font("Helvetica");

      doc.fontSize(16);

      doc.text(courseName, 230, 451);

      doc.text(newDate, 230, 492);
  
      doc.text(sl, 230, 535);
  
      doc.text(per+"%", 230, 579);
  
      doc.text("some text for course description".split(1, 60), 230, 622);

      doc.text(newDate, 100, 690);

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
