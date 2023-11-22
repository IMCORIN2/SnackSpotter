const express = require('express');
const authRouter = require('./auth.router');
const productRouter = require('./products.router');

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productRouter);

module.exports = apiRouter;
