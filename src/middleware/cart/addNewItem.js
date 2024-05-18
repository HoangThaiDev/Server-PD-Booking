// Import Models
const Cart = require("../../model/cart");

exports.addNewItem = async (valueOfNewItem, user, res) => {
  try {
    const checkUserExistedInCart = await Cart.findOne({
      "user.userId": user.userId,
    });

    checkUserExistedInCart.cart.items.push({
      roomId: valueOfNewItem.roomId,
      name: valueOfNewItem.name,
      photo: valueOfNewItem.photo,
      status: valueOfNewItem.status,
      date: {
        startDate: valueOfNewItem.startDate,
        endDate: valueOfNewItem.endDate,
      },
      rooms: valueOfNewItem.rooms,
      options: {
        adults: valueOfNewItem.options.adults,
        children: valueOfNewItem.options.children,
      },
      services: {
        roomClean: valueOfNewItem.serviceOptions.roomClean,
        daySpa: valueOfNewItem.serviceOptions.daySpa,
        massage: valueOfNewItem.serviceOptions.massage,
      },
      priceRoom: valueOfNewItem.price,
      totalPrice: valueOfNewItem.totalPrice,
    });
    res.status(200).json({ message: "Add to cart success!" });
    return checkUserExistedInCart.save();
  } catch (error) {
    res.status(400).json({ message: "Add to cart failled!" });
  }
};
