import Models from '../../models';

import { USER_COUNT } from '../../constants/leaderboard';
import { PRIZE_POOL } from '../../constants/score';

import getLeaderboard from '../mongo/getLeaderboard';


export default async () => {
  const otherUserCount = USER_COUNT - Object.keys(PRIZE_POOL.USER_PERCENTAGES).length;
  const totalPercentage = Array
    .from(Array(otherUserCount + 1).keys())
    .reduce((a, b) => a + b, 0);

  let users;
  let totalPrize = 0;
  await Promise.all([
    (async () => {
      users = await getLeaderboard();
    })(),
    (async () => {
      const prizePool = await Models.PrizePool.findOne({}).lean();
      totalPrize = prizePool.total;
    })()
  ]);

  const otherUserPrize = (totalPrize / 100) * (100 - Object
    .values(PRIZE_POOL.USER_PERCENTAGES).reduce((a, b) => a + b, 0));

  await Promise.all(users.map(async (user) => {
    let score = 0;
    if (PRIZE_POOL.USER_PERCENTAGES[user.rank]) {
      score = (totalPrize / 100) * PRIZE_POOL.USER_PERCENTAGES[user.rank];
    } else {
      score = parseFloat(
        ((otherUserPrize / totalPercentage) * (USER_COUNT - user.rank + 1)).toFixed(3)
      );
    }

    await Models.User.updateOne({ userId: user.userId }, { $inc: { score } });
  }));

  await Models.PrizePool.updateOne({}, { $set: { total: 0 } });
};
