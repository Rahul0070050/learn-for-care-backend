import jwt from "jsonwebtoken";
import { User } from "../type/user";
import { config } from "dotenv";

config();

export const createToken = (userData: User) => {
  return new Promise((resolve, reject) => {
    try {
      userData.password = ""
      jwt.sign({ ...userData }, process.env.JWT_KEY || "", (err, jwtToken) => {
        if (err) return reject(err?.message);
        else return resolve(jwtToken);
      });
    } catch (error:any) {
        reject(error?.message)
    }
  });
};
