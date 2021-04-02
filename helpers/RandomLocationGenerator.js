import Location from "../model/Location.js";

export default class RandomLocationGenerator {
  static #generateRandomXOrY(maxXOrYExclusive) {
    return Math.floor(Math.random() * maxXOrYExclusive);
  }

  static generateRandomLocation(maxXOrYExclusive) {
    return Location.of(
      RandomLocationGenerator.#generateRandomXOrY(maxXOrYExclusive),
      RandomLocationGenerator.#generateRandomXOrY(maxXOrYExclusive)
    );
  }
}
