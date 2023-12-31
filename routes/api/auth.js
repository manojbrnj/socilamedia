const express = require('express');
const {check} = require('express-validator');
const auth = require('../../middleware/auth');
const {getAuthHandler, loginUserHandler} = require('../handers/authHandlers');
const authRouter = express.Router();

//@route GET api/users
//@desc test route

authRouter.get('/auth', auth, getAuthHandler);

authRouter.post(
  '/login',
  [
    check('email').isEmail().not().isEmpty(),
    check('password').not().isEmpty().isLength({min: 6}),
  ],
  loginUserHandler,
);

module.exports = authRouter;
