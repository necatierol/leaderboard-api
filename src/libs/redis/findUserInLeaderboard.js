import redisClient from '../../core/redis';


export default async (userId) => {
  if (redisClient.connected) {
    const leaderboard = await redisClient.getAsync('leaderboard');
    if (!leaderboard) return null;

    const users = JSON.parse(leaderboard);

    return users.find((u) => u.userId === userId);
  }

  return null;
};
