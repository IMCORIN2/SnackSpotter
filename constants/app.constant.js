require("dotenv").config();

const SERVER_PORT = process.env.SERVER_PORT;

const GENDER = {
  male: "male",
  female: "female",
  };
  
  module.exports = {
    SERVER_PORT,
    GENDER
  };