import redis from '../../core/redis';


export default async (key) => {
  if (redis.redisClient.connected) redis.redisClient.del(key);
};
