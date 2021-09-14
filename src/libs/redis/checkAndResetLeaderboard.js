import DataLib from '../mongo';
import CacheLib from '.';

import { USER_COUNT } from '../../constants/leaderboard';


export default async (userId, rank) => {
  let userCache = await CacheLib.findUserInLeaderboard(userId);;

  if (rank !== 0 && rank <= USER_COUNT && (!userCache || userCache.rank !== rank)) {
    CacheLib.setLeaderboard(await DataLib.getLeaderboard());
  }
};
