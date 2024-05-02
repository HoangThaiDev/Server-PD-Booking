const Cart = require("../model/cart");

exports.postAddCart = async (req, res) => {
  const { valueFormBooking } = req.body;
  const userNameClient = "bloodwind2";

  const checkUserExistedInCart = await Cart.findOne({
    "user.username": userNameClient,
  });
  console.log(checkUserExistedInCart);

  // Check in collection Cart, user have cart ?
  if (!checkUserExistedInCart) {
    try {
      const cart = new Cart({
        user: {
          userId: "6630ee9caf7ae4f3d4e3da33",
          username: "bloodwind",
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
  // try {
  //   const carts = await Cart.find();
  //   if (carts.length === 0) {
  //     res.status(200).json([]);
  //   }
  //   res.status(200).json(carts);
  // } catch (error) {
  //   console.log(error);
  // }
};

exports.deleteCart = async (req, res) => {
  const { id } = req.body;
  // try {
  //   const response = await Cart.findByIdAndDelete(id);
  //   if (!response) {
  //     res.status(404).json({ error: "No Found Cart To Delete" });
  //   }

  //   const carts = await Cart.find();
  //   res.status(200).json(carts);
  // } catch (error) {
  //   console.log(error);
  // }
};
