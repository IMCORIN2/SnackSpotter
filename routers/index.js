const express = require('express');
const authRouter = require('./auth.router');
const usersRouter = require('./users.router');
const productRouter = require('./products.router');
const votesRouter = require('./votes.router');
const storesRouter = require('./stores.router');
const storeReviewsRouter = require('./storeReviews.router');
const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/votes', votesRouter);
apiRouter.use('/stores', storesRouter); 
apiRouter.use('/store-reviews', storeReviewsRouter); 
module.exports = apiRouter;
