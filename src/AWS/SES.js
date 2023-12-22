// import { ses } from "../conf/aws_s3.js";

// // Create sendEmail params
// var params = {
//   Destination: {
//     ToAddresses: ["amaltk5000@gmail.com"],
//   },
//   Message: {
//     Body: {
//       Text: { Data: "Hello, AWS SES!" },
//     },
//     Subject: { Data: "Test email" },
//   },
//   Source: "support.testkiran.online",
// };

// // Create the promise and SES service object
// var sendPromise = ses.sendEmail(params).promise();

// // Handle promise's fulfilled/rejected states
// sendPromise.then(function (data) {
//     console.log(data.MessageId);
//   })
//   .catch(function (err) {
//     console.error(err, err.stack);
//   });
