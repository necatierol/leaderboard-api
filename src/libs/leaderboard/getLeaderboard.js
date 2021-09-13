import models from '../../models';

import { USER_COUNT } from '../../constants/leaderboard';


const calculateRankDiff = (last, current) => {
  let rankDiff = '0';
  if (last != 0) {
    const diff = last - current;
    if (diff > 0) rankDiff = `+${diff}`;
    else rankDiff = diff.toString();
  }

  return rankDiff;
};

export default async() => {
  const users = await models.User
    .find({}, { _id: 0, __v: 0 })
    .sort({ score: -1 })
    .limit(USER_COUNT)
    .lean()
    .exec();

  return users.map((u, idx) => ({
    ...u,
    rank: idx + 1,
    rankDiff: calculateRankDiff(u.lastRank, idx + 1)
  }));
};
