require("dotenv").config();
const PASSWORD_HASH_SALT_ROUNDS = Number.parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS,10);

module.exports = PASSWORD_HASH_SALT_ROUNDS