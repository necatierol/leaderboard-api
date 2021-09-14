import DataLib from '../mongo';

import findUserInLeaderboard from './findUserInLeaderboard';
import setLeaderboard from './setLeaderboard';

import { USER_COUNT } from '../../constants/leaderboard';


export default async (userId, rank) => {
  const userCache = await findUserInLeaderboard(userId);
  if (rank !== 0 && rank <= USER_COUNT && (!userCache || userCache.rank !== rank)) {
    const leaderboard = await DataLib.getLeaderboard();
    await setLeaderboard(leaderboard);
  }
};
