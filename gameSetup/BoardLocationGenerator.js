import Board from "../model/gameSetup/Board.js";
import Boat from "../model/boats/Boat.js";
import Constants from "../constants/Constants.js";
import RandomLocationGenerator from "../helpers/RandomLocationGenerator.js";
import generateId from "../helpers/idGenerator.js";

export default class BoardLocationGenerator {
  generateRandomBoard(type, dimension, boatLayout) {
    const board = new Board(type, dimension);

    boatLayout.forEach((numberOfMasts) => {
      let available;
      do {
        available = true;
        const possibleBoat = this.#generateRandomBoat(dimension, numberOfMasts);
        const checkStartLocation = possibleBoat.startLocation.left().up();
        available = board.checkAvailable(possibleBoat, checkStartLocation);
        if (available) {
          board.addBoat(possibleBoat);
        }
      } while (!available);
    });

    return board;
  }

  #generateDirection() {
    const randomNumber = Math.random();
    if (randomNumber > 0.5) {
      return Constants.HORIZONTAL;
    } else {
      return Constants.VERTICAL;
    }
  }

  #generateRandomStartLocation(boardDimension, numberOfMasts) {
    return RandomLocationGenerator.generateRandomLocation(
      boardDimension - numberOfMasts
    );
  }

  #generateRandomBoat(boardDimension, numberOfMasts) {
    const startLocation = this.#generateRandomStartLocation(
      boardDimension,
      numberOfMasts
    );
    const direction = this.#generateDirection();
    const locations = [startLocation];
    for (let i = 1; i < numberOfMasts; i++) {
      const lastLocation = locations[locations.length - 1];
      locations.push(
        direction === Constants.HORIZONTAL
          ? lastLocation.right()
          : lastLocation.down()
      );
    }
    return new Boat(generateId(), locations);
  }
}
