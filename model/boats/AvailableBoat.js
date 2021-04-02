import Constants from "../../constants/Constants.js";
import MovableBoat from "./MovableBoat.js";
import generateId from "../../helpers/idGenerator.js";

export default class AvailableBoat {
  #id;
  #numberOfMasts;

  constructor(numberOfMasts) {
    this.#id = generateId();
    this.#numberOfMasts = numberOfMasts;
  }

  toMovableBoat(startLocation, direction) {
    const locations = [startLocation];
    for (let i = 0; i < this.#numberOfMasts - 1; i++) {
      const lastLocation = locations[locations.length - 1];
      locations.push(
        direction === Constants.HORIZONTAL
          ? lastLocation.right()
          : lastLocation.down()
      );
    }
    return new MovableBoat(this.#id, locations);
  }

  get id() {
    return this.#id;
  }

  get numberOfMasts() {
    return this.#numberOfMasts;
  }
}
