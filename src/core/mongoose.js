/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from '../config/mongoose';

const env = process.env.NODE_ENV || 'development';
const url = config[env].url || config.development.url;

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

const connect = () => mongoose.connect(
  url, { useNewUrlParser: true, useCreateIndex: true },
  (err) => {
    if (err) {
      console.log('Mongoose error', err);
      setTimeout(connect, 1000);
    } else { console.log('Mongo connected'); }
  }
);


export default connect;
