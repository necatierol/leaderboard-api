import Models from '../../models';
import sharePrize from '../mongo/sharePrize';


export default async () => {
  let dates = await Models.Schedule.findOne({}).lean();
  if (!dates) {
    await Models.Schedule.updateOne({}, { $set: { prize: Date.now() } }, { upsert: true })
    dates = { prize: Date.now() };
  }
  const prizeDate = new Date(dates.prize).toLocaleDateString();
  const today = new Date().toLocaleDateString();

  
  if (prizeDate !== today) {
    sharePrize();
  } else {
    await Models.Schedule.updateOne({}, { $set: { prize: Date.now() } }, { upsert: true });
  }
};
