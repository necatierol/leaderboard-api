import redis from '../../core/redis';


export default async () => {
  if (redis.redisClient.connected) {
    const leaderboard = await redis.redisClient.getAsync('leaderboard');

    return JSON.parse(leaderboard);
  }

  return null;
};
