const mongoose = require("mongoose");

const connectDB = (url) => {
  if (url.startsWith("mongodb+srv")) {
    console.log("connected to cloud db");
  } else {
    console.log("connected to local database");
  }
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
