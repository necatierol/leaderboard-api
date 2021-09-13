import mongoose from 'mongoose';

const User = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  username: {
    type: String
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  age: {
    type: Number
  },
  lastRank: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


User.index({ score: 1 }, { background: true });
User.index({ userId: 1 }, { background: true });

User.pre('save', function(next) {
  this.updatedAt = Date.now();
  return next();
});


export default mongoose.model('User', User);
