import { number, object, string } from "yup";


export function validateCreateUserInfo(userData) {
  return new Promise((resolve, reject) => {
    let user = object({
      email: string().required("please provide email address").email(),
      first_name: string().required("please provide first_name"),
      last_name: string().required("please provide last_name"),
      password: string().required("please provide password"),
      phone: string().required("please provide phone"),
      country: string().required("please provide country"),
      city: string().required("please provide city"),
    });

    try {
      user
        .validate(userData)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkValidateOtpReqBody(otpReqInfo) {
  return new Promise((resolve, reject) => {
    let otpInfo = object({
      otp: number().required("please provide otp"),
      email: string().required("please provide email address").email(),
    });

    try {
      otpInfo
        .validate(otpReqInfo)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function checkValidateGetUserByIdReqBody(data) {
  return new Promise((resolve, reject) => {
    let template = object({
      id: number().required("please provide id"),
    });

    try {
      template
        .validate(data)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function validateBlockUserInfo(data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      id: number().required("please provide id"),
    });

    try {
      dataTemplate
        .validate(data)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function validateUnBlockUserInfo(data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      id: number().required("please provide id"),
    });

    try {
      dataTemplate
        .validate(data)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}

export function validateSetAdminInfoReqData(info) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      employee_id: number().required("please provide employee_id"),
      employee_name: string().required("please provide employee_name"),
      designation: string().required("please provide designation"),
      email: string().email().required("please provide email"),
      department: string().required("please provide department"),
      phone: number().required("please provide phone"),
      contact_no: number().required("please provide contact_no"),
      gender: string().required("please provide gender"),
      date_of_birth: string().required("please provide date_of_birth"),
      next_to_kin: string().required("please provide next_to_kin"),
      payroll_reference_number: number().required("please provide payroll_reference_number"),
      medical_details: string().required("please provide medical_details"),
      national_insurance_number: number().required("please provide national_insurance_number"),
      contract_type: string().required("please provide contract_type"),
      date_of_joining: string().required("please provide date_of_joining"),
      correspondence_address: string().required("please provide correspondence_address"),
      brief_profile: string().required("please provide brief_profile"),
    });

    try {
      dataTemplate
        .validate(info)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err?.message);
        });
    } catch (error) {
      reject(error?.message);
    }
  });
}
