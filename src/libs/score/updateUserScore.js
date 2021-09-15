import Models from '../../models';
import checkAndResetLeaderboard from '../redis/checkAndResetLeaderboard';

import calculateScore from './calculate';
import getUserRank from '../mongo/getUserRank';

import { PERIOD } from '../../constants/score';


export default async (userData) => {
  const { userScore, prizePoolScore } = calculateScore();

  let user = await Models.User.findOne({ userId: Number(userData.userId) });
  if (!user) {
    const body = { ...userData };
    body.score = userScore;
    body.money += userScore;

    user = await Models.User.create(body);
  } else {
    const updatedTime = new Date(user.updatedAt).getTime();
    let now = new Date().getTime();
    if (userData.createdAt) now = new Date(userData.createdAt).getTime();

    if (Math.abs(now - updatedTime) < PERIOD) {
      return { status: 429 };
    }

    if (user.lastRank === 0) user.lastRank = await getUserRank(user.score);
    user.score += userScore;
    user.money += userScore;
    await user.save();
  }

  await Promise.all([
    (async () => {
      const userNewRank = await getUserRank(user.score);
      await checkAndResetLeaderboard(user.userId, userNewRank);
    })(),
    (async () => {
      await Models.PrizePool
        .updateOne({}, { $inc: { total: prizePoolScore } }, { upsert: true });
    })()
  ]);

  return { status: 200 };
};
