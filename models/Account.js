const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Account', AccountSchema);