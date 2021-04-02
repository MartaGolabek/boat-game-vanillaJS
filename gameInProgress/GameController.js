import Constants from "../constants/Constants.js";
import EventConstants from "../constants/EventConstants.js";

// controls the flow of the game
export default class GameController {
  #currentPlayer;
  #eventDispatcher;

  constructor(eventDispatcher) {
    this.#eventDispatcher = eventDispatcher;
    this.#currentPlayer = Constants.HUMAN;
  }

  startMove() {
    this.#eventDispatcher.dispatch(EventConstants.NEW_NOTIFICATION, {
      text: `${this.#currentPlayer} move`,
      type: "INFO",
    });
  }

  setPlayer(player) {
    this.#currentPlayer = player;
    this.startMove();
  }

  get currentMove() {
    return this.#currentPlayer;
  }
}
