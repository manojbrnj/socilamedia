const express = require('express');
const {
  getProfileHandler,
  createProfileHandler,
  removeProfileHandler,
  experienceProfileHandler,
  updateexperienceProfileHandler,
  removeexperienceProfileHandler,
  removeeducationProfileHandler,
  educationProfileHandler,
} = require('../handers/profileHandlers');
const profileRouter = express.Router();
const auth = require('../../middleware/auth');
const {check, param} = require('express-validator');

//@route GET api/profiles
//@desc test route
//@acess private

profileRouter.get('/profile/me', auth, getProfileHandler);
profileRouter.delete('/profile/me', auth, removeProfileHandler);
profileRouter.post('/profile/exp', auth, experienceProfileHandler);
profileRouter.put('/profile/update/exp', auth, updateexperienceProfileHandler);
profileRouter.delete(
  '/profile/delete/exp/:_id',
  [param('_id').isMongoId().withMessage('Invalid profile ID')],
  auth,

  removeexperienceProfileHandler,
);
profileRouter.post(
  '/profile',
  [
    auth,
    [
      check('status', 'status required').not().isEmpty(),
      check('skills', 'skills required').not().isEmpty(),
    ],
  ],
  createProfileHandler,
);

profileRouter.delete(
  '/profile/delete/edu/:_id',
  [param('_id').isMongoId().withMessage('Invalid profile ID')],
  auth,

  removeeducationProfileHandler,
);
profileRouter.post('/profile/edu', auth, educationProfileHandler);

module.exports = profileRouter;
