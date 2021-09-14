import redis from '../../core/redis';


export default async (userId) => {
  if (redis.redisClient.connected) {
    const leaderboard = await redis.redisClient.getAsync('leaderboard');
    if (!leaderboard) return null;

    const users = JSON.parse(leaderboard);
    return users.find((u) => u.userId === userId);
  }

  return null;
};
