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
  money: {
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
  }
  
}, { timestamps: true });


User.index({ score: 1 }, { background: true });
User.index({ userId: 1 }, { background: true });


export default mongoose.model('User', User);
