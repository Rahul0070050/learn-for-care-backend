export type User = {
  name: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  type_of_account: string;
  city: string;
};

export type OtpInfo = {
  otp: number;
  email: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type ResentOtpInfo = {
  email: string;
};
