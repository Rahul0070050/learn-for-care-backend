import fs from "fs";
import path from "path";
import { __dirname } from "../utils/filePath.js";
import PDFDocument from "pdfkit";

export async function convertHtmlToPdf(file_name) {
  const doc = new PDFDocument();

  let file_path = path.join(__dirname, "../", `/certificate/${file_name}`);
  doc.pipe(fs.createWriteStream(file_path));
  doc.image(path.join(__dirname, "../", "/certificate/sample.jpg"), 50, 50, {
    width: 500,
  });

  doc.font("Helvetica-Bold");

  doc.fontSize(16);
  doc.fillColor("black");
  doc.text("This is my Text", 100, 100);

  doc.end();
  return file_path;
}
