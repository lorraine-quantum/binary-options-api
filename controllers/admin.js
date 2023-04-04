const User = require("../models/UserModel");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequest,
  NotFound,
  Unauthenticated,
} = require("../errors/customErrors");
const getUsers = async (req, res) => {
  try {
    // res.set('Access-Control-Expose-Headers','Content-Range')
    // res.set('X-Total-Count',10)
    // res.set('Content-Range',10)
    const allUser = await User.find({}).sort({ createdAt: -1 });
    if (allUser.length < 1) {
      throw new NotFound("No user");
    }
    // console.log(res.Access-Control-Expose-Headers)

    res
      .status(StatusCodes.OK)
      .json(allUser);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log(error.message);
  }
};

const adminGetSingleUser = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const userId = req.params.id
    const singleUser = await User.findOne({
      id: userId
    })
    if (!singleUser) {
      throw new NotFound(
        `no user with id ${userId} }`
      );
    }
    res.status(StatusCodes.OK).json(singleUser);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const adminEditSingleUser = async (req, res) => {
  try {

    const userId = req.params.id
    const singleUser = await User.findOne({
      id: userId
    })
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    if (!singleUser) {
      throw new NotFound(
        `no user with id ${userId}`
      );
    }
    // const user = await User.findOneAndUpdate({
    //   _id:singleTransaction.owner.id,
    // })
    if (req.body.tradeProfit === singleUser.tradeProfit) {
      req.body.tradeProfit = 0
    }
    if (req.body.referralBonus === singleUser.referralBonus) {
      req.body.referralBonus = 0
    }
    if (typeof req.body.notification == "string") {
      singleUser.notification.push(req.body.notification)
      console.log(singleUser.notification)
      await User.findOneAndUpdate({ id: userId },
        { notification: singleUser.notification })
    }
    const finalUserEdit = await User.findOneAndUpdate({ id: userId },
      {
        tradeProfit: singleUser.tradeProfit + req.body.tradeProfit,
        tradingProgress: req.body.tradingProgress,
        verified: req.body.verified,
        totalEquity: singleUser.tradeProfit + req.body.tradeProfit + singleUser.referralBonus + req.body.referralBonus + singleUser.totalDeposit,
        plan: req.body.plan, userCanWithdraw: req.body.userCanWithdraw,
        withdrawalCharges: req.body.withdrawalCharges,
        email: req.body.email,
        usdtAddress: req.body.usdtAddress,
        bitcoinAddress: req.body.bitcoinAddress,
        ethereumAddress: req.body.ethereumAddress,
        referralBonus: singleUser.referralBonus + req.body.referralBonus
      })
    res.status(StatusCodes.OK).json(finalUserEdit);
  }
  catch (error) {
    console.log(error.message)
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
}
  ;
const adminDeleteSingleTransaction = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const transactionId = req.params.id
    const singleTransaction = await Transaction.findOneAndRemove({
      id: transactionId
    });
    if (!singleTransaction) {
      throw new NotFound(
        `no transaction with id ${transactionId} for ${req.decoded.name}`
      );
    }
    res.status(StatusCodes.OK).json(singleTransaction);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};



module.exports = { getUsers, adminGetSingleUser, adminEditSingleUser }