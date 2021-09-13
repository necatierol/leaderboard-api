import Models from '../../models';

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

    await Promise.all([
      (async() => {
        await Models.User
          .updateOne({ userId: Number(req.params.id) }, { $inc: { score: userScore } });
      })(),
      (async() => {
        await Models.PrizePool
          .updateOne({}, { $inc: { total: prizePoolScore } }, { upsert: true });
      })()
    ]);
    
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
