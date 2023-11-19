// import htmlToPdf from "html-pdf-node";
// import fs from "fs";
// import path from "path";
// import { __dirname } from "../utils/filePath.js";
// import { certificate } from "../certificateTemplate/templates.js";

// Read HTML Template
// export function makeCertificate(filename) {
//   return new Promise((resolve, reject) => {
//     let uploadPath = path.join(
//       __dirname,
//       "../../",
//       "./certificates/",
//       filename
//     );
//     let options = { format: "A4", path: uploadPath };
//     // Example of options with args //
//     // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

//     let file = { content: certificate() };

//     htmlToPdf.generatePdf(file, options).then((pdfBuffer) => {
//       console.log("PDF Buffer:-", pdfBuffer);
//       //   fs.writeFile("", pdfBuffer, (err) => {
//       //     if (err) {
//       //       reject(err);
//       //     } else {
//       //       resolve();
//       //     }
//       //   });
//     });
//   });
// }
