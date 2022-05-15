const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users');
const helpers = require('../utils/helpers');

router.route('/register').get(users.renderRegister).post(catchAsync(users.register));

router.get('/verify/token', catchAsync(users.verifyFromEmail));
console.log('users.verifyFromEmail');

router.route('/resend-token', catchAsync(users.newVerificationToken));

router
  .route('/login')
  .get(users.renderLogin)
  .post(
    catchAsync(helpers.checkIfNotVerified),
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    users.login
  );

router.get('/logout', users.logout);

module.exports = router;
