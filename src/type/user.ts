export type User = {
  username: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  type: string;
  city: string;
};

export type OtpInfo = {
  otp: number;
  email: string;
};

export type LoginData = {
  email: string,
  password: string
}