const express = require("express");
const authRouter = require("./auth.router");

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

module.exports = apiRouter;