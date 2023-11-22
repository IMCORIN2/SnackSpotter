require("dotenv").config();

const SERVER_PORT = process.env.SERVER_PORT;

const GENDER = {
    man: "man",
    women: "women",
  };
  
  module.exports = {
    SERVER_PORT,
    GENDER
  };