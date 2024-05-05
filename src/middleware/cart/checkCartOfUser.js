// Import Modules
const moment = require("moment");
const { addNewItem } = require("./addNewItem");
const { checkDateBookingInput } = require("./checkDateBookingInput");
// Import Models
const Cart = require("../../model/cart");

exports.checkCartOfUser = async (
  startDateInput,
  endDateInput,
  user,
  valueFormBooking,
  res
) => {
  let isCheck = false;
  const checkUserExistedInCart = await Cart.findOne({
    "user.username": user,
  });

  if (checkUserExistedInCart) {
    // Kiểm tra roomId đang booking có tồn tại trong cart chưa
    const filteredItemCartExisted = checkUserExistedInCart.cart.items.filter(
      (item) => item.roomId === valueFormBooking.roomId
    );
    if (filteredItemCartExisted.length > 0) {
      // Condition1: Kiểm tra startDate-endDate của user so sánh với dateStart - endDate trong items của cart
      const checkCondition = filteredItemCartExisted.some((item) => {
        const {
          conventStartDateInput: startDateItem,
          conventEndDateInput: endDateItem,
        } = checkDateBookingInput(item.date.startDate, item.date.endDate);

        return (
          (startDateItem.isBefore(endDateInput) ||
            startDateItem.isSame(endDateInput)) &&
          endDateItem.isAfter(startDateInput) &&
          valueFormBooking.rooms.includes(...item.rooms)
        );
      });

      if (checkCondition) {
        res
          .status(404)
          .json({ message: "Your room was booked. Please check your cart!" });
      } else {
        addNewItem(valueFormBooking, user, res);
      }
    }
    isCheck = true;
  }
  return isCheck;
};
