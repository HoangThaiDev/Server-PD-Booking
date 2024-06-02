// Import Modules
const JOI = require("joi");

exports.checkValidateFormCheckout = (valuesFormClient) => {
  const { firstName, lastName, country, address, city, phone, email } =
    valuesFormClient;

  const clientSchema = JOI.object({
    firstName: JOI.string()
      .trim()
      .regex(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.empty": "Firstname is not allowed to be empty!",
        "string.pattern.base": "Firstname must be a text!",
      }),
    lastName: JOI.string()
      .trim()
      .regex(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.empty": "Lastname is not allowed to be empty!",
        "string.pattern.base": "Lastname must be a text!",
      }),
    country: JOI.string()
      .trim()
      .regex(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.empty": "Country is not allowed to be empty!",
        "string.pattern.base": "Country must be a text!",
      }),
    address: JOI.string()
      .trim()
      .regex(/^[a-zA-Z0-9\s]+$/)
      .required()
      .messages({
        "string.empty": "Address is not allowed to be empty!",
      }),
    city: JOI.string()
      .trim()
      .regex(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.empty": "City is not allowed to be empty!",
        "string.pattern.base": "City must be a text!",
      }),
    phone: JOI.string()
      .trim()
      .regex(/^[0-9\s]+$/)
      .min(10)
      .max(10)
      .required()
      .messages({
        "string.empty": "Phone number is not allowed to be empty!",
        "string.pattern.base": "Phone must be a number!",
        "string.min": "Phone number length must be at 10 characters long!",
        "string.max": "Phone number length must be at 10 characters long!",
      }),
    email: JOI.string()
      .trim()
      .email({
        tlds: { allow: ["com", "vn", "net"] },
      })
      .required()
      .messages({
        "string.empty": "Email is not allowed to be empty!",
        "string.email": "Email must be a valid email!",
      }),
  });

  // Dữ liệu form và lấy lỗi nếu có
  const { error } = clientSchema.validate(
    {
      firstName,
      lastName,
      country,
      address,
      city,
      phone,
      email,
    },
    { abortEarly: false } // Tiếp tục kiểm tra lỗi chứ ko có dừng sau khi tìm thấy
  );

  if (error) {
    // Return an array of all error messages
    const errorMessages = error.details.map((detail) => ({
      path: detail.path,
      message: detail.message,
      showError: true,
      type: detail.type,
    }));
    return errorMessages;
  }
  return true;
};
