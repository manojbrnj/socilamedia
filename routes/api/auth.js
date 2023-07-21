const express = require('express');
const {check} = require('express-validator');
const {getAuthHandler, loginUserHandler} = require('../handers/authHandlers');
const authRouter = express.Router();

//@route GET api/users
//@desc test route

authRouter.get(
  '/auth',
  [
    check('email', 'email required ').isEmail().not().isEmpty(),
    check('password', 'password required and length should be 6 or more')
      .not()
      .isEmpty()
      .isLength({min: 6, max: 12}),
  ],
  getAuthHandler,
);

authRouter.post(
  '/login',
  [
    check('email').isEmail().not().isEmpty(),
    check('password').not().isEmpty().isLength({min: 6}),
  ],
  loginUserHandler,
);

module.exports = authRouter;
