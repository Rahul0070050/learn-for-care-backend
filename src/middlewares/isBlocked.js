// export function isUserActive(req, res, next) {
//   const { authorization } = req.headers;
//   const token = authorization?.split(" ")[1] || "";
//   validateIsUserActive(token.id)
//     .then((result) => {
//       next();
//     })
//     .catch((err) => {
//       res.status(401).json({
//         success: false,
//         errors: [
//           {
//             code: 401,
//             message: "please login",
//             error: err,
//           },
//         ],
//         errorType: "server",
//       });
//     });
// }
