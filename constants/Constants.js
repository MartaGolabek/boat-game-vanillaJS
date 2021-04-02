class Constants {}

Constants.DEFAULT_BOAT_MASTS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
Constants.COMPUTER = "computer";
Constants.HUMAN = "human";
Constants.HORIZONTAL = "horizontal";
Constants.VERTICAL = "vertical";
Constants.LOCATION = {
  FREE: 0,
  BLOCKED: 1,
};

Constants.EVENTS = {
  RESET_BOATS: "reset_boats",
};

Constants.CELL = {
  NOT_SHOT_YET: 0,
  SHOT: 1,
};

Object.freeze(Constants);
Object.freeze(Constants.LOCATION);

export default Constants;
