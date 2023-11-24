const express = require('express');
const authRouter = require('./auth.router');
const usersRouter = require('./users.router');
const productRouter = require('./products.router');
const usersRouter = require('./users.router');

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productRouter);
<<<<<<< HEAD
=======
apiRouter.use('/users', usersRouter);
>>>>>>> 79f42a225a836eb8a3da74bdbbb2430fb408d3fa

module.exports = apiRouter;
