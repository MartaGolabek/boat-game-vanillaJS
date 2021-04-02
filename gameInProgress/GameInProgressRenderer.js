import Constants from "../constants/Constants.js";
import EventConstants from "../constants/EventConstants.js";
import ViewConstants from "../constants/ViewConstants.js";

export default class GameInProgressRenderer {
  #computerProgressBoard;
  #playerProgressBoard;
  #gameId;

  constructor(
    gameId,
    computerProgressBoard,
    playerProgressBoard,
    eventDispatcher
  ) {
    this.#gameId = gameId;
    this.#computerProgressBoard = computerProgressBoard;
    this.#playerProgressBoard = playerProgressBoard;
    this.#registerListeners(eventDispatcher);
  }

  renderOnGameStart() {
    const playerOriginalBoard = document.getElementById(
      this.#playerProgressBoard.id
    );
    const playerProgressBoard = playerOriginalBoard.cloneNode(true);

    playerOriginalBoard.replaceWith(playerProgressBoard);

    const computerOriginalBoard = document.getElementById(
      this.#computerProgressBoard.id
    );
    const computerProgressBoard = computerOriginalBoard.cloneNode(true);

    computerOriginalBoard.replaceWith(computerProgressBoard);
  }

  #disableStartButton() {
    document.getElementById(
      `${this.#gameId}-${ViewConstants.START_BUTTON}`
    ).disabled = true;
  }

  #renderBoardOnPlayerShot(location) {
    this.#renderBoardOnShot(location, this.#computerProgressBoard);
  }

  #renderBoardOnComputerShot(location) {
    this.#renderBoardOnShot(location, this.#playerProgressBoard);
  }

  #renderBoardOnShot(location, targetBoard) {
    const cellElement = document.getElementById(
      `${this.#gameId}-${targetBoard.type}-${location.x}-${location.y}`
    );
    if (targetBoard.isBoat(location)) {
      cellElement.innerText = "X";
      if (targetBoard.isEntireBoatShotAlready(location)) {
        const shotBoat = targetBoard.getBoatToLocation(location);
        shotBoat.locations.forEach((location) => {
          document.getElementById(
            `${this.#gameId}-${targetBoard.type}-${location.x}-${location.y}`
          ).className = "ShotBoat"; // replace current class
        });
      }
    } else {
      cellElement.innerHTML = "&nbsp;&bull;";
    }
  }

  #renderNotifications(newNotification) {
    const notificationsContainer = document.getElementById(
      `${this.#gameId}-${ViewConstants.NOTIFICATIONS_CONTAINER}`
    );
    const notification = this.#createHtmlForNotificationElement(
      newNotification
    );
    notificationsContainer.insertBefore(
      notification,
      notificationsContainer.children[0]
    );
    if (notificationsContainer.children.length > 4) {
      notificationsContainer.removeChild(notificationsContainer.lastChild);
    }
  }

  #createHtmlForNotificationElement(newNotification) {
    const notification = document.createElement("div");
    notification.innerText = newNotification.text;
    notification.classList.add(newNotification.type);
    return notification;
  }

  #showBoatsOnComputerWin() {
    this.#disableClicksForBoards();
    const notShowBoats = this.#computerProgressBoard.notShotBoats;

    notShowBoats.forEach((boat) =>
      boat.locations.forEach((location) => {
        document.getElementById(
          `${this.#gameId}-${Constants.COMPUTER}-${location.x}-${location.y}`
        ).className = "MissedBoat";
      })
    );

    this.#replaceStartButtonWithReloadButton();
  }

  #handleHumanWin() {
    this.#disableClicksForBoards();
    this.#replaceStartButtonWithReloadButton();
  }

  #disableClicksForBoards() {
    document.getElementById(
      this.#computerProgressBoard.id
    ).style.pointerEvents = "none";
    document.getElementById(this.#playerProgressBoard.id).style.pointerEvents =
      "none";
  }

  #replaceStartButtonWithReloadButton() {
    const startButton = document.getElementById(
      `${this.#gameId}-${ViewConstants.START_BUTTON}`
    );

    const reloadButton = this.#createHtmlElementForReloadButton();

    startButton.replaceWith(reloadButton);
  }

  #createHtmlElementForReloadButton() {
    const reloadButton = document.createElement("button");
    reloadButton.id = `${this.#gameId}-${ViewConstants.RELOAD_BUTTON}`;
    reloadButton.textContent = "RELOAD GAME";
    reloadButton.classList.add("ReloadButton");
    return reloadButton;
  }

  #registerListeners(eventDispatcher) {
    eventDispatcher.registerListener(
      EventConstants.START_GAME,
      this.#disableStartButton.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.PLAYER_SHOT,
      this.#renderBoardOnPlayerShot.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.COMPUTER_SHOT,
      this.#renderBoardOnComputerShot.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.NEW_NOTIFICATION,
      this.#renderNotifications.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.COMPUTER_WIN,
      this.#showBoatsOnComputerWin.bind(this)
    );

    eventDispatcher.registerListener(
      EventConstants.HUMAN_WIN,
      this.#handleHumanWin.bind(this)
    );
  }
}
