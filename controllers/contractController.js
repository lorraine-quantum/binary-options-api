const Contracts = require("../models/ContractModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/customErrors");
const { findOne } = require("../models/ContractModel");
const addContract = async (req, res) => {
  try {
    req.body.owner = req.decoded.id;
    const { contract, company } = req.body;
    const newContract = await Contracts.create(req.body);
    res.status(StatusCodes.CREATED).json(newContract);
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.BAD_REQUEST).json(error.message);
  }
};
const getContracts = async (req, res) => {
  try {
    const ownerId = req.decoded.id;

    const allContracts = await Contracts.find({ owner: ownerId });
    if (allContracts.length < 1) {
      throw new NotFound("No contracts found for user");
    }
    res
      .status(StatusCodes.CREATED)
      .json({ allContracts, total: allContracts.length });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    console.log(error.message);
  }
};
const getSingleContract = async (req, res) => {
  try {
    const contractId = req.params.id;
    const ownerId = req.decoded.id;
    const singleContract = await Contracts.findOne({
      _id: contractId,
      owner: ownerId,
    });
    if (!singleContract) {
      throw new NotFound(
        `no contract with id ${contractId} for ${req.decoded.name}`
      );
    }
    res.status(StatusCodes.OK).json(singleContract);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error.message);
  }
};
const editContract = async (req, res) => {
  try {
    const { contract, company, status } = req.body;
    const contractId = req.params.id;
    const ownerId = req.decoded.id;
    if (!contract || !company) {
      throw new BadRequest("contract and company fields cannot be empty");
    }
    const singleContract = await Contracts.findOneAndUpdate(
      {
        _id: contractId,
        owner: ownerId,
      },
      req.body,
      { new: true, runValidators: true }
    );
    if (!singleContract) {
      throw new NotFound(
        `no contract with id ${contractId} for ${req.decoded.name}`
      );
    }
    res.status(StatusCodes.OK).json(singleContract);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error.message);
  }
};
const deleteContract = async (req, res) => {
  try {
    const contractId = req.params.id;
    const ownerId = req.decoded.id;
    const singleContract = await Contracts.findOneAndDelete({
      _id: contractId,
      owner: ownerId,
    });
    if (!singleContract) {
      throw new NotFound(
        `no contract with id ${contractId} for ${req.decoded.name}`
      );
    }
    res.status(StatusCodes.OK).json(singleContract);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error.message);
  }
};
const deleteAllContracts = (req, res) => {
  res.send("delete all");
};

module.exports = {
  getContracts,
  getSingleContract,
  editContract,
  deleteAllContracts,
  deleteContract,
  addContract,
};
