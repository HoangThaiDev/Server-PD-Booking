// Import Modules
const Joi = require("joi");

exports.checkValidateFormRegister = (
  username,
  email,
  password,
  confirmPassword
) => {
  const userSchema = Joi.object({
    username: Joi.string()
      .regex(/^[a-zA-Z0-9\s]+$/)
      .min(5)
      .max(30)
      .required()
      .messages({
        "string.empty": "Username is not allowed to be empty!",
        "string.min": "Username length must be at least 5 characters long!",
        "string.max": "Username must not exceed 30 characters!",
      }),
    email: Joi.string()
      .email({
        tlds: { allow: ["com", "vn", "net"] },
      })
      .required()
      .messages({
        "string.empty": "Email is not allowed to be empty!",
        "string.email": "Email must be a valid email!",
      }),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .min(5)
      .required()
      .messages({
        "string.empty": "Password is not allowed to be empty!",
        "string.min": "Password length must be at least 5 characters long!",
        "string.pattern.base": "Password with value [a-z, A-Z, 0-9]",
      }),

    confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
      "any.only": "Password must match!",
    }),
  });

  // Dữ liệu form và lấy lỗi nếu có
  const { error } = userSchema.validate(
    {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
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

exports.checkValidateFormLogin = (email, password) => {
  const userSchema = Joi.object({
    email: Joi.string()
      .email({
        tlds: { allow: ["com", "vn", "net"] },
      })
      .required()
      .messages({
        "string.empty": "Email is not allowed to be empty!",
        "string.email": "Email must be a valid email!",
      }),
    password: Joi.string().alphanum().min(5).required().messages({
      "string.empty": "Password is not allowed to be empty!",
      "string.min": "Password length must be at least 5 characters long!",
      "string.pattern.base": "Password with value [a-z, A-Z, 0-9]",
    }),
  });

  // Dữ liệu form và lấy lỗi nếu có
  const { error } = userSchema.validate(
    {
      email: email,
      password: password,
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

exports.checkValidateFormUpdate = (valueFormUpdateUser) => {
  const userSchema = Joi.object({
    firstname: Joi.string()
      .trim()
      .regex(/^[a-zA-Z0-9\s]+$/)
      .required()
      .messages({
        "string.empty": "Firstname is not allowed to be empty!",
      }),
    lastname: Joi.string()
      .trim()
      .regex(/^[a-zA-Z0-9\s]+$/)
      .required()
      .messages({
        "string.empty": "Lastname is not allowed to be empty!",
      }),
    city: Joi.string()
      .trim()
      .regex(/^[a-zA-Z0-9\s]+$/)
      .required()
      .messages({
        "string.empty": "City is not allowed to be empty!",
      }),
    country: Joi.string()
      .trim()
      .regex(/^[a-zA-Z0-9\s]+$/)
      .required()
      .messages({
        "string.empty": "Country is not allowed to be empty!",
      }),
    address: Joi.string()
      .trim()
      .regex(/^[a-zA-Z0-9\s]+$/)
      .required()
      .messages({
        "string.empty": "Address is not allowed to be empty!",
      }),
    phone: Joi.string()
      .trim()
      .regex(/^[0-9\s]+$/)
      .required()
      .messages({
        "string.empty": "Phone is not allowed to be empty!",
        "string.pattern.base": "Phone must be a number!",
      }),
  });

  // Dữ liệu form và lấy lỗi nếu có
  const { error } = userSchema.validate(
    {
      firstname: valueFormUpdateUser.firstname,
      lastname: valueFormUpdateUser.lastname,
      country: valueFormUpdateUser.country,
      city: valueFormUpdateUser.city,
      address: valueFormUpdateUser.address,
      phone: valueFormUpdateUser.phone,
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

exports.checkValidateFormChangePassword = (valueFormUpdateUser) => {
  const userSchema = Joi.object({
    passwordCurrent: Joi.string()
      .trim()
      .min(5)
      .regex(/^[a-zA-Z0-9\s]+$/)
      .required()
      .messages({
        "string.empty": "Password is not allowed to be empty!",
        "string.min": "Password length must be at least 5 characters long!",
      }),
    newPassword: Joi.string()
      .trim()
      .min(5)
      .regex(/^[a-zA-Z0-9\s]+$/)
      .required()
      .messages({
        "string.empty": "New password is not allowed to be empty!",
        "string.min": "New Password length must be at least 5 characters long!",
      }),
    confirmNewPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Password must match!",
      }),
  });

  // Dữ liệu form và lấy lỗi nếu có
  const { error } = userSchema.validate(
    {
      passwordCurrent: valueFormUpdateUser.passwordCurrent,
      newPassword: valueFormUpdateUser.newPassword,
      confirmNewPassword: valueFormUpdateUser.confirmNewPassword,
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

exports.checkValidateFormForgotPassword = (email) => {
  const userSchema = Joi.object({
    email: Joi.string()
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
  const { error } = userSchema.validate(
    {
      email: email,
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

exports.checkValidateFormCreateNewPassword = (password, confirmPassword) => {
  const userSchema = Joi.object({
    password: Joi.string()
      .trim()
      .min(5)
      .regex(/^[a-zA-Z0-9\s]+$/)
      .required()
      .messages({
        "string.empty": "Password is not allowed to be empty!",
        "string.min": "Password length must be at least 5 characters long!",
      }),
    confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
      "any.only": "Password must match!",
    }),
  });

  // Dữ liệu form và lấy lỗi nếu có
  const { error } = userSchema.validate(
    {
      password: password,
      confirmPassword: confirmPassword,
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
