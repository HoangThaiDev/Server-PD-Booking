// Import Modules
const {
  checkDateBookingInput,
} = require("../middleware/cart/checkDateBookingInput");
const { checkCartOfUser } = require("../middleware/cart/checkCartOfUser");

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
          // userId: "6630ee9caf7ae4f3d4e3da33",
          username: user,
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
        res.status(200).json("Add To Cart Success!");
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }
};

exports.getCarts = async (req, res) => {
  const { user, isLoggedIn } = req.body;

  try {
    if (!isLoggedIn) {
      res.status(404).json({ message: "You need log in to get cart!" });
      return false;
    }
    const cartUser = await Cart.findOne({ "user.username": user });

    if (!cartUser) {
      res.status(200).json({ user: user, items: [] });
    }
    res
      .status(200)
      .json({ user: cartUser.user.username, items: cartUser.cart.items });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCart = async (req, res) => {
  const { id, user } = req.body;
  try {
    const cartOfUser = await Cart.findOne({ "user.username": user });
    // Delete Item Of Cart By ID Item
    const filteredItemCartById = cartOfUser.cart.items.filter(
      (item) => item._id.toString() !== id
    );

    // Check after time filter ==> Array null then delete Cart
    if (filteredItemCartById.length === 0) {
      await Cart.deleteOne({ "user.username": user });
      res.status(200).json([]);
      return false;
    }

    // Updated array item in cartOfUser
    cartOfUser.cart.items = filteredItemCartById;
    res.status(200).json(filteredItemCartById);

    await cartOfUser.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
