import otp from "otp-generator";

export function generatorOtp() {
  return otp.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    upperCaseAlphabets: false,
  });
}
