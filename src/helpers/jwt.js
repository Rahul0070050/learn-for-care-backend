import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

// ========== user token =========== //

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

export function validateUserJwtToken(token) {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(
        token,
        process.env.JWT_ACC_KEY_FOR_USER || "",
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve({});
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

// ========== user token =========== //

// ========== admin token =========== //

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
      jwt.verify(
        token,
        process.env.JWT_ACC_KEY_FOR_ADMIN || "",
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve({});
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

// ========== sub admin token =========== //

export function createTokenForSubAdmin(userData) {
  return new Promise((resolve, reject) => {
    try {
      userData.password = "";
      jwt.sign(
        { ...userData },
        process.env.JWT_RF_KEY_FOR_SUB_ADMIN || "",
        { expiresIn: "365d" },
        (err, reFreshToken) => {
          if (err) return reject(err?.message);
          jwt.sign(
            { ...userData },
            process.env.JWT_ACC_KEY_FOR_SUB_ADMIN || "",
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
}

export function validateSubAdminJwtToken(token) {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(
        token,
        process.env.JWT_ACC_KEY_FOR_SUB_ADMIN || "",
        (err, result) => {
          if (err) return reject(err?.message);
          else return resolve({});
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

// ========== sub admin token =========== //

// ========== company user token =========== //
export function validateAdminPrivilegeJwtToken(token) {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(
        token,
        process.env.JWT_ACC_KEY_FOR_ADMIN || "",
        (err, result) => {
          if (err) return reject(err?.message);
          if (result?.type_of_account === "admin") {
            return resolve({});
          } else {
            reject("you don't have company privilege");
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkCompanyUserPrivileges(token) {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(
        token,
        process.env.JWT_ACC_KEY_FOR_USER || "",
        (err, result) => {
          if (err) return reject(err?.message);
          if (result?.type_of_account === "company") {
            return resolve({});
          } else {
            reject("you don't have company privilege");
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkManagerUserPrivileges(token) {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(
        token,
        process.env.JWT_ACC_KEY_FOR_USER || "",
        (err, result) => {
          if (err) return reject(err?.message);
          if (result?.type_of_account === "manager") {
            return resolve({});
          } else {
            reject("you don't have manager privilege");
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkCompanyUserOrManagerUserPrivileges(token) {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(
        token,
        process.env.JWT_ACC_KEY_FOR_USER || "",
        (err, result) => {
          if (err) return reject(err?.message);
          if (result?.type_of_account === "manager" || result?.type_of_account === "company") {
            return resolve({});
          } else {
            reject("you don't have manager privilege");
          }
        }
      );
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function createTokenForManager(userData) {
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
}
