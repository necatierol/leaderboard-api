const periods = {
  DAILY: 86400000, // milisecond
  WEEKLY: 604800000,
  MONTHLY: 2592000000
};

export const surrounding = {
  BEFORE: 3,
  AFTER: 2
};

export const USER_COUNT = 100;

export default {
  PERIOD: periods.WEEKLY,
  USER_COUNT,
  surrounding
};
