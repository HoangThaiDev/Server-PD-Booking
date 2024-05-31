// Import Modules
const moment = require("moment");

exports.checkDateBookingInput = (startDate, endDate) => {
  let isCheckDateInputValid = true;
  const currentDate = moment().startOf("day"); // Lấy ngày hiện tại của hệ thống
  const conventStartDateInput = moment(startDate, "DD/MM/YYYY").startOf("day");
  const conventEndDateInput = moment(endDate, "DD/MM/YYYY").startOf("day");

  const checkStartDateInputValid =
    conventStartDateInput.isAfter(currentDate, "day") ||
    conventStartDateInput.isSame(currentDate, "day");

  const checkEndDateInputValid = conventEndDateInput.isAfter(
    conventStartDateInput,
    "day"
  );

  // Kiểm tra ngày nhập từ client hợp lệ
  if (!checkStartDateInputValid || !checkEndDateInputValid) {
    isCheckDateInputValid = false;
  }

  return { conventStartDateInput, conventEndDateInput, isCheckDateInputValid };
};
