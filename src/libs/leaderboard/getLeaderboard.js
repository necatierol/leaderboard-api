import models from '../../models';

import { USER_COUNT } from '../../constants/leaderboard';


export default async() => {
  const users = await models.User
    .find({}, { _id: 0, __v: 0 })
    .sort({ score: -1 })
    .limit(USER_COUNT)
    .lean()
    .exec();

  return users;
};