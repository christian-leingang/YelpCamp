const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
    default: Date.now,
    expires: '60m',
  },
});
module.exports = mongoose.model('Token', TokenSchema);
