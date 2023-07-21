const express = require('express');
const {check} = require('express-validator');
const auth = require('../../middleware/auth');
const {
  getPostHandler,
  addPostHandler,
  removePostHandler,
  likePostHandler,
  removelikesPostHandler,
  commentPostHandler,
  removecommentPostHandler,
} = require('../handers/postHandlers');
const postRouter = express.Router();

//@route GET api/posts
//@desc test route

postRouter.get('/posts', auth, getPostHandler);
postRouter.post('/posts/likes/:_id', auth, likePostHandler);
postRouter.post('/posts/comments/:_id', auth, commentPostHandler);
postRouter.delete('/posts/delete/:_id', auth, removePostHandler);
postRouter.delete(
  '/posts/comments/delete/:_id/:comment_id',
  auth,
  removecommentPostHandler,
);
postRouter.delete('/posts/likes/delete/:_id', auth, removelikesPostHandler);
postRouter.post(
  '/posts/add',
  auth,
  [
    check('name').not().isEmpty().withMessage('user name is required'),
    check('text').not().isEmpty().withMessage('user name is required'),
  ],
  addPostHandler,
);

module.exports = postRouter;
