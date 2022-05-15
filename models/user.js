const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, required: true },
  expires: { type: Date, default: undefined, expires: '24h' },
});

UserSchema.plugin(passportLocalMongoose, {
  limitAttempts: true,
  interval: 100,
  maxInterval: 300000,
  maxAttempts: 5,
  TooManyAttemptsError:
    'Account locked due to too many failed login attempts. Please reset your password to unlock your account.',
});

module.exports = mongoose.model('User', UserSchema);
