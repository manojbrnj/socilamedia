const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.send(401).json({
      msg: 'token not found unauthorized user',
    });
  }

  try {
    const decoded = jwt.verify(token, 'secret');
    //  console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log('token wrong');
    return res.status(401).json({
      msg: 'unauthorized user',
    });
  }
};
