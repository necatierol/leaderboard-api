import mongoose from 'mongoose';


const Schedules = new mongoose.Schema({
  prize: {
    type: Date,
    required: true,
    default: Date.now
  },
  rank: {
    type: Date,
    required: true,
    default: Date.now
  }
});


export default mongoose.model('Schedules', Schedules);
