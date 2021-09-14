import DataLib from '../../libs/mongo';
import LeaderboardLib from '../../libs/leaderboard';
import Models from '../../models';

import sharePrize from '../../libs/mongo/sharePrize';


const settings = {
  getLeaderboard: {
    method: 'get',
    path: '/leaderboards'
  },
  finish: {
    method: 'put',
    path: '/leaderboards/finish'
  }
};

const defaultQueries = {};

class LeaderboardService {
  getLeaderboard = async (req) => {
    const { userId } = req.query;
    const user = await Models.User
      .findOne({ userId: Number(userId) }, { _id: 0, __v: 0 })
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
  };

  finish = async (req) => { // eslint-disable-line
    await sharePrize();

    return {
      status: 200,
      body: {}
    };
  }
}

export default {
  handlers: new LeaderboardService(),
  settings,
  defaultQueries
};
