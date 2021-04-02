import Constants from "../../constants/Constants.js";
import Location from "../../model/Location.js";
import ProgressBoard from "../gameInProgress/ProgressBoard.js";
import generateId from "../../helpers/idGenerator.js";

export default class Board {
  #id;
  #type;
  #dimension;
  #boardArray;
  #boats;

  constructor(type, dimension, boats = []) {
    this.#id = generateId();
    this.#type = type;
    this.#dimension = dimension;
    this.#boardArray = this.#initializeBoardArray();
    this.#boats = boats;
  }

  toProgressBoard() {
    return new ProgressBoard(this.#id, this, [...this.#boats]);
  }

  isAvailable(location) {
    return (
      this.#boardArray[location.x + 1][location.y + 1] ===
      Constants.LOCATION.FREE
    );
  }

  checkAvailable(movableBoat, checkStartLocation) {
    // Check whether locations of movableBoat are in board
    for (let i = 0; i < movableBoat.locations.length; i++) {
      if (!this.inBoard(movableBoat.locations[i])) {
        return false;
      }
    }
    const endX = checkStartLocation.x + movableBoat.width + 2;
    const endY = checkStartLocation.y + movableBoat.height + 2;
    for (let x = checkStartLocation.x; x < endX; x++) {
      for (let y = checkStartLocation.y; y < endY; y++) {
        if (!this.isAvailable(Location.of(x, y))) {
          return false;
        }
      }
    }
    return true;
  }

  addBoat(boat) {
    this.#boats = [...this.#boats, boat];
    boat.locations.forEach(this.#setBlocked.bind(this));
  }

  #initializeBoardArray() {
    const initialBoard = new Array(this.#dimension + 2);

    for (var i = 0; i < initialBoard.length; i++) {
      initialBoard[i] = new Array(this.#dimension + 2).fill(0);
    }

    return initialBoard;
  }

  #setBlocked(location) {
    this.#boardArray[location.x + 1][location.y + 1] =
      Constants.LOCATION.BLOCKED;
  }

  inBoard(location) {
    return location.x < this.#dimension && location.y < this.#dimension;
  }

  get id() {
    return this.#id;
  }

  get dimension() {
    return this.#dimension;
  }

  get type() {
    return this.#type;
  }

  get boats() {
    return this.#boats;
  }
}
