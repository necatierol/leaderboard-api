import redis from '../../core/redis';


export default async (leaderboard) => {
  if (redis.redisClient.connected) {
    await redis.redisClient.setAsync('leaderboard', JSON.stringify(leaderboard));
  }
};
