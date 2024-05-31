// Import Modules
const {
  checkValidateFormCheckout,
} = require("../middleware/checkout/checkValidate");

// Import Models
const Checkout = require("../model/checkout");
const Cart = require("../model/cart");
const Transaction = require("../model/transaction");
const { default: mongoose } = require("mongoose");

exports.postAddCheckout = async (req, res) => {
  const { carts, user, totalPriceCarts } = req.body;

  try {
    const findedCheckoutByUserId = await Checkout.findOneAndUpdate(
      {
        "user.userId": user.userId,
      },
      { "cart.totalPriceOfCarts": totalPriceCarts, "cart.items": carts.items }
    );

    if (!findedCheckoutByUserId && carts.items.length > 0) {
      const checkout = new Checkout({
        user: {
          userId: user.userId,
          username: user.username,
        },
        cart: {
          items: carts.items,
          totalPriceOfCarts: totalPriceCarts,
        },
      });
      checkout.save();
      res.status(200).json({ message: "Add to checkout Success!" });
      return false;
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Add to checkout failled!" });
  }
};

exports.getCheckoutByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const findedCheckoutByUserId = await Checkout.findOne({
      "user.userId": userId,
    });

    res.status(200).json(findedCheckoutByUserId.cart);
  } catch (error) {
    res.status(400).json({ message: "Not Found Your Checkout!" });
  }
};

exports.postUpdateCheckout = async (req, res) => {
  const { valuesFormClient, user } = req.body;

  const valueUserInValid = checkValidateFormCheckout(valuesFormClient);
  if (valueUserInValid.length > 0) {
    res.status(400).json({
      checkValidateForm: true,
      messages: valueUserInValid,
    });
    return false;
  }

  // Find User have Checkout By Id
  try {
    const findedCheckOutByUserId = await Checkout.findOneAndUpdate(
      {
        "user.userId": new mongoose.Types.ObjectId(user.userId),
      },
      {
        "infoUser.firstName": valuesFormClient.firstName,
        "infoUser.lastName": valuesFormClient.lastName,
        "infoUser.country": valuesFormClient.country,
        "infoUser.streetAddress": valuesFormClient.address,
        "infoUser.city": valuesFormClient.city,
        "infoUser.phoneNumber": valuesFormClient.phone,
        "infoUser.emailContact": valuesFormClient.email,
        "infoUser.noteOrder": valuesFormClient.orderNote,
      },
      { new: true } // This option makes it return the updated document
    );
    if (findedCheckOutByUserId) {
      res.status(200).json({ message: "Updated Your Checkout Success!" });
    }

    // Add To Transactions
    const resultOfTransaction = new Transaction({
      user: {
        userId: findedCheckOutByUserId.user.userId,
        username: findedCheckOutByUserId.user.username,
      },
      infoUser: findedCheckOutByUserId.infoUser,
      cart: {
        items: findedCheckOutByUserId.cart.items,
        totalPriceOfCarts: findedCheckOutByUserId.cart.totalPriceOfCarts,
      },
    });

    const result = await resultOfTransaction.save();

    // Clear Modal Cart and Modal Checkout of User By UserId
    const resultOfCart = await Cart.findOneAndDelete({
      "user.userId": user.userId,
    });
    const resultOfCheckout = await Checkout.findOneAndDelete({
      "user.userId": user.userId,
    });
  } catch (error) {
    res.status(400).json({ message: "Updated Your Checkout Failled!" });
  }
};
