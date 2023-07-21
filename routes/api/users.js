const express = require('express');
const {getUserHandler, createUserHandler} = require('../handers/userHandlers');
const userRouter = express.Router();
const {check} = require('express-validator');
const auth = require('../../middleware/auth');
const request = require('request');
//@route GET api/users
//@desc test route
userRouter.get('/users', auth, getUserHandler);
userRouter.post(
  '/users',
  [
    check('name').not().isEmpty(),
    check('email').isEmail(),
    check('password').not().isEmpty(),
  ],
  createUserHandler,
);
userRouter.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.Client_ID}&client_secret=${process.env.Client_Secret}`,
      method: 'GET',
      headers: {'user-agent': 'node.js'},
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
        if (res.statusCode !== 200) {
          res.status(404).json({
            msg: 'no Github Profile Found',
          });
        }
      }

      return res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
module.exports = userRouter;
