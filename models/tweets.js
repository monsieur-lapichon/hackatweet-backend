const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  message: String,
  trend: [{ type: mongoose.Schema.Types.ObjectId, ref: 'trends' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;