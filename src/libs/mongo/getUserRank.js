import models from '../../models';


export default async (userScore) => {
  const rank = await models.User
    .find({ score: { $gt: userScore } }, { _id: 0, __v: 0 })
    .count() + 1;

  return rank;
};
