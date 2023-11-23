require("dotenv").config();

const SERVER_PORT = process.env.SERVER_PORT;

const GENDER = {
    MALE: "MALE",
    FEMALE: "FEMALE",
  };
  
  module.exports = {
    SERVER_PORT,
    GENDER
  };