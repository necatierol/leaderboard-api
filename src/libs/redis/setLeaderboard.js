import redisClient from '../../core/redis';


export default async (leaderboard) => {
  if (redisClient.connected) {
    await redisClient.setAsync('leaderboard', JSON.stringify(leaderboard));
  }
};
