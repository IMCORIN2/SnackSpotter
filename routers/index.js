const express = require('express');
const authRouter = require('./auth.router');
const productRouter = require('./products.router');
const usersRouter = require('./users.router');

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
