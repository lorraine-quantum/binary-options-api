const Transaction = require("../models/TransactionM");
const Withdrawal = require("../models/WithdrawalM");
const User = require("../models/UserModel")
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/customErrors");
let uniqueId = 0
const addTransaction = async (req, res) => {
  try {
    if (req.body.amount * 1 !== req.body.amount) {
      throw new BadRequest('Amount has to be a number')
    }
    uniqueId++
    let day = new Date().getDate()
    let month = new Date().getMonth()
    let year = new Date().getFullYear()
    const date = `${day}-${month + 1}-${year}`
    req.body.owner = req.decoded.id;
    req.body.date = date;
    req.body.id = uuidv4();
    //add the amount deposited to the total deposits field in the user schema
    req.body.reference = "#" + req.decoded.name.slice(0, 3) + "/" + uuidv4()
    const user = await User.findOne({ _id: req.decoded.id })
    if (!user) {
      return res.status(StatusCodes.CREATED).json({ message: "user not found" })
    }
    req.body.filterId = user.id
    req.body.filterName = user.name
    await User.findOneAndUpdate({ _id: req.decoded.id }, { pendBalance: user.pendBalance + req.body.amount }, { new: true })
    const newTransaction = await Transaction.create(req.body)
    const getPopulated = await Transaction.findOne({ _id: newTransaction._id }).populate({ path: "owner", model: "user" });
    res.status(StatusCodes.CREATED).json(getPopulated);
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
const getUser = async (req, res) => {
  try {
    const ownerId = req.decoded.id;
    const user = await User.findOne(
      {
        _id: ownerId,
      }
    );
    if (!user) {
      throw new NotFound(
        `user not found`
      );
    }
    return res.status(StatusCodes.OK).json(user);
  }
  catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
};
const getSingleTransaction = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const transactionId = req.params.id
    const ownerId = req.decoded.id;
    const singleTransaction = await Transaction.findOne({
      _id: transactionId,
      owner: ownerId,
    }).populate({ path: "owner", model: "user" });
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
const getTransactions = async (req, res) => {
  try {
    const ownerId = req.decoded.id;

    const allTransactions = await Transaction.find({ owner: ownerId });
    if (allTransactions.length < 1) {
      throw new NotFound("No transactions found for user");
    }
    res
      .status(StatusCodes.OK)
      .json({ allTransactions, total: allTransactions.length });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log(error.message);
  }
};
const adminGetTransactions = async (req, res) => {
  try {
    // res.set('Access-Control-Expose-Headers','Content-Range')
    // res.set('X-Total-Count',10)
    // res.set('Content-Range',10)
    if (req.query.q) {
      // const user = await User.findOne({})  
      const query = req.query.q
      const allTransactions = await Transaction.find({ filterName: { $regex: query, $options: 'i' } })
        .populate({ path: "owner", model: "user" })
        .sort({ createdAt: -1 })
      // .limit(Number(req.query._end))
      // .skip(Number(req.query._start))
      if (allTransactions.length < 1) {
        throw new NotFound("No transactions");
      }
      // res.set('Access-Control-Expose-Headers','X-Total-Count')
      // res.set('X-Total-Count',10)
      res
        .status(StatusCodes.OK)
        .json(allTransactions);
      return

    }
    if (req.query.userId) {
      const allTransactions = await Transaction.find({ filterId: req.query.userId })
        .populate({ path: "owner", model: "user" })
        .sort({ createdAt: -1 })
      // .limit(Number(req.query._end))
      // .skip(Number(req.query._start))
      if (allTransactions.length < 1) {
        throw new NotFound("No transactions");
      }
      // res.set('Access-Control-Expose-Headers','Content-Range')
      // res.set('X-Total-Count',10)
      // res.set('Content-Range',10)
      res
        .status(StatusCodes.OK)
        .json(allTransactions);
      return
    }
    const allTransactions = await Transaction.find({})
      .populate({ path: "owner", model: "user" })
      .sort({ createdAt: -1 })
    // .limit(Number(req.query._end))
    // .skip(Number(req.query._start))
    if (allTransactions.length < 1) {
      throw new NotFound("No transactions");
    }
    // console.log(res.Access-Control-Expose-Headers)

    res
      .status(StatusCodes.OK)
      .json(allTransactions);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log(error.message);
  }
};
const adminGetSingleTransaction = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const transactionId = req.params.id
    const singleTransaction = await Transaction.findOne({
      id: transactionId
    }).populate({ path: "owner", model: "user" });
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

const adminEditSingleTransaction = async (req, res) => {
  try {
    if (req.body.status !== 'approved' && req.body.status !== 'pending' && req.body.status !== 'failed') {
      throw new BadRequest('Check Your Spelling')
    }
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const transactionId = req.params.id
    const singleTransaction = await Transaction.findOne({
      id: transactionId
    }).populate({ path: "owner", model: "user" });
    if (!singleTransaction) {
      throw new NotFound(
        `no transaction with id ${transactionId} for ${req.decoded.name}`
      );
    }
    if (singleTransaction.edited == true) {
      throw new BadRequest(`You ${singleTransaction.status} Transaction already!`)
    }
    // console.log(req.body.status)
    if (req.body.status == 'approved') {
      const owner = await User.findOneAndUpdate(
        { email: singleTransaction.owner.email },
        {
          totalDeposit: singleTransaction.amount + singleTransaction.owner.totalDeposit,
          pendBalance: singleTransaction.owner.pendBalance - singleTransaction.amount,


        },
        { new: true })

      await User.findOneAndUpdate({ email: singleTransaction.owner.email }, { totalEquity: owner.totalDeposit + owner.tradeProfit })
      const finalTransactionEdit = await Transaction.findOneAndUpdate({ id: transactionId }, { status: "approved", edited: true })
      res.status(StatusCodes.OK).json(finalTransactionEdit);
    }
    if (req.body.status == 'failed') {
      await User.findOneAndUpdate(
        { email: singleTransaction.owner.email },
        {
          pendBalance: singleTransaction.owner.pendBalance - singleTransaction.amount
        },
        { new: true })
      const finalTransactionEdit = await Transaction.findOneAndUpdate({ id: transactionId }, { status: "failed", edited: true })
      res.status(StatusCodes.OK).json(finalTransactionEdit);
    }
  } catch (error) {
    console.log(error.message)
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
}
  ;
const adminDeleteSingleTransaction = async (req, res) => {
  try {
    // if(!req.params.id){
    //     throw new BadRequest("req.params cannot be empty")
    // }
    // const transactionId = req.params.id
    // const singleTransaction = await Transaction.findOneAndRemove({
    //   id: transactionId
    // });
    // if (!singleTransaction) {
    //   throw new NotFound(
    //     `no transaction with id ${transactionId} for ${req.decoded.name}`
    //   );
    // }
    res.status(StatusCodes.OK).json({ message: "You cannot Delete Records" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
const adminDeleteSingleUser = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const userId = req.params.id
    const singleUser = await User.findOneAndRemove({
      id: userId
    });
    if (singleUser) {
      await Transaction.deleteMany({ filterId: userId })
      await Withdrawal.deleteMany({ filterId: userId })
    }
    if (!singleUser) {
      throw new NotFound(
        `no transaction with id ${userId} }`
      );
    }

    res.status(StatusCodes.OK).json({ message: "deleted" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};


module.exports = { addTransaction, getTransactions, getUser, getSingleTransaction, adminGetTransactions, adminGetSingleTransaction, adminDeleteSingleTransaction, adminEditSingleTransaction, adminDeleteSingleUser }