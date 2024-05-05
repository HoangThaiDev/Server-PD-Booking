// Import Models
const Cart = require("../../model/cart");

exports.addNewItem = async (valueOfNewItem, user, res) => {
  const checkUserExistedInCart = await Cart.findOne({
    "user.username": user,
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
  res.status(200).json("add to cart success");
  return checkUserExistedInCart.save();
};
