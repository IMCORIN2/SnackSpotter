const express = require("express");
const authRouter = require("./auth.router");
const usersRouter = require("./users.router")

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;