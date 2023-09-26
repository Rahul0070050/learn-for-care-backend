import bcrypt from "bcrypt";

export const hashPassword = (password: string) => {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) return reject(err.message);
        else return resolve(hash);
      });
    } catch (error: any) {
      reject(error.message);
    }
  });
};

export const validatePassword = (password: string, hashedPassword: string) => {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) return reject(err.message);
        else return resolve(result);
      });
    } catch (error: any) {
      reject(error.message);
    }
  });
};
