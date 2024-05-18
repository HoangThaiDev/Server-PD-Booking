// Import Modules
const {
  checkDateBookingInput,
} = require("../middleware/cart/checkDateBookingInput");
const { checkCartOfUser } = require("../middleware/cart/checkCartOfUser");
const mongoose = require("mongoose");

// Import Models
const Cart = require("../model/cart");

exports.postAddCart = async (req, res) => {
  const { valueFormBooking, user } = req.body;

  const { conventStartDateInput, conventEndDateInput, isCheckDateInputValid } =
    checkDateBookingInput(valueFormBooking.startDate, valueFormBooking.endDate);

  if (!isCheckDateInputValid) {
    return false;
  }

  const checkUserExistedInCart = await checkCartOfUser(
    conventStartDateInput,
    conventEndDateInput,
    user,
    valueFormBooking,
    res
  );

  // Nếu client chưa từng booking thì add mới vào cart
  if (!checkUserExistedInCart) {
    try {
      const cart = new Cart({
        user: {
          userId: new mongoose.Types.ObjectId(user.userId),
          username: user.username,
        },
        cart: {
          items: [
            {
              roomId: valueFormBooking.roomId,
              name: valueFormBooking.name,
              photo: valueFormBooking.photo,
              date: {
                startDate: valueFormBooking.startDate,
                endDate: valueFormBooking.endDate,
              },
              options: valueFormBooking.options,
              rooms: valueFormBooking.rooms,
              priceRoom: valueFormBooking.price,
              totalPrice: valueFormBooking.totalPrice,
              services: valueFormBooking.serviceOptions,
              status: valueFormBooking.status,
            },
          ],
        },
      });
      const response = await cart.save();
      if (response) {
        res.status(200).json({ message: "Add To Cart Success!" });
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }
};

exports.getCarts = async (req, res) => {
  const { user } = req.body;

  try {
    if (!user) {
      res.status(200).json({ items: [] });
      return false;
    }

    const cartUser = await Cart.findOne({
      "user.userId": user.userId,
    });

    res.status(200).json({ items: cartUser.cart.items });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCart = async (req, res) => {
  const { itemId, user } = req.body;
  try {
    const cartOfUser = await Cart.findOne({
      "user.userId": user.userId,
    });
    // Delete Item Of Cart By ID Item
    const filteredItemCartById = cartOfUser.cart.items.filter(
      (item) => item._id.toString() !== itemId
    );

    // Check after time filter ==> Array null then delete Cart
    if (filteredItemCartById.length === 0) {
      await Cart.deleteOne({ "user.userId": user.userId });
      res.status(200).json({ items: [] });
      return false;
    }

    // Updated array item in cartOfUser
    cartOfUser.cart.items = filteredItemCartById;
    res.status(200).json({ items: filteredItemCartById });
    await cartOfUser.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
