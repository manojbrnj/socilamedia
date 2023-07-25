const User = require('../../models/users');
const Post = require('../../models/post');
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const getPostHandler = async (req, res) => {
  const {user} = req;
  try {
    const post = await Post.find({user: user._id}).populate('user', [
      'name',
      'avatar',
    ]);
    if (!post) {
      return res.status(204).json({
        message: 'no record found',
      });
    }

    return res.status(200).json({
      post: post,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

//@method POST post/create
//@desc create user post
//@access Private
const addPostHandler = async (req, res) => {
  const {name, text, avatar, likes, comments, date} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const userData = await User.findOne({_id: req.user._id});
  if (!userData) {
    return res.status(401).json({
      errors: [{msg: 'User Not Found'}],
    });
  }
  const {user} = req;
  //create obj to create post with user id
  const postFields = {};
  if (user) postFields.user = user._id;
  if (text) postFields.text = text;
  if (name) postFields.name = name;
  postFields.avatar = userData.avatar;
  if (date) postFields.date = date;

  try {
    const post = await Post.create(postFields);
    //console.log(post);
    return res.status(200).json({
      post: post,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
// remove post an duser
const removePostHandler = async (req, res) => {
  const {user} = req;
  if (!user) {
    return res.status(401).json({
      message: 'no user record found',
    });
  }
  try {
    const postData = await Post.findOneAndRemove({
      _id: new mongoose.Types.ObjectId(`${req.params._id}`),
    });

    if (!postData) {
      return res.status(401).json({
        message: 'no record found',
      });
    }

    return res.status(200).json({
      post: postData,
      message: ' post Removed',
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

/// remove experince
const removelikesPostHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const {user} = req;
  try {
    const post = await Post.findOne({_id: req.params._id});

    if (!post) {
      return res.status(401).json({
        message: 'no record found',
      });
    }
    // remove experince in mongodb deep level update
    const postData = await Post.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(`${req.params._id}`),
      },
      {
        $pull: {
          likes: {user: new mongoose.Types.ObjectId(`${user._id}`)},
        },
      },
      {new: true},
    );

    return res.status(200).json({
      posts: postData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

/// add Education to profile objects
const likePostHandler = async (req, res) => {
  const {user} = req;
  let postData = [];
  try {
    const post = await Post.findOne({_id: req.params._id});
    if (!post) {
      return res.status(401).json({
        message: 'no record found',
      });
    }
    if (post.likes.length > 0) {
      // remove experince in mongodb deep level update
      postData = await Post.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(`${req.params._id}`),
        },
        {
          $pull: {
            likes: {user: new mongoose.Types.ObjectId(`${user._id}`)},
          },
        },
        {new: true},
      );
      return res.status(200).json({
        post: postData,
      });
    }
    postData = await Post.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(`${req.params._id}`),
      },
      {
        $push: {
          likes: {user: new mongoose.Types.ObjectId(`${user._id}`)},
        },
      },
      {new: true},
    );

    return res.status(200).json({
      post: postData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

/// add comment to post objects
const commentPostHandler = async (req, res) => {
  const {user} = req;
  const cmntobj = {};
  const {text} = req.body;
  let postData = [];

  try {
    const userdata = await User.findOne({_id: user._id});
    const post = Post.findOne({_id: req.params._id});
    if (!post) {
      return res.status(401).json({
        message: 'no record found',
      });
    }
    if (!userdata) {
      return res.status(401).json({
        message: 'user not found',
      });
    }
    if (user) cmntobj.user = user;
    cmntobj.avatar = userdata.avatar;
    if (text) cmntobj.text = text;
    postData = await Post.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(`${req.params._id}`),
      },
      {
        $push: {
          comments: cmntobj,
        },
      },
      {new: true},
    );

    return res.status(200).json({
      postData: postData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
//remove comment

/// remove comment to post objects
const removecommentPostHandler = async (req, res) => {
  const {user} = req;

  let postData = [];

  try {
    const userdata = await User.findOne({_id: user._id});
    const post = Post.findOne({_id: req.params._id});
    if (!post) {
      return res.status(401).json({
        message: 'no record found',
      });
    }
    if (!userdata) {
      return res.status(401).json({
        message: 'user not found',
      });
    }

    postData = await Post.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(`${req.params._id}`),
      },
      {
        $pull: {
          comments: {
            _id: new mongoose.Types.ObjectId(`${req.params.comment_id}`),
          },
        },
      },
      {new: true},
    );

    return res.status(200).json({
      postData: postData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

module.exports = {
  getPostHandler,
  addPostHandler,
  removePostHandler,
  likePostHandler,
  removelikesPostHandler,
  commentPostHandler,
  removecommentPostHandler,
};
