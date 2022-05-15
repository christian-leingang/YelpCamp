const crypto = require('crypto');
const Email = require('../utils/emailHelper');
const helpers = require('../utils/helpers');

const Token = require('../models/token');
const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, isVerified: false, expires: Date.now() });
    const registeredUser = await User.register(user, password);
    const userToken = new Token({ _userId: registeredUser._id, token: crypto.randomBytes(16).toString('hex') });
    await userToken.save();
    const url = helpers.setUrl(req, 'verify', `token?token=${userToken.token}`);
    await new Email(user, url).sendWelcome('YelpCamp');
    req.flash(
      'success',
      'Thanks for registering, Please check your email to verify your account. Link expires in 10 minutes'
    );
    return res.redirect('/campgrounds');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
};

module.exports.verifyFromEmail = async (req, res, next) => {
  const token = await Token.findOne({ token: req.query.token });
  if (!token) {
    req.flash('error', 'Token is invalid');
    return res.redirect('/campgrounds');
  }
  const user = await User.findOne({ id: token._userId });
  user.isVerified = true;
  user.expires = undefined;
  await user.save();
  await token.remove();
  await req.login(user, (err) => {
    req.flash('success', `Welcome to YelpCamp ${user.username}!`);
    const redirectUrl = req.session.redirectTo || '/campgrounds';
    delete req.session.redirectTo;
    return res.redirect(redirectUrl);
  });
};

// Request New Token
module.exports.newVerificationToken = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'This account does not exist');
    return res.redirect('/register');
  }
  if (user && user.isVerified) {
    req.flash('error', 'You have already verified your account. Please log in.');
    return res.redirect('/login');
  }
  const userToken = new Token({
    _userId: user._id,
    token: crypto.randomBytes(16).toString('hex'),
  });
  await userToken.save();
  const url = helpers.setUrl(req, 'verify', `token?token=${userToken.token}`);
  await new Email(user, url).sendWelcome('Yelpcamp - New Token');
  req.flash('success', 'Please check your email to verify your account. Link expires in 10 minutes');
  return res.redirect('/campgrounds');
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Logged out!');
  res.redirect('/campgrounds');
};
