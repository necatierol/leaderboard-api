import redis from '../../core/redis';

import getLeaderboard from '../mongo/getLeaderboard';
import CacheLib from '../redis';


export default async () => {
  let leaderboard;

  if (redis.redisClient.connected) {
    leaderboard = await CacheLib.getLeaderboard();
    if (!leaderboard) {
      leaderboard = await getLeaderboard();

      await CacheLib.setLeaderboard(leaderboard);
    }
  } else {
    leaderboard = await getLeaderboard();
  }

  return leaderboard;
};
