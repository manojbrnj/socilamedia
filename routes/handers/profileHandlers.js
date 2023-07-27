const User = require('../../models/users');
const Profile = require('../../models/profile');
const mongoose = require('mongoose');
const {validationResult} = require('express-validator');

const getProfileHandler = async (req, res) => {
  const {user} = req;
  // console.log(user._id);
  try {
    const profile = await Profile.find({user: user._id}).populate('user', [
      'name',
      'avatar',
    ]);
    if (!profile) {
      return res.status(401).json({
        message: 'no record found',
      });
    }

    return res.status(200).json({
      profile: profile.profile[0],
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
//@method POST profile/create
//@desc create user profile
//@access Private
const createProfileHandler = async (req, res) => {
  const {
    company,
    website,
    location,
    status,
    skills,
    bio,
    githubusername,
    experience,
    education,
    youtube,
    instagram,
    facebook,
    date,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const userData = await User.findOne({_id: req.user._id});
  if (!userData) {
    return res.status(401).json({
      message: 'no user record found',
    });
  }
  const {user} = req;
  //create obj to create profile with user id
  const profileFields = {};
  if (user) profileFields.user = user._id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (bio) profileFields.bio = bio;

  //skills
  if (skills) {
    //split string in to array for socail
    profileFields.skills = skills.split(',').map((skill) => skill.trim());
  }
  // create socila object
  profileFields.social = {};
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;
  if (youtube) profileFields.social.youtube = youtube;

  try {
    // check profile already exist or not
    let profile = await Profile.findOne({user: user._id});

    if (profile) {
      //  console.log(profileFields);
      //find and update $set 3
      profile = await Profile.findOneAndUpdate(
        {user: profile.user},
        {$set: {...profileFields}},
        {new: true},
      );

      // console.log(profile);
      return res.status(200).json({
        profile: profile,
      });
    }

    //else create a new profile new obj and save for record we want to return
    const profileData = new Profile(profileFields);
    await profileData.save();
    // if we have found user send profile object
    return res.status(200).json({
      profile: profileData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

// remove profile an duser
const removeProfileHandler = async (req, res) => {
  const {user} = req;
  //console.log(user._id);
  try {
    const profileData = await Profile.findOneAndRemove({user: user._id});
    const userData = await User.findOneAndRemove({_id: user._id});
    if (!profileData || !userData) {
      return res.status(401).json({
        message: 'no record found',
      });
    }

    return res.status(200).json({
      profile: profileData,
      user: userData,
      message: 'user and profile Removed',
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

/// add experience to profile objects
const experienceProfileHandler = async (req, res) => {
  const expobj = {};
  const {company, location, from, to, current, description} = req.body;
  if (company) expobj.company = company;
  if (location) expobj.location = location;
  if (from) expobj.from = from;
  if (to) expobj.to = to;
  if (current) expobj.current = current;
  if (description) expobj.description = description;
  const {user} = req;
  try {
    const profile = await Profile.findOne({user: user._id});
    if (!profile) {
      return res.status(401).json({
        message: 'no record found',
      });
    }

    profile.experience.unshift(expobj);

    const profileData = await profile.save();

    return res.status(200).json({
      profile: profileData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
// update child  record experince in profile using set $ positional operator  to update an element within an array based on a specified condition
// update the matched experience object within the experience
// 'experience.$.location
/*
Profile.findOneAndUpdate(
  { _id: profileId, experience: { $elemMatch: { _id: experienceId } } },
  { $set: { 'experience.$.company': 'Updated Company', 'experience.$.location': 'Updated Location' } },
  { new: true }
)
*/

const updateexperienceProfileHandler = async (req, res) => {
  const expobj = {};
  const {company, location, from, to, current, description} = req.body;
  if (company) expobj.company = company;
  if (location) expobj.location = location;
  if (from) expobj.from = from;
  if (to) expobj.to = to;
  if (current) expobj.current = current;
  if (description) expobj.description = description;
  const {user} = req;
  try {
    const profile = await Profile.findOne({user: user._id});
    if (!profile) {
      return res.status(401).json({
        errors: [{msg: 'User Not Found'}],
      });
    }
    const profileData = await Profile.findOneAndUpdate(
      {_id: profile._id, 'experience._id': req.body.profileId},
      {$set: {'experience.$': expobj}},
      {new: true},
    );

    return res.status(200).json({
      profile: profileData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

/// remove experince
const removeexperienceProfileHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const {user} = req;
  try {
    const profile = await Profile.findOne({user: user._id});

    if (!profile) {
      return res.status(401).json({
        errors: [{msg: 'User Not Found'}],
      });
    }
    // remove experince in mongodb deep level update
    const profileData = await Profile.findOneAndUpdate(
      {
        user: profile.user,
        'experience._id': new mongoose.Types.ObjectId(`${req.params._id}`),
      },
      {
        $pull: {
          experience: {_id: new mongoose.Types.ObjectId(`${req.params._id}`)},
        },
      },
      {new: true},
    );

    return res.status(200).json({
      profile: profileData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

/// add Education to profile objects
const educationProfileHandler = async (req, res) => {
  const eduobj = {};
  const {school, degree, current, from, to, fieldofstudy, description} =
    req.body;
  if (school) eduobj.school = school;
  if (degree) eduobj.degree = degree;
  if (from) eduobj.from = from;
  if (to) eduobj.to = to;
  if (current) eduobj.current = current;
  if (description) eduobj.description = description;
  if (fieldofstudy) eduobj.fieldofstudy = fieldofstudy;
  const {user} = req;
  try {
    const profile = await Profile.findOne({user: user._id});
    if (!profile) {
      return res.status(401).json({
        message: 'no record found',
      });
    }

    profile.education.unshift(eduobj);

    const profileData = await profile.save();

    return res.status(200).json({
      profile: profileData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

/// remove experince
const removeeducationProfileHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const {user} = req;
  try {
    const profile = await Profile.findOne({user: user._id});

    if (!profile) {
      return res.status(401).json({
        message: 'no record found',
      });
    }
    // remove experince in mongodb deep level update
    const profileData = await Profile.findOneAndUpdate(
      {
        user: profile.user,
        'education._id': new mongoose.Types.ObjectId(`${req.params._id}`),
      },
      {
        $pull: {
          education: {_id: new mongoose.Types.ObjectId(`${req.params._id}`)},
        },
      },
      {new: true},
    );

    return res.status(200).json({
      profile: profileData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

module.exports = {
  getProfileHandler,
  createProfileHandler,
  removeProfileHandler,
  experienceProfileHandler,
  updateexperienceProfileHandler,
  removeexperienceProfileHandler,
  removeeducationProfileHandler,
  educationProfileHandler,
};
