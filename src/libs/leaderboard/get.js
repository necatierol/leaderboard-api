import redisClient from '../../core/redis';

import getLeaderboard from '../mongo/getLeaderboard';
import CacheLib from '../redis';


export default async () => {
  let leaderboard;

  if (redisClient.connected) {
    leaderboard = await CacheLib.getLeaderboard();
    if (!leaderboard) {
      leaderboard = await getLeaderboard();

      CacheLib.setLeaderboard(leaderboard);
    }
  } else {
    leaderboard = await getLeaderboard();
  }

  return leaderboard;
};
