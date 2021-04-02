import ComputerMoveGenerator from "./ComputerMoveGenerator.js";
import Constants from "../constants/Constants.js";
import EventConstants from "../constants/EventConstants.js";
import GameController from "./GameController.js";
import Location from "../model/Location.js";
import ViewConstants from "../constants/ViewConstants.js";

export default class GameInProgressEventManager {
  #playerProgressBoard;
  #computerProgressBoard;
  #eventDispatcher;
  #gameController;
  #computerMoveGenerator;
  #game;

  constructor(
    computerProgressBoard,
    playerProgressBoard,
    eventDispatcher,
    game
  ) {
    this.#computerProgressBoard = computerProgressBoard;
    this.#playerProgressBoard = playerProgressBoard;
    this.#eventDispatcher = eventDispatcher;
    this.#gameController = new GameController(eventDispatcher);
    this.#computerMoveGenerator = new ComputerMoveGenerator(
      this.#playerProgressBoard
    );
    this.#game = game;
  }

  init() {
    this.#eventDispatcher.dispatch(EventConstants.START_GAME);

    document
      .getElementById(this.#playerProgressBoard.id)
      .addEventListener("click", this.#handlePlayerBoardMouseClick.bind(this));

    document
      .getElementById(this.#computerProgressBoard.id)
      .addEventListener(
        "click",
        this.#handleComputerBoardMouseClick.bind(this)
      );

    this.#gameController.startMove();
  }

  #handlePlayerBoardMouseClick(event) {
    if (this.#gameController.currentMove === Constants.HUMAN) {
      this.#eventDispatcher.dispatch(EventConstants.NEW_NOTIFICATION, {
        text: "Wrong board!",
        type: "ALERT",
      });
    }
  }

  #handleComputerMove() {
    const shotLocation = this.#computerMoveGenerator.generateNextShot();
    this.#playerProgressBoard.shootLocation(shotLocation);

    this.#eventDispatcher.dispatch(EventConstants.COMPUTER_SHOT, shotLocation);

    if (this.#playerProgressBoard.isBoat(shotLocation)) {
      this.#markIfEntireBoatShotAlready(
        shotLocation,
        this.#playerProgressBoard
      );

      if (this.#playerProgressBoard.allBoatsShot) {
        this.#eventDispatcher.dispatch(EventConstants.NEW_NOTIFICATION, {
          text: `${Constants.COMPUTER} wins`,
          type: "INFO",
        });

        this.#eventDispatcher.dispatch(EventConstants.COMPUTER_WIN);

        setTimeout(
          document
            .getElementById(`${this.#game.id}-${ViewConstants.RELOAD_BUTTON}`)
            .addEventListener("click", this.#handleGameReload.bind(this)),
          1000
        );
      } else {
        this.#eventDispatcher.dispatch(EventConstants.NEW_NOTIFICATION, {
          text: "Successful shot, bonus move!",
          type: "INFO",
        });
        setTimeout(this.#handleComputerMove.bind(this), 1000);
      }
    } else {
      this.#gameController.setPlayer(Constants.HUMAN);
    }
  }

  #handleComputerBoardMouseClick(event) {
    if (this.#gameController.currentMove !== Constants.HUMAN) {
      this.#eventDispatcher.dispatch(EventConstants.NEW_NOTIFICATION, {
        text: "Wait for your turn!",
        type: "ALERT",
      });
      return;
    }

    self = event.target;

    if (self.tagName.toLowerCase() === "td") {
      const shotLocation = this.#getShotLocation(self);

      const isLocationShotAlready = this.#computerProgressBoard.isLocationShotAlready(
        shotLocation
      );

      if (isLocationShotAlready) {
        this.#eventDispatcher.dispatch(EventConstants.NEW_NOTIFICATION, {
          text: "Location shot already, choose another cell!",
          type: "ALERT",
        });
      } else {
        this.#computerProgressBoard.shootLocation(shotLocation);
        this.#eventDispatcher.dispatch(
          EventConstants.PLAYER_SHOT,
          shotLocation
        );

        if (this.#computerProgressBoard.isBoat(shotLocation)) {
          this.#markIfEntireBoatShotAlready(
            shotLocation,
            this.#computerProgressBoard
          );

          if (this.#computerProgressBoard.allBoatsShot) {
            this.#eventDispatcher.dispatch(EventConstants.NEW_NOTIFICATION, {
              text: `${Constants.HUMAN} wins`,
              type: "INFO",
            });

            this.#eventDispatcher.dispatch(EventConstants.HUMAN_WIN);

            setTimeout(
              document
                .getElementById(
                  `${this.#game.id}-${ViewConstants.RELOAD_BUTTON}`
                )
                .addEventListener("click", this.#handleGameReload.bind(this)),
              1000
            );
          } else {
            this.#eventDispatcher.dispatch(EventConstants.NEW_NOTIFICATION, {
              text: "Successful shot, bonus move!",
              type: "INFO",
            });
          }
        } else {
          this.#gameController.setPlayer(Constants.COMPUTER);
          setTimeout(this.#handleComputerMove.bind(this), 1000);
        }
      }
    }
  }

  #getShotLocation(target) {
    const x = parseInt(target.getAttribute("data-x"));
    const y = parseInt(target.getAttribute("data-y"));
    return Location.of(x, y);
  }

  #handleGameReload() {
    this.#game.run();
  }

  #markIfEntireBoatShotAlready(shotLocation, progressBoard) {
    if (progressBoard.isEntireBoatShotAlready(shotLocation)) {
      const shotBoat = progressBoard.getBoatToLocation(shotLocation);
      progressBoard.addShotBoat(shotBoat);
    }
  }
}
