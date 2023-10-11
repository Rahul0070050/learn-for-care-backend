import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const createTokenForUser = (userData) => {
  return new Promise((resolve, reject) => {
    try {
      userData.password = "";
      jwt.sign(
        { ...userData },
        process.env.JWT_RF_KEY_FOR_USER || "",
        { expiresIn: "365d" },
        (err, reFreshToken) => {
          if (err) return reject(err?.message);
          jwt.sign(
            { ...userData },
            process.env.JWT_ACC_KEY_FOR_USER || "",
            { expiresIn: "15d" },
            (err, accessToken) => {
              if (err) return reject(err?.message);
              else return resolve({ reFreshToken, accessToken });
            }
          );
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
};

export const createTokenForAdmin = (userData) => {
  return new Promise((resolve, reject) => {
    try {
      userData.password = "";
      jwt.sign(
        { ...userData },
        process.env.JWT_RF_KEY_FOR_ADMIN || "",
        { expiresIn: "365d" },
        (err, reFreshToken) => {
          if (err) return reject(err?.message);
          jwt.sign(
            { ...userData },
            process.env.JWT_ACC_KEY_FOR_ADMIN || "",
            { expiresIn: "15d" },
            (err, accessToken) => {
              if (err) return reject(err?.message);
              else return resolve({ reFreshToken, accessToken });
            }
          );
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
};

export function validateAdminJwtToken(token) {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_ACC_KEY_FOR_ADMIN || "", (err, result) => {
        if (err) return reject(err?.message);
        else return resolve({});
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function validateUserJwtToken(token) {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_ACC_KEY_FOR_USER || "", (err, result) => {
        if (err) return reject(err?.message);
        else return resolve({});
      });
    } catch (error) {
      reject(error?.message);
    }
  });
}
