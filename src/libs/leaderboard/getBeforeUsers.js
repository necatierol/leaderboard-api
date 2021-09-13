import models from '../../models';

import { surrounding as leaderboardConstants } from '../../constants/leaderboard';


export default async(user) => {
  const users = await models.User
    .find({ userId: { $ne: user.userId }, score: { $gte: user.score } }, { _id: 0, __v: 0 })
    .sort({ score: 1 })
    .limit(leaderboardConstants.BEFORE)
    .lean()
    .exec();

  return users.reverse();
};
