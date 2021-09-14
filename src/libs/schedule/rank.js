import Models from '../../models';


export default async () => {
  let dates = await Models.Schedule.findOne({}).lean();
  if (!dates) {
    await Models.Schedule.updateOne({}, { $set: { rank: Date.now() } }, { upsert: true });
    dates = { rank: Date.now() };
  }
  const rankDate = new Date(dates.rank).toLocaleDateString();
  const today = new Date().toLocaleDateString();

  if (rankDate !== today) {
    await Models.User.updateMany({}, { $set: { lastRank: 0 } });
  } else {
    await Models.Schedule.updateOne({}, { $set: { rank: Date.now() } }, { upsert: true });
  }
};
