import Models from '../../models';
import DataLib from '../../libs/mongo';
import CacheLib from '../../libs/redis';
import LeaderboardLib from '../../libs/leaderboard';

import validators from './validators';


const settings = {
  score: {
    method: 'post',
    path: '/users',
    validation: validators.online
  },
  getLeaderboard: {
    method: 'get',
    path: '/users/:id/leaderboard'
  }
};

const defaultQueries = {};

class UserService {
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

  score = async (req) => {
    await CacheLib.insertUserScore(req.body);

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
