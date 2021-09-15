import AMQP from '.';
import removeUserScore from '../redis/removeUserScore';
import updateUserScore from '../score/updateUserScore';


const successStatus = [200, 429];
AMQP.on('USER_SCORE', async (data, resolve, reject) => {
  try {
    const { status } = await updateUserScore(data);

    if (successStatus.indexOf(status) !== -1) {
      await removeUserScore(`UserScore_${data.userId}_${data.createdAt}`);

      resolve();
    } else reject();
  } catch (error) {
    reject(error);
  }
});

export default async (data) => {
  await AMQP.send('USER_SCORE', data);
};
