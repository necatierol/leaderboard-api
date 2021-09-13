import Leaderboard from "../../libs/leaderboard";
import models from '../../models';


const settings = {
  getLeaderboard: {
    method: 'get',
    path: '/leaderboards'
  }
};

const defaultQueries = {};

class LeaderboardService {
  getLeaderboard = async (req) => {
    const { userId } = req.query;
    const user = await models.User
      .findOne({ userId: Number(userId) }, { _id: 0, __v: 0})
      .lean();

    let leaderboard;
    let beforeUsers;
    let afterUsers;
    let currentUserRank;
    await Promise.all([
      (async() => {
        currentUserRank = await Leaderboard.getUserRank(user);
      })(),
      (async() => {
        leaderboard = await Leaderboard.getLeaderboard();
      })(),
      (async() => {
        beforeUsers = await Leaderboard.getBeforeUsers(user);
      })(),
      (async() => {
        afterUsers = await Leaderboard.getAfterUsers(user)
      })(),
    ]);

    let rankDiff = '0';
    if (user.lastRank != 0) {
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
        .map((u, idx) => ({...u, rank: currentUserRank - beforeUsers.length + idx })),
      afterUsers: afterUsers
        .map((u, idx) => ({...u, rank: currentUserRank + idx + 1 }))
    }

    return {
      status: 200,
      body
    };
  };
}

export default {
  handlers: new LeaderboardService(),
  settings,
  defaultQueries
};
