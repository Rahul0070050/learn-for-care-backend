import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
export function generateChangePassToken(userData) {
  return new Promise((resolve, reject) => {
    try {
      jwt.sign(
        { ...userData },
        process.env.TOKEN_FOR_NEW_PASSWORD || "",
        { expiresIn: "30m" },
        (err, token) => {
          if (err) return reject(err?.message);
          else return resolve(token);
        }
      );
    } catch (error) {
      reject(error.message);
    }
  });
}

export function validateChangePassToken(token) {
    return new Promise((resolve, reject) => {
      try {
        jwt.verify(token, process.env.TOKEN_FOR_NEW_PASSWORD || "", (err, result) => {
          if (err) return reject(err?.message);
          else return resolve({});
        });
      } catch (error) {
        reject(error?.message);
      }
    });
  }