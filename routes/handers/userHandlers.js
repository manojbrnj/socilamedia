const {validationResult} = require('express-validator');
const {default: mongoose} = require('mongoose');
const users = require('../../models/users');
const jwt = require('jsonwebtoken');
const userRouter = require('../api/users');

const getUserHandler = async (req, res) => {
  const user = await users.findById(req.user._id).select('-hashedPassword');

  res.json({
    user: user,
    message: 'users list',
  });
};
const createUserHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({errors: errors.array()});
  }
  try {
    const data = await users.findOne({email: req.body.email});
    if (data) {
      return res.status(400).json({errors: [{msg: 'user Found'}]});
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar,
    });
    await user.save();
    var token = jwt.sign(
      {
        user: {
          _id: user._id,
        },
      },
      'secret',
      {expiresIn: 360000},
    );
    res.cookies = token;
    return res.json({
      token: token,
      msg: 'user Created',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server error');
  }
};

module.exports = {
  getUserHandler,
  createUserHandler,
};
