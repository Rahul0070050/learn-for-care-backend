import { date, number, object, string } from "yup";
import { validateFile } from "../validateFileTypes.js";

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
      department: string().required("please provide department"),
      phone: string().required("please provide phone"),
      contact_no: number().required("please provide contact_no"),
      gender: string().required("please provide gender"),
      date_of_birth: string().required("please provide date_of_birth"),
      next_to_kin: string().required("please provide next_to_kin"),
      payroll_reference_number: number().required(
        "please provide payroll_reference_number"
      ),
      medical_details: string().required("please provide medical_details"),
      national_insurance_number: number().required(
        "please provide national_insurance_number"
      ),
      contract_type: string().required("please provide contract_type"),
      date_of_joining: string().required("please provide date_of_joining"),
      correspondence_address: string().required(
        "please provide correspondence_address"
      ),
      brief_profile: string().required("please provide brief_profile"),
    });

    info.phone = Number(info.phone);

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

  export function validateUpdateAdminQualificationsReqBody(files) {
    return new Promise((resolve, reject) => {
      let doc = validateFile([{ pdf: files.pdf }], "pdf");
      try {
        doc.then((result) => {
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

export function validateSetAdminQualificationsReqBody(body, files) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      university: string().required("please provide University"),
      course_name: string().required("please provide course name"),
      content: string().required("please provide note"),
    });

    let doc = validateFile([{ pdf: files.doc }], "pdf");
    let bodyResponse = dataTemplate.validate(body);
    console.log(body, files);
    try {
      Promise.all([doc, bodyResponse])
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

export function validateSetAdminExperienceReqData(body, files) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      organization: string().required("please provide organization"),
      designation: string().required("please provide designation"),
      no_of_years: string().required("please provide no_of_years"),
      content: string().required("please provide content"),
    });

    let doc = validateFile([{ pdf: files.doc }], "pdf");
    let bodyResponse = dataTemplate.validate(body);
    try {
      Promise.all([doc, bodyResponse])
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

export function checkUpdateQualificationDocReqData(file, data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      id: number().required("please provide id"),
    });

    let doc = validateFile([{ pdf: file.doc }], "pdf");
    let bodyResponse = dataTemplate.validate(data);
    try {
      Promise.all([doc, bodyResponse])
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

export function checkUpdateAdminExperienceDocReqData(file, data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      id: number().required("please provide id"),
    });

    let doc = validateFile([{ pdf: file.doc }], "pdf");
    let bodyResponse = dataTemplate.validate(data);
    try {
      Promise.all([doc, bodyResponse])
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

export function validateUpdateExperienceReqData(data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      doc_id: number().required("please provide id"),
      note: string().required("please provide note"),
      organization: string().required("please provide organization"),
      position: string().required("please provide position"),
      no_of_years: number().required("please provide no_of_years"),
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

export function validateUpdateQualificationReqData(data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      doc_id: number().required("please provide doc id"),
      university: string().required("please provide University"),
      note: string().required("please provide note"),
    });

    try {
      dataTemplate.validate(data)
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

export function validateDeleteExperienceReqData(data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      id: number().required("please provide doc id"),
    });

    try {
      dataTemplate.validate(data)
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

export function validateGetQualificationReqData(data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      id: number().required("please provide doc id"),
    });

    try {
      dataTemplate.validate(data)
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

export function validateDeleteQualificationReqData(data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      id: number().required("please provide doc id"),
    });

    try {
      dataTemplate.validate(data)
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

export function validateAssignBundleReqData(data) {
  return new Promise((resolve, reject) => {
    let dataTemplate = object({
      type: string().required("please provide type of course"),
      count: number().required("please provide count"),
      user_id: number().required("please provide user id"),
      bundle_id: number().required("please provide bundle id"),
    });

    try {
      dataTemplate.validate(data)
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

export function checkSetAdminProfileBannerReqData(file) {
  return new Promise((resolve, reject) => {
    let image = validateFile([{ image: file.image }], "image");
    try {
      image.then((result) => {
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

export function checkSetAdminProfileImageReqData(file) {
  return new Promise((resolve, reject) => {
    let image = validateFile([{ image: file.image }], "image");
    try {
      image.then((result) => {
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