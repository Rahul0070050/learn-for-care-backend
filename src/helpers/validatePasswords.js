import bcrypt from "bcrypt";

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) return reject(err.message);
        else return resolve(hash);
      });
    } catch (error) {
      reject(error.message);
    }
  });
};

export const validatePassword = (password, hashedPassword) => {
  return new Promise(async(resolve, reject) => {
    try {
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error) {
      reject(error.message);
    }
  });
};
