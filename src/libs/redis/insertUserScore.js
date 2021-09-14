import redis from '../../core/redis';
import score from '../amqp/score';


export default async (userData) => {
  if (redis.redisClient.connected) {
    await redis.redisClient.setAsync(`user_${userData.userId}`, JSON.stringify(userData));
    score(userData);
  }
};
