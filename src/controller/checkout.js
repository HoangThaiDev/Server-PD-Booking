// Import Models
const Checkout = require("../model/checkout");

exports.postAddCheckout = async (req, res) => {
  const { carts, user, totalPriceCarts } = req.body;

  try {
    const findedCheckoutByUserId = await Checkout.findOneAndUpdate(
      {
        "user.userId": user.userId,
      },
      { "cart.totalPriceOfCarts": totalPriceCarts, "cart.items": carts.items }
    );

    if (!findedCheckoutByUserId) {
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

exports.getCheckoutByUserId = async (req, res) => {};
