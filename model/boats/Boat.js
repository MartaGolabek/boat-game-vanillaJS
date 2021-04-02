export default class Boat {
  #id;
  #locations;

  constructor(id, locations) {
    this.#id = id;
    this.#locations = locations;
  }

  get id() {
    return this.#id;
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

  get numberOfMasts() {
    return this.#locations.length;
  }

  get locations() {
    return this.#locations;
  }

  get height() {
    return this.isVertical ? this.#locations.length : 1;
  }

  get width() {
    return this.isHorizontal ? this.#locations.length : 1;
  }

  get startLocation() {
    return this.#locations[0];
  }
}
