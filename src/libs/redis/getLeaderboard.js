import redisClient from '../../core/redis';


export default async () => {
  if (redisClient.connected) {
    const leaderboard = await redisClient.getAsync('leaderboard');

    return JSON.parse(leaderboard);
  }

  return null;
};
