import jwt from "jsonwebtoken";
import { User } from "../type/auth";
import { config } from "dotenv";

config();

export const createTokenForUser = (userData: User) => {
  return new Promise((resolve, reject) => {
    try {
      userData.password = ""
      jwt.sign({ ...userData }, process.env.JWT_KEY_FOR_USER || "", (err, jwtToken) => {
        if (err) return reject(err?.message);
        else return resolve(jwtToken);
      });
    } catch (error:any) {
        reject(error?.message)
    }
  });
};

export const createTokenForAdmin = (userData: User) => {
  return new Promise((resolve, reject) => {
    try {
      userData.password = ""
      jwt.sign({ ...userData }, process.env.JWT_KEY_FOR_ADMIN || "", (err, jwtToken) => {
        if (err) return reject(err?.message);
        else return resolve(jwtToken);
      });
    } catch (error:any) {
        reject(error?.message)
    }
  });
};
