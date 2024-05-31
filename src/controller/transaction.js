// Import Modules
const Transaction = require("../model/transaction");

exports.getTransactionByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactionsByUserId = await Transaction.find({
      "user.userId": userId,
    });

    if (transactionsByUserId.length === 0) {
      res.status(200).json([]);
      return false;
    }

    res.status(200).json(transactionsByUserId);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Get Transaction Failled!" });
  }
};

exports.getDetailTransaction = async (req, res) => {
  const transId = req.params.transactionId;

  // Find Transaction By Id
  try {
    const trans = await Transaction.findById(transId);

    if (!trans) {
      res.status(400).json({ message: "No Found Your Transaction!" });
      return false;
    }

    res.status(200).json(trans);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Error Server!" });
  }
};

exports.deleteDetailTransaction = async (req, res) => {
  const transId = req.params.transactionId;

  // Find Transaction By ID
  try {
    const trans = await Transaction.findById(transId);

    // Check Item have status is CheckIn
    const checkTrans = trans.cart.items.some(
      (item) => item.status === "Checkin"
    );

    if (checkTrans) {
      res.status(400).json({
        message: "Delete Transaction Failled! Your cart have Room is Checking!",
      });
      return false;
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(transId);

    if (deletedTransaction) {
      const updatedTransactions = await Transaction.find();
      res.status(200).json({
        transactions: updatedTransactions,
        message: "Delete Transaction Success!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Error Server!" });
  }
};

exports.getDeleteItemTrans = async (req, res) => {
  const itemId = req.params.itemId;
  const transId = req.body.transId;

  try {
    const transaction = await Transaction.findById(transId);

    // Find Transaction by _id (Transaction)
    if (!transaction) {
      return res.status(404).send({ message: "Transaction not found!" });
    }

    const { cart } = transaction;

    // Find index Item by _id (Item)
    const itemIndex = cart.items.findIndex((item) => item._id === itemId);

    if (itemIndex === -1) {
      return res.status(404).send({ message: "Item not found in cart!" });
    }

    const findedItem = cart.items[itemIndex];

    // Check status of item belong 'Booking' or 'Checkout' ==> delete
    if (findedItem.status === "Booking" || findedItem.status === "Checkout") {
      cart.items.splice(itemIndex, 1);

      cart.totalPriceOfCarts = (
        parseInt(cart.totalPriceOfCarts.replace(/\./g, "")) -
        parseInt(findedItem.totalPrice.replace(/\./g, ""))
      )
        .toLocaleString("us-US")
        .replace(/\,/g, ".");
      // Check item in cart gone [] ==> delete Transaction
      if (cart.items.length > 0) {
        await transaction.save();
        return res.status(200).send({
          cart: cart.items,
          totalPriceOfCarts: cart.totalPriceOfCarts,
          message: "Item removed successfully!",
        });
      } else {
        await Transaction.findByIdAndDelete(transId);
        return res.status(200).json({
          cart: [],
          totalPriceOfCarts: "",
          message: "Item removed successfully!",
        });
      }
    } else {
      return res.status(200).send({ message: "Item removed Failled!" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Error Server!" });
  }
};
