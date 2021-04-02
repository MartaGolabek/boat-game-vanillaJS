import Constants from "../constants/Constants.js";
import EventConstants from "../constants/EventConstants.js";
import GameInProgressEventManager from "../gameInProgress/GameInProgressEventManager.js";
import GameInProgressRenderer from "../gameInProgress/GameInProgressRenderer.js";
import Location from "../model/Location.js";
import ViewConstants from "../constants/ViewConstants.js";

export default class GameSetupEventManager {
  #computerBoard;
  #playerBoard;
  #availableBoatsContainer;
  #eventDispatcher;
  #currentDirection;
  #movableBoat;
  #game;

  constructor(
    game,
    computerBoard,
    playerBoard,
    eventDispatcher,
    availableBoatsContainer
  ) {
    this.#game = game;
    this.#computerBoard = computerBoard;
    this.#playerBoard = playerBoard;
    this.#eventDispatcher = eventDispatcher;
    this.#availableBoatsContainer = availableBoatsContainer;
    this.#currentDirection = Constants.HORIZONTAL;
  }

  /* ------------------------------------------------ AVAILABLE BOATS HANDLERS ------------------------------------------- */

  #handleBoatClick(event) {
    const self = event.target.parentNode;
    if (this.#isBoatElement(self)) {
      this.#eventDispatcher.dispatch(EventConstants.SELECT_BOAT, self.id);

      this.#eventDispatcher.dispatch(
        EventConstants.RESET_BOATS,
        this.#availableBoatsContainer.otherBoats.map((boat) => boat.id)
      );
    }
  }

  #handleBoatMouseOver(event) {
    const self = event.target.parentNode;
    if (this.#isBoatElement(self) && this.#selectedBoat.id !== self.id) {
      this.#eventDispatcher.dispatch(EventConstants.MOUSE_OVER_BOAT, self.id);
    }
  }

  #handleBoatMouseOut(event) {
    const self = event.target.parentNode;
    if (this.#isBoatElement(self) && this.#selectedBoat.id !== self.id) {
      this.#eventDispatcher.dispatch(EventConstants.MOUSE_LEAVE_BOAT, self.id);
    }
  }

  /* ----------------------------------------------- BOARD HANDLERS --------------------------------------------------------- */

  #handlePlayerBoardMouseOver(event) {
    const self = event.target;
    if (!this.#selectedBoat) {
      return;
    }

    if (self.tagName.toLowerCase() === "td") {
      let startLocation = this.#getStartLocation(event);
      this.#movableBoat = this.#selectedBoat.toMovableBoat(
        startLocation,
        this.#currentDirection
      );

      const checkStartLocation = startLocation.left().up();
      const locationAvailable = this.#playerBoard.checkAvailable(
        this.#movableBoat,
        checkStartLocation
      );

      if (locationAvailable) {
        this.#eventDispatcher.dispatch(
          EventConstants.MOUSE_OVER_AVAILABLE_BOARD_LOCATION,
          this.#movableBoat.locations
        );
      } else {
        this.#eventDispatcher.dispatch(
          EventConstants.MOUSE_OVER_UNAVAILABLE_BOARD_LOCATION,
          this.#movableBoat.locations.filter(
            (location) =>
              this.#playerBoard.inBoard(location) &&
              this.#playerBoard.isAvailable(location) // get locations that are in board and not a location of a boat
          )
        );
      }
    }
  }

  #handlePlayerBoardMouseOut(event) {
    if (!this.#selectedBoat) {
      return;
    }

    this.#eventDispatcher.dispatch(
      EventConstants.RESET_COLOR_FOR_BOARD_LOCATIONS,
      this.#movableBoat.locations.filter(
        (location) =>
          this.#playerBoard.inBoard(location) &&
          this.#playerBoard.isAvailable(location)
      )
    );
  }

  #handlePlayerBoardRightClick(event) {
    event.preventDefault();
    self = event.target;

    if (!this.#selectedBoat) {
      return;
    }

    if (self.tagName.toLowerCase() === "td") {
      const previousLocations = [...this.#movableBoat.locations];
      let startLocation = this.#getStartLocation(event);
      this.#currentDirection =
        this.#currentDirection === Constants.HORIZONTAL
          ? Constants.VERTICAL
          : Constants.HORIZONTAL;
      this.#movableBoat = this.#selectedBoat.toMovableBoat(
        startLocation,
        this.#currentDirection
      );

      // reset color for previousMovableBoat
      this.#eventDispatcher.dispatch(
        EventConstants.RESET_COLOR_FOR_BOARD_LOCATIONS,
        previousLocations.filter(
          (location) =>
            this.#playerBoard.inBoard(location) &&
            this.#playerBoard.isAvailable(location)
        )
      );

      const checkStartLocation = startLocation.left().up();
      const locationAvailable = this.#playerBoard.checkAvailable(
        this.#movableBoat,
        checkStartLocation
      );

      if (locationAvailable) {
        this.#eventDispatcher.dispatch(
          EventConstants.MOUSE_OVER_AVAILABLE_BOARD_LOCATION,
          this.#movableBoat.locations
        );
      } else {
        this.#eventDispatcher.dispatch(
          EventConstants.MOUSE_OVER_UNAVAILABLE_BOARD_LOCATION,
          this.#movableBoat.locations.filter(
            (location) =>
              this.#playerBoard.inBoard(location) &&
              this.#playerBoard.isAvailable(location)
          )
        );
      }
    }
  }

  #handlePlayerBoardMouseClick(event) {
    self = event.target;

    if (!this.#selectedBoat) {
      return;
    }

    if (self.tagName.toLowerCase() === "td") {
      let startLocation = this.#getStartLocation(event);

      const checkStartLocation = startLocation.left().up();
      const locationAvailable = this.#playerBoard.checkAvailable(
        this.#movableBoat,
        checkStartLocation
      );

      if (locationAvailable) {
        this.#playerBoard.addBoat(this.#movableBoat.toBoat());
        this.#availableBoatsContainer.removeBoat(this.#selectedBoat.id);
        this.#eventDispatcher.dispatch(EventConstants.SELECT_LOCATIONS, {
          locations: this.#movableBoat.locations,
          boatId: this.#selectedBoat.id,
        });
      }

      if (this.#availableBoatsContainer.allBoats.length > 0) {
        this.#eventDispatcher.dispatch(
          EventConstants.SELECT_BOAT,
          this.#availableBoatsContainer.allBoats[0].id
        );
      } else {
        this.#availableBoatsContainer.selectedBoat = null;
        this.#eventDispatcher.dispatch(EventConstants.GAME_SETUP_FINISHED);
      }
    }
  }

  #startGame() {
    const computerProgressBoard = this.#computerBoard.toProgressBoard();
    const playerProgressBoard = this.#playerBoard.toProgressBoard();

    const gameInProgressRenderer = new GameInProgressRenderer(
      this.gameId,
      computerProgressBoard,
      playerProgressBoard,
      this.#eventDispatcher
    );

    gameInProgressRenderer.renderOnGameStart();

    const gameInProgressEventManager = new GameInProgressEventManager(
      computerProgressBoard,
      playerProgressBoard,
      this.#eventDispatcher,
      this.#game
    );

    gameInProgressEventManager.init();
  }

  get #selectedBoat() {
    return this.#availableBoatsContainer.selectedBoat;
  }

  get gameId() {
    return this.#game.id;
  }

  init() {
    /* --------------------- EVENT LISTENERS FOR AVAILABLE BOATS -------------------- */
    document
      .getElementById(ViewConstants.AVAILABLE_BOATS_ELEMENT)
      .addEventListener("click", this.#handleBoatClick.bind(this));

    document
      .getElementById(ViewConstants.AVAILABLE_BOATS_ELEMENT)
      .addEventListener("mouseover", this.#handleBoatMouseOver.bind(this));

    document
      .getElementById(ViewConstants.AVAILABLE_BOATS_ELEMENT)
      .addEventListener("mouseout", this.#handleBoatMouseOut.bind(this));

    /* ----------------- EVENT LISTENERS FOR PLAYER BOARD ------------------------- */

    if (this.#playerBoard.type === Constants.HUMAN) {
      document
        .getElementById(this.#playerBoard.id)
        .addEventListener(
          "mouseover",
          this.#handlePlayerBoardMouseOver.bind(this)
        );

      document
        .getElementById(this.#playerBoard.id)
        .addEventListener(
          "contextmenu",
          this.#handlePlayerBoardRightClick.bind(this)
        );

      document
        .getElementById(this.#playerBoard.id)
        .addEventListener(
          "mouseout",
          this.#handlePlayerBoardMouseOut.bind(this)
        );

      document
        .getElementById(this.#playerBoard.id)
        .addEventListener(
          "click",
          this.#handlePlayerBoardMouseClick.bind(this)
        );
    }

    /* ------------------- EVENT LISTENERS DURING GAME --------------------------- */

    document
      .getElementById(`${this.gameId}-${ViewConstants.START_BUTTON}`)
      .addEventListener("click", this.#startGame.bind(this));
  }

  // helper methods

  #isBoatElement(self) {
    return (
      this.#availableBoatsContainer.allBoats.filter(
        (boat) => boat.id === self.id
      ).length > 0
    );
  }

  #getStartLocation(event) {
    const x = parseInt(event.target.getAttribute("data-x"));
    const y = parseInt(event.target.getAttribute("data-y"));
    return Location.of(x, y);
  }
}
