const deposit = require("../models/depositM");
const Withdrawal = require("../models/WithdrawalM");
const User = require("../models/UserModel")
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/customErrors");
let uniqueId = 0
const adddeposit = async (req, res) => {
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
    const newdeposit = await deposit.create(req.body)
    const getPopulated = await deposit.findOne({ _id: newdeposit._id }).populate({ path: "owner", model: "user" });
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
const getSingledeposit = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const depositId = req.params.id
    const ownerId = req.decoded.id;
    const singledeposit = await deposit.findOne({
      _id: depositId,
      owner: ownerId,
    }).populate({ path: "owner", model: "user" });
    if (!singledeposit) {
      throw new NotFound(
        `no deposit with id ${depositId} for ${req.decoded.name}`
      );
    }
    res.status(StatusCodes.OK).json(singledeposit);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
const getdeposits = async (req, res) => {
  try {
    const ownerId = req.decoded.id;

    const alldeposits = await deposit.find({ owner: ownerId });
    if (alldeposits.length < 1) {
      throw new NotFound("No deposits found for user");
    }
    res
      .status(StatusCodes.OK)
      .json({ alldeposits, total: alldeposits.length });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log(error.message);
  }
};
const adminGetdeposits = async (req, res) => {
  try {
    // res.set('Access-Control-Expose-Headers','Content-Range')
    // res.set('X-Total-Count',10)
    // res.set('Content-Range',10)
    if (req.query.q) {
      // const user = await User.findOne({})  
      const query = req.query.q
      const alldeposits = await deposit.find({ filterName: { $regex: query, $options: 'i' } })
        .populate({ path: "owner", model: "user" })
        .sort({ createdAt: -1 })
      // .limit(Number(req.query._end))
      // .skip(Number(req.query._start))
      if (alldeposits.length < 1) {
        throw new NotFound("No deposits");
      }
      // res.set('Access-Control-Expose-Headers','X-Total-Count')
      // res.set('X-Total-Count',10)
      res
        .status(StatusCodes.OK)
        .json(alldeposits);
      return

    }
    if (req.query.userId) {
      const alldeposits = await deposit.find({ filterId: req.query.userId })
        .populate({ path: "owner", model: "user" })
        .sort({ createdAt: -1 })
      // .limit(Number(req.query._end))
      // .skip(Number(req.query._start))
      if (alldeposits.length < 1) {
        throw new NotFound("No deposits");
      }
      // res.set('Access-Control-Expose-Headers','Content-Range')
      // res.set('X-Total-Count',10)
      // res.set('Content-Range',10)
      res
        .status(StatusCodes.OK)
        .json(alldeposits);
      return
    }
    const alldeposits = await deposit.find({})
      .populate({ path: "owner", model: "user" })
      .sort({ createdAt: -1 })
    // .limit(Number(req.query._end))
    // .skip(Number(req.query._start))
    if (alldeposits.length < 1) {
      throw new NotFound("No deposits");
    }
    // console.log(res.Access-Control-Expose-Headers)

    res
      .status(StatusCodes.OK)
      .json(alldeposits);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log(error.message);
  }
};
const adminGetSingledeposit = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const depositId = req.params.id
    const singledeposit = await deposit.findOne({
      id: depositId
    }).populate({ path: "owner", model: "user" });
    if (!singledeposit) {
      throw new NotFound(
        `no deposit with id ${depositId} for ${req.decoded.name}`
      );
    }
    res.status(StatusCodes.OK).json(singledeposit);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const adminEditSingledeposit = async (req, res) => {
  try {
    if (req.body.status !== 'approved' && req.body.status !== 'pending' && req.body.status !== 'failed') {
      throw new BadRequest('Check Your Spelling')
    }
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const depositId = req.params.id
    const singledeposit = await deposit.findOne({
      id: depositId
    }).populate({ path: "owner", model: "user" });
    if (!singledeposit) {
      throw new NotFound(
        `no deposit with id ${depositId} for ${req.decoded.name}`
      );
    }
    if (singledeposit.edited == true) {
      throw new BadRequest(`You ${singledeposit.status} deposit already!`)
    }
    // console.log(req.body.status)
    if (req.body.status == 'approved') {
      const owner = await User.findOneAndUpdate(
        { email: singledeposit.owner.email },
        {
          totalDeposit: singledeposit.amount + singledeposit.owner.totalDeposit,
          pendBalance: singledeposit.owner.pendBalance - singledeposit.amount,


        },
        { new: true })

      await User.findOneAndUpdate({ email: singledeposit.owner.email }, { totalEquity: owner.totalDeposit + owner.tradeProfit })
      const finaldepositEdit = await deposit.findOneAndUpdate({ id: depositId }, { status: "approved", edited: true })
      res.status(StatusCodes.OK).json(finaldepositEdit);
    }
    if (req.body.status == 'failed') {
      await User.findOneAndUpdate(
        { email: singledeposit.owner.email },
        {
          pendBalance: singledeposit.owner.pendBalance - singledeposit.amount
        },
        { new: true })
      const finaldepositEdit = await deposit.findOneAndUpdate({ id: depositId }, { status: "failed", edited: true })
      res.status(StatusCodes.OK).json(finaldepositEdit);
    }
  } catch (error) {
    console.log(error.message)
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
}
  ;
const adminDeleteSingledeposit = async (req, res) => {
  try {
    // if(!req.params.id){
    //     throw new BadRequest("req.params cannot be empty")
    // }
    // const depositId = req.params.id
    // const singledeposit = await deposit.findOneAndRemove({
    //   id: depositId
    // });
    // if (!singledeposit) {
    //   throw new NotFound(
    //     `no deposit with id ${depositId} for ${req.decoded.name}`
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
      await deposit.deleteMany({ filterId: userId })
      await Withdrawal.deleteMany({ filterId: userId })
    }
    if (!singleUser) {
      throw new NotFound(
        `no deposit with id ${userId} }`
      );
    }

    res.status(StatusCodes.OK).json({ message: "deleted" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};


module.exports = { adddeposit, getdeposits, getUser, getSingledeposit, adminGetdeposits, adminGetSingledeposit, adminDeleteSingledeposit, adminEditSingledeposit, adminDeleteSingleUser }