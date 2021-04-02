class Location {
  #x;
  #y;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  static of(x, y) {
    return new Location(x, y);
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  equals(location) {
    return this.#x === location.x && this.#y === location.y;
  }

  right() {
    return new Location(this.#x + 1, this.#y);
  }

  down() {
    return new Location(this.#x, this.#y + 1);
  }

  left() {
    return new Location(this.#x - 1, this.#y);
  }

  up() {
    return new Location(this.#x, this.#y - 1);
  }
}

export default Location;
