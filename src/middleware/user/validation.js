// Import Modules
const Joi = require("joi");

exports.checkValidateFormRegister = (
  username,
  email,
  password,
  confirmPassword
) => {
  const userSchema = Joi.object({
    username: Joi.string().alphanum().min(5).max(30).required().messages({
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

exports.checkValideFormLogin = (email, password) => {
  const userSchema = Joi.object({
    email: Joi.string()
      .email({
        tlds: { allow: ["com", "vn", "net"] },
      })
      .required()
      .messages({
        "string.empty": "Email is not allowed to be empty!",
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
