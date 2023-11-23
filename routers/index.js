const express = require('express');
const authRouter = require('./auth.router');
const usersRouter = require('./users.router');
const productRouter = require('./products.router');

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productRouter);

module.exports = apiRouter;
