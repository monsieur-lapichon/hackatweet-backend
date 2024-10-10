const mongoose = require('mongoose');

const trendSchema = mongoose.Schema({
  name: String,
});

const Trend = mongoose.model('trends', trendSchema);

module.exports = Trend;