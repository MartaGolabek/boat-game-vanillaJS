import Constants from "../constants/Constants.js";
import EventConstants from "../constants/EventConstants.js";
import ViewConstants from "../constants/ViewConstants.js";

export default class GameSetupRenderer {
  #targetElement;
  #playerBoard;
  #computerBoard;
  #availableBoatsContainer;

  constructor(
    targetElement,
    playerBoard,
    computerBoard,
    eventDispatcher,
    availableBoatsContainer
  ) {
    this.#targetElement = targetElement;
    this.#playerBoard = playerBoard;
    this.#computerBoard = computerBoard;
    this.#registerListeners(eventDispatcher);
    this.#availableBoatsContainer = availableBoatsContainer;
  }

  render() {
    let gameExists = document.getElementById(this.#targetElement);

    let gameElement = document.createElement("div");
    gameElement.id = this.#targetElement;
    gameElement.classList.add("Game");

    let computerBoardElement = this.#createHtmlBoard(this.#computerBoard);
    let playerBoardElement = this.#createHtmlBoard(this.#playerBoard);

    let playerBoats = this.#renderAvailableBoats(
      this.#availableBoatsContainer.allBoats
    );

    let playerElement = document.createElement("div");
    playerElement.classList.add("PlayerSpace");

    playerElement.appendChild(playerBoats);
    playerElement.appendChild(playerBoardElement);

    const centralArea = this.#createHtmlElementForAreaBetweenBoards();

    gameElement.appendChild(playerElement);
    gameElement.appendChild(centralArea);
    gameElement.appendChild(computerBoardElement);

    if (!gameExists) {
      document.body.appendChild(gameElement);
    } else {
      let oldGameElement = document.getElementById(this.#targetElement);
      gameExists.parentElement.replaceChild(gameElement, oldGameElement);
    }

    if (!!this.#availableBoatsContainer.selectedBoat) {
      this.#selectBoat(this.#availableBoatsContainer.selectedBoat.id);
    }
  }

  #createHtmlBoard(board) {
    let boardElement = document.createElement("TABLE");
    boardElement.id = board.id;
    boardElement.classList.add("Board");

    for (let y = 0; y < board.dimension; y++) {
      let row = document.createElement("tr");
      for (let x = 0; x < board.dimension; x++) {
        const cell = this.#createHtmlBoardCell(board, x, y);
        row.appendChild(cell);
      }
      boardElement.appendChild(row);
    }

    return boardElement;
  }

