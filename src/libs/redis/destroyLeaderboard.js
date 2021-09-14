import redis from '../../core/redis';


export default async () => {
  if (redis.redisClient.connected) redis.redisClient.del('leaderboard');
};
