const users = require('../../models/users');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

const getAuthHandler = async (req, res) => {
  try {
    const user = await users.findById(req.user._id).select('-hashedPassword');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  res.json({
    message: 'auth list',
  });
};

const loginUserHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send({errors: errors.array()});
  }
  try {
    const user = await users.findOne({email: req.body.email});
    if (!user) {
      return res.json({msg: 'user not Found'});
    }
    const pass =
      user.encryptPassword(req.body.password) === user.hashedPassword;
    if (pass) {
      var token = jwt.sign(
        {
          user: {
            _id: user._id,
          },
        },
        'secret',
        {expiresIn: 360000},
      );
    } else {
      return res.status(401).json({
        msg: 'Please check userName and password',
      });
    }
    res.cookies = token;
    res.json({
      token: token,
      msg: 'user logged in',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAuthHandler,
  loginUserHandler,
};
