import AMQP from '.';
import removeUserScore from '../redis/removeUserScore';
import updateUserScore from '../score/updateUserScore';


AMQP.on('USER_SCORE', async (data, resolve, reject) => {
  try {
    const status = await updateUserScore(data);

    if (status) {
      await removeUserScore(`user_${data.userId}`);
      resolve();
    } else reject();
  } catch (error) {
    reject(error);
  }
});

export default async (data) => {
  await AMQP.send('USER_SCORE', data);
};
