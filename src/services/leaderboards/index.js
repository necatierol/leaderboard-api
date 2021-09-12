const settings = {
  getWeeklyLeaderboard: {
    method: 'get',
    path: '/leaderboards/weekly'
  }
};

const defaultQueries = {};

class LeaderboardService {
  getWeeklyLeaderboard = async (req) => {
    const { body } = req;

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
