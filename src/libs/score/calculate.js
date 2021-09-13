import { INCREMENTAL_SCORE_VALUE, PRIZE_POOL } from '../../constants/score';


export default () => {
  const prizePoolScore = (INCREMENTAL_SCORE_VALUE / 100) * PRIZE_POOL.PERCENTAGE;
  const userScore = INCREMENTAL_SCORE_VALUE - prizePoolScore;

  return {
    prizePoolScore,
    userScore
  };
};
