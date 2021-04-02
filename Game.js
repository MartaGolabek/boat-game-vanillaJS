import AvailableBoat from "./model/boats/AvailableBoat.js";
import AvailableBoatsContainer from "./model/boats/AvailableBoatsContainer.js";
import Board from "./model/gameSetup/Board.js";
import BoardLocationGenerator from "./gameSetup/BoardLocationGenerator.js";
import Constants from "./constants/Constants.js";
import EventDispatcher from "./EventDispatcher.js";
import GameSetupEventManager from "./gameSetup/GameSetupEventManager.js";
import GameSetupRenderer from "./gameSetup/GameSetupRenderer.js";

export default class Game {
  #id;
  #boardDimension;
  #boatLayout;

  constructor(id, boardDimension, boatLayout = Constants.DEFAULT_BOAT_MASTS) {
    this.#id = id;
    this.#boardDimension = boardDimension;
    this.#boatLayout = boatLayout;
  }

  run() {
    const eventDispatcher = new EventDispatcher();

    const boardLocationGenerator = new BoardLocationGenerator();
    const playerBoard = new Board(Constants.HUMAN, this.#boardDimension);

    const availableBoats = [];
    this.#boatLayout.forEach((numberOfMasts) => {
      const boat = new AvailableBoat(numberOfMasts);
      availableBoats.push(boat);
    });

    const availableBoatsContainer = new AvailableBoatsContainer(
      availableBoats,
      eventDispatcher
    );

    const computerBoard = boardLocationGenerator.generateRandomBoard(
      Constants.COMPUTER,
      this.#boardDimension,
      this.#boatLayout
    );

    const renderer = new GameSetupRenderer(
      this.#id,
      playerBoard,
      computerBoard,
      eventDispatcher,
      availableBoatsContainer
    );

    renderer.render();

    const eventManager = new GameSetupEventManager(
      this,
      computerBoard,
      playerBoard,
      eventDispatcher,
      availableBoatsContainer
    );

    eventManager.init();
  }

  get id() {
    return this.#id;
  }
}
