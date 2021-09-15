import redis from '../../core/redis';
import scoreQueue from '../amqp/score';
import updateUserScore from '../score/updateUserScore';


export default async (userData) => {
  if (redis.redisClient.connected) {
    const createdAt = Date.now();
    const data = { ...userData, createdAt };
    const key = `UserScore_${data.userId}_${createdAt}`;

    await redis.redisClient.setAsync(key, JSON.stringify(data));
    scoreQueue(data);
  } else {
    await updateUserScore(userData);
  }
};
