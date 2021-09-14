import cron from 'node-cron';
import cronConfig from '../config/cron';

import ScheduleLib from '../libs/schedule';


export default () => {
  cron.schedule(cronConfig.PRIZE_POOL_LIFECYLE, () => {
    console.log('Prize pool lifecyle');
    ScheduleLib.prize();
  });
  
  cron.schedule(cronConfig.RANK_LIFECYLE, () => {
    console.log('Rank lifecyle');
    ScheduleLib.rank();
  });
}
