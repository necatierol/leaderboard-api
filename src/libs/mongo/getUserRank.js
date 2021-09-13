import models from '../../models';


export default async (user) => {
  const rank = await models.User
    .find({ score: { $gt: user.score } }, { _id: 0, __v: 0 })
    .count() + 1;

  return rank;
};
