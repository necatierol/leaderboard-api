import redisClient from '../../core/redis';


export default async () => {
  if (redisClient.connected) redisClient.del('leaderboard');
};
