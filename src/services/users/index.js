import Models from '../../models';
import CacheLib from '../../libs/redis';

import calculateScore from '../../libs/score/calculate';

import validators from './validators';


const settings = {
  online: {
    method: 'post',
    path: '/users',
    validation: validators.online
  },
  updateScore: {
    method: 'put',
    path: '/users/:id/score'
  }
};

const defaultQueries = {};

class UserService {
  online = async (req) => {
    const { body } = req;

    let user = await Models.User
      .findOne({ userId: Number(body.userId) }, { _id: 0, __v: 0 });

    if (!user) {
      try {
        user = await Models.User.create(body);
      } catch (error) {
        return {
          status: 500,
          body: { error }
        };
      }
    }

    return {
      status: 200,
      body: user.toJSON()
    };
  };

  updateScore = async (req) => {
    const { userScore, prizePoolScore } = calculateScore();
    const userId = Number(req.params.id);

    let user;
    await Promise.all([
      (async () => {
        user = await Models.User
          .findOneAndUpdate({ userId }, { $inc: { score: userScore } });
      })(),
      (async () => {
        await Models.PrizePool
          .updateOne({}, { $inc: { total: prizePoolScore } }, { upsert: true });
      })()
    ]);

    CacheLib.checkAndResetLeaderboard(user);

    return {
      status: 200,
      body: {}
    };
  }
}

export default {
  handlers: new UserService(),
  settings,
  defaultQueries
};
