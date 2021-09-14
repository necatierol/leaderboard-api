import DataLib from '../mongo';
import CacheLib from '.';

import { USER_COUNT } from '../../constants/leaderboard';


export default async (userId, rank = USER_COUNT + 1) => {
  let userCache = await CacheLib.findUserInLeaderboard(userId);;

  if (rank <= USER_COUNT && (!userCache || userCache.rank !== rank)) {
    CacheLib.setLeaderboard(await DataLib.getLeaderboard());
  }
};
