import mongoose from 'mongoose';


const PrizePool = new mongoose.Schema({
  total: {
    type: Number,
    required: true,
    default: 0
  }
});


export default mongoose.model('PrizePool', PrizePool);
