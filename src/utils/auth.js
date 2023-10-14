import { decode } from "jsonwebtoken";
import otp from "otp-generator";

export function generatorOtp() {
  return otp.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    upperCaseAlphabets: false,
  });
}

export function getUser({headers}) {
  const { authorization } = headers;
  const token = authorization?.split(" ")[1] || "";
  let user = decode(token)
  return user
}