import fs from "fs";
import path from "path";
import { __dirname } from "../utils/filePath.js";
import PDFDocument from "pdfkit";

export async function saveInvoice(
  file_name,
  sl,
  userName,
  data,
  subTotal,
  tax
) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [612, 860],
      });

      // id: 318,
      // user_id: 17,
      // course_id: 26,
      // product_count: 2,
      // thumbnail: '/course/thumbnail/18b48451-7b33-46d7-9016-88fde43e5e21',
      // name: 'Standard 1 Understand your role',
      // item_type: 'course',
      // amount: 30

      let tableData = data.map((item) => {
        return [
          `LFC${item.id}`,
          item.name.length > 40
            ? `${item.name.slice(0, 40)}...`
            : `${item.name}`,
          parseFloat(item.amount / item.product_count).toFixed(2),
          item.product_count,
          parseFloat(item.amount).toFixed(2),
        ];
      });

      let total = subTotal + tax;

      let file_path = path.join(__dirname, "../", `/invoice/${file_name}`);
      const fileStream = fs.createWriteStream(file_path);
      doc.pipe(fileStream);
      doc.image(
        path.join(__dirname, "../", "/invoice/learnforcare-invoice.jpg"),
        0,
        0,
        {
          cover: [doc.page.width, doc.page.height],
        }
      );

      doc.font("Helvetica");

      // Set the starting position for the table
      let startX = 50;
      let startY = 280;

      setTimeout(() => {
        fs.unlinkSync(file_name);
      }, 20000);
      // Set the width and height for each column
      const columnWidths = [70, 245, 86, 80, 50];
      const rowHeight = 20;

      // Function to draw a table row
      function drawRow(rowData, startX, startY) {
        rowData.forEach((text, index) => {
          doc.text(text, startX, startY, { width: columnWidths[index] });
          startX += columnWidths[index];
        });
      }

      // Function to draw the entire table
      function drawTable() {
        tableData.forEach((row) => {
          drawRow(row, startX, startY);
          startY += rowHeight;
        });
      }

      // Draw the table
      drawTable();

      let date = new Date().toLocaleDateString().split("/");
      let newDate = date[1] + "/" + date[0] + "/" + date[2];

      doc.text(sl, 485, 154);
      doc.text(newDate, 485, 182, { width: 70 });
      doc.text(userName, 135, 702, { width: 160 });

      doc.fontSize(14);
      doc.text(subTotal, 520, 618, { width: 70 });
      doc.text(tax, 520, 646, { width: 70 });

      doc.fontSize(18);
      doc.text(total, 500, 682, { width: 70 });

      doc.end();

      fileStream.on("finish", () => {
        resolve();
        console.log("PDF created");
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
