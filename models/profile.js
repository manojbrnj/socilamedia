const mongoose = require('mongoose');
const crypto = require('crypto');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    company: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      require: true,
    },
    skills: {
      type: [String],
    },
    bio: {
      type: String,
    },
    githubusername: {
      type: String,
    },
    experience: [
      {
        company: {
          type: String,
        },
        location: {
          type: String,
        },
        from: {
          type: Date,
          require: true,
        },
        to: {
          type: Date,
          require: true,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
          // required: true,
        },
        degree: {
          type: String,
          // required: true,
        },
        fieldofstudy: {
          type: String,
          // required: true,
        },
        location: {
          type: String,
        },
        from: {
          type: Date,
          // require: true,
        },
        to: {
          type: Date,
          // require: true,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    social: {
      youtube: {
        type: String,
      },
      twitter: {
        type: String,
      },
      facebook: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      instagram: {
        type: String,
      },
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {timestamp: true},
);

module.exports = Profile = mongoose.model('profiles', profileSchema);
