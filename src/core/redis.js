import redis from 'redis';
import { promisifyAll } from 'bluebird';

import config from '../config/redis';


promisifyAll(redis);

const env = process.env.NODE_ENV || 'development';
const { host, port } = config[env] || config.development;

const redisClient = redis.createClient({ host, port });

redisClient.on('connect', function () {
  console.log('Redis connected');
});

redisClient.on('error', err => {
  console.log('Error ' + err);
});


export default redisClient;
