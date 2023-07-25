const users = require('../../models/users');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

const getAuthHandler = async (req, res) => {
  try {
    const user = await users
      .findById({_id: req.user._id})
      .select('-hashedPassword');
    console.log(JSON.stringify(user));
    return res.status(200).json({
      user,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
};

const loginUserHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({errors: errors.array()});
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
    return res.json({
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
