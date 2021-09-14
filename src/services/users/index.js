import Models from '../../models';
import CacheLib from '../../libs/redis';

import calculateScore from '../../libs/score/calculate';
import getUserRank from '../../libs/mongo/getUserRank';

import validators from './validators';
import { PERIOD } from '../../constants/score';


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

    const user = await Models.User.findOne({ userId: Number(req.params.id) });

    const updatedTime = new Date(user.updatedAt).getTime();
    const now = new Date().getTime();

    if (Math.abs(now - updatedTime) < PERIOD) {
      return {
        status: 429,
        body: { error: { details: ['Too Many Requests'] } }
      };
    }

    await Promise.all([
      (async () => {
        if (user.lastRank === 0) user.lastRank = await getUserRank(user.score);
        user.score += userScore;
        user.money += userScore;

        await user.save();
      })(),
      (async () => {
        await Models.PrizePool
          .updateOne({}, { $inc: { total: prizePoolScore } }, { upsert: true });
      })()
    ]);

    const userNewRank = await getUserRank(user.score);
    CacheLib.checkAndResetLeaderboard(user.userId, userNewRank);

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
