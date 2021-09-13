import scoreConstants from '../../constants/score';


export default () => {
  const prizePoolScore =
    (scoreConstants.INCREMENTAL_SCORE_VALUE / 100) * scoreConstants.PRIZE_POOL.PERCENTAGE;
  const userScore = scoreConstants.INCREMENTAL_SCORE_VALUE - prizePoolScore;

  console.log(prizePoolScore, userScore);
  return {
    prizePoolScore,
    userScore
  };
};