  #createHtmlBoardCell(board, x, y) {
    const cell = document.createElement("td");
    cell.id = `${this.#targetElement}-${board.type}-${x}-${y}`;
    cell.setAttribute("data-x", x);
    cell.setAttribute("data-y", y);
    return cell;
  }

  #renderAvailableBoats(playerBoats) {
    let availableBoatsElement = document.createElement("div");
    availableBoatsElement.id = ViewConstants.AVAILABLE_BOATS_ELEMENT;
    availableBoatsElement.classList.add("AvailableBoats");

    playerBoats.forEach((boat) => {
      const boatElement = this.#createHtmlForAvailableBoat(boat);

      for (let i = 0; i < boat.numberOfMasts; i++) {
        let mast = document.createElement("div");
        boatElement.appendChild(mast);
      }

      availableBoatsElement.appendChild(boatElement);
    });

    return availableBoatsElement;
  }

  #createHtmlForAvailableBoat(boat) {
    const boatElement = document.createElement("div");
    boatElement.id = boat.id;
    boatElement.classList.add("AvailableBoat");
    boatElement.style.width = `${boat.numberOfMasts * 20}px`;
    return boatElement;
  }

  #createHtmlElementForAreaBetweenBoards() {
    const centralArea = document.createElement("div");
    centralArea.id = `${this.#targetElement}-${ViewConstants.CENTRAL_AREA}`;
    centralArea.classList.add("CentralArea");
    const notificationsContainer = document.createElement("div");
    notificationsContainer.id = `${this.#targetElement}-${
      ViewConstants.NOTIFICATIONS_CONTAINER
    }`;
    const startButton = document.createElement("button");
    startButton.id = `${this.#targetElement}-${ViewConstants.START_BUTTON}`;
    startButton.textContent = "START GAME";
    startButton.disabled = true;
    startButton.classList.add("StartButton");
    centralArea.appendChild(startButton);
    centralArea.appendChild(notificationsContainer);
    return centralArea;
  }

  #resetBoats(boatIds) {
    boatIds.forEach((id) => {
      if (document.getElementById(id) !== null) {
        this.#setColorForAllMasts(id, "DefaultBoat");
      }
    });
  }

  #selectBoat(boatId) {
    this.#setColorForAllMasts(boatId, "SelectedBoat");
    document.getElementById(boatId).focus();
  }

  #mouseOverAvailableBoat(boatId) {
    this.#setColorForAllMasts(boatId, "HoverBoat");
  }

  #mouseLeaveAvailableBoat(boatId) {
    this.#setColorForAllMasts(boatId, "DefaultBoat");
  }

  #setColorForAllMasts(id, className) {
    let mastNodes = document.getElementById(id).children;
    for (let i = 0; i < mastNodes.length; i++) {
      if (mastNodes[i].nodeName.toLowerCase() == "div") {
        mastNodes[i].className = className;
      }
    }
  }

  #mouseOverAvailableBoardLocation(locations) {
    for (let i = 0; i < locations.length; i++) {
      document.getElementById(
        `${this.#targetElement}-${Constants.HUMAN}-${locations[i].x}-${
          locations[i].y
        }`
      ).className = "AvailableLocation";
    }
  }

  #mouseOverBlockedBoardLocation(locations) {
    for (let i = 0; i < locations.length; i++) {
      document.getElementById(
        `${this.#targetElement}-${Constants.HUMAN}-${locations[i].x}-${
          locations[i].y
        }`
      ).className = "BlockedLocation";
    }
  }

  #resetColorForLocations(locations) {
    for (let i = 0; i < locations.length; i++) {
      document.getElementById(
        `${this.#targetElement}-${Constants.HUMAN}-${locations[i].x}-${
          locations[i].y
        }`
      ).className = "DefaultLocation";
    }
  }

  #selectLocations(payload) {
    const { locations, boatId } = payload;
    for (let i = 0; i < locations.length; i++) {
      document.getElementById(
        `${this.#targetElement}-${Constants.HUMAN}-${locations[i].x}-${
          locations[i].y
        }`
      ).className = "BoatLocation";
    }

    const boatToRemove = document.getElementById(boatId);
    boatToRemove.remove();
  }

  #enableButton() {
    document.getElementById(
      `${this.#targetElement}-${ViewConstants.START_BUTTON}`
    ).disabled = false;
  }

  #registerListeners(eventDispatcher) {
    /* Available Boats Listeners */
    eventDispatcher.registerListener(
      EventConstants.RESET_BOATS,
      this.#resetBoats.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.SELECT_BOAT,
      this.#selectBoat.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.MOUSE_OVER_BOAT,
      this.#mouseOverAvailableBoat.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.MOUSE_LEAVE_BOAT,
      this.#mouseLeaveAvailableBoat.bind(this)
    );

    /* Board Listeners */
    eventDispatcher.registerListener(
      EventConstants.MOUSE_OVER_AVAILABLE_BOARD_LOCATION,
      this.#mouseOverAvailableBoardLocation.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.MOUSE_OVER_UNAVAILABLE_BOARD_LOCATION,
      this.#mouseOverBlockedBoardLocation.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.RESET_COLOR_FOR_BOARD_LOCATIONS,
      this.#resetColorForLocations.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.SELECT_LOCATIONS,
      this.#selectLocations.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.GAME_SETUP_FINISHED,
      this.#enableButton.bind(this)
    );
  }
}
