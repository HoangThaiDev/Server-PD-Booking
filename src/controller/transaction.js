// Import Modules
const Transaction = require("../model/transaction");

exports.getTransactionByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactionsByUserId = await Transaction.find({
      "user.userId": userId,
    });

    if (transactionsByUserId.length === 0) {
      res.status(200).json({ message: "Your transaction Empty!" });
      return false;
    }

    res.status(200).json(transactionsByUserId);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Get Transaction Failled!" });
  }
};
