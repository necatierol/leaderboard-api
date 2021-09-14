export default {
  development: {
    url: process.env.MONGO_DATABASE_URL || 'mongodb://localhost/leaderboard'
  },
  development_test: {
    url: process.env.MONGO_DATABASE_URL || 'mongodb://localhost/leaderboard'
  },
  production_test: {
    url: process.env.MONGO_DATABASE_URL || 'mongodb://localhost/leaderboard'
  },
  production: {
    url: process.env.MONGO_DATABASE_URL || 'mongodb://localhost/leaderboard'
  }
};

