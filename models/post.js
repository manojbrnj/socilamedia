const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    name: {type: String, require: true},
    text: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        text: {
          type: String,
          required: true,
        },
        avatar: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {timestamp: true},
);

module.exports = Post = mongoose.model('posts', postSchema);
