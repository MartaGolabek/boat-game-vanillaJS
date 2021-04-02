import Boat from "./Boat.js";

export default class MovableBoat {
  #id;
  #locations;

  constructor(id, locations) {
    this.#id = id;
    this.#locations = locations;
  }

  toBoat() {
    return new Boat(this.#id, [...this.#locations]);
  }

  get locations() {
    return this.#locations;
  }

  get isVertical() {
    return this.isSingleMast || this.#locations[0].x === this.#locations[1].x;
  }

  get isHorizontal() {
    return this.isSingleMast || this.#locations[0].y === this.#locations[1].y;
  }

  get isSingleMast() {
    return this.#locations.length === 1;
  }

  get height() {
    return this.isVertical ? this.#locations.length : 1;
  }

  get width() {
    return this.isHorizontal ? this.#locations.length : 1;
  }
}
