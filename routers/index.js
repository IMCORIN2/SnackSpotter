const express = require('express');
const authRouter = require('./auth.router');
const usersRouter = require('./users.router');
const productRouter = require('./products.router');
const votesRouter = require('./votes.router');
const cartRouter = require('./cart.router')

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/votes', votesRouter);
apiRouter.use('/cart',cartRouter)

module.exports = apiRouter;
