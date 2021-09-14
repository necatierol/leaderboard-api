import Models from '../../models';
import DataLib from '../../libs/mongo';
import CacheLib from '../../libs/redis';
import LeaderboardLib from '../../libs/leaderboard';

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
  getLeaderboard: {
    method: 'get',
    path: '/users/:id/leaderboard'
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

  getLeaderboard = async (req) => {
    const user = await Models.User
      .findOne({ userId: Number(req.params.id) }, { _id: 0, __v: 0 })
      .lean();

    let leaderboard;
    let beforeUsers;
    let afterUsers;
    let currentUserRank;
    await Promise.all([
      (async () => {
        currentUserRank = await DataLib.getUserRank(user.score);
      })(),
      (async () => {
        leaderboard = await LeaderboardLib.get();
      })(),
      (async () => {
        beforeUsers = await DataLib.getBeforeUsers(user);
      })(),
      (async () => {
        afterUsers = await DataLib.getAfterUsers(user);
      })()
    ]);

    let rankDiff = '0';
    if (user.lastRank !== 0) {
      const diff = user.lastRank - currentUserRank;
      if (diff > 0) rankDiff = `+${diff}`;
      else rankDiff = diff.toString();
    }

    const body = {
      leaderboard,
      currentUser: {
        ...user,
        rankDiff,
        rank: currentUserRank
      },
      beforeUsers: beforeUsers
        .map((u, idx) => ({ ...u, rank: currentUserRank - beforeUsers.length + idx })),
      afterUsers: afterUsers
        .map((u, idx) => ({ ...u, rank: currentUserRank + idx + 1 }))
    };

    return {
      status: 200,
      body
    };
  }

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
