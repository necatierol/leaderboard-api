import DataLib from '../mongo';
import CacheLib from '.';

import { USER_COUNT } from '../../constants/leaderboard';


export default async (user) => {
  let rank = USER_COUNT + 1;
  let userCache;
  await Promise.all([
    (async () => {
      rank = await DataLib.getUserRank(user);
    })(),
    (async () => {
      userCache = await CacheLib.findUserInLeaderboard(user.userId);
    })()
  ]);

  if (rank <= USER_COUNT && (!userCache || userCache.rank !== rank)) {
    CacheLib.setLeaderboard(await DataLib.getLeaderboard());
  }
};
