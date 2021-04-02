import Constants from "../../constants/Constants.js";

// manages the shots
export default class ProgressBoard {
  #id;
  #originalBoard;
  #shotLocations;
  #shotBoats;
  #boats;
  #shotArray;
  #locationsNextToShotBoat;

  constructor(id, originalBoard, boats) {
    this.#id = id;
    this.#originalBoard = originalBoard;
    this.#boats = boats;
    this.#shotLocations = [];
    this.#shotBoats = [];
    this.#shotArray = this.#initializeShotArray();
    this.#locationsNextToShotBoat = [];
  }

  shootLocation(location) {
    this.#shotLocations.push(location);
    this.#shotArray[location.x][location.y] = Constants.CELL.SHOT;
  }

  isLocationShotAlready(shotLocation) {
    const locationShotAlready = this.#shotLocations.filter(
      (location) =>
        location.x === shotLocation.x && location.y === shotLocation.y
    );
    return locationShotAlready.length > 0;
  }

  locationinBoard(location) {
    return (
      location.x >= 0 &&
      location.x < this.#originalBoard.dimension &&
      location.y >= 0 &&
      location.y < this.#originalBoard.dimension
    );
  }

  addShotBoat(shotBoat) {
    this.#shotBoats.push(shotBoat);

    // block locations next to the shot boat
    const shotBoatLocations = [...shotBoat.locations];
    if (shotBoat.isVertical) {
      shotBoatLocations.sort(this.#sortLocationsForVerticalBoat);

      this.#blockLocationNextToShotBoat(shotBoatLocations[0].up());
      this.#blockLocationNextToShotBoat(shotBoatLocations[0].up().left());
      this.#blockLocationNextToShotBoat(shotBoatLocations[0].up().right());

      this.#blockLocationNextToShotBoat(
        shotBoatLocations[shotBoatLocations.length - 1].down()
      );
      this.#blockLocationNextToShotBoat(
        shotBoatLocations[shotBoatLocations.length - 1].down().left()
      );
      this.#blockLocationNextToShotBoat(
        shotBoatLocations[shotBoatLocations.length - 1].down().right()
      );

      shotBoatLocations.forEach((location) => {
        this.#blockLocationNextToShotBoat(location.left());
        this.#blockLocationNextToShotBoat(location.right());
      });
    } else {
      shotBoatLocations.sort(this.#sortLocationsForHorizontalBoat);

      this.#blockLocationNextToShotBoat(shotBoatLocations[0].left());
      this.#blockLocationNextToShotBoat(shotBoatLocations[0].left().up());
      this.#blockLocationNextToShotBoat(shotBoatLocations[0].left().down());

      this.#blockLocationNextToShotBoat(
        shotBoatLocations[shotBoatLocations.length - 1].right()
      );
      this.#blockLocationNextToShotBoat(
        shotBoatLocations[shotBoatLocations.length - 1].right().up()
      );
      this.#blockLocationNextToShotBoat(
        shotBoatLocations[shotBoatLocations.length - 1].right().down()
      );

      shotBoatLocations.forEach((location) => {
        this.#blockLocationNextToShotBoat(location.up());
        this.#blockLocationNextToShotBoat(location.down());
      });
    }
  }

  #sortLocationsForVerticalBoat(location1, location2) {
    if (location1.y < location2.y) {
      return 0;
    } else {
      return 1;
    }
  }

  #sortLocationsForHorizontalBoat(location1, location2) {
    if (location1.x < location2.x) {
      return 0;
    } else {
      return 1;
    }
  }

  #blockLocationNextToShotBoat(location) {
    if (this.locationinBoard(location)) {
      this.#locationsNextToShotBoat.push(location);
    }
  }

  isBoat(location) {
    return !this.#originalBoard.isAvailable(location);
  }

  getBoatToLocation(location) {
    return this.#boats.filter(
      (boat) =>
        boat.locations.filter(
          (boatLocation) =>
            boatLocation.x === location.x && boatLocation.y === location.y
        ).length > 0
    )[0];
  }

  isEntireBoatShotAlready(location) {
    const boatToLocation = this.getBoatToLocation(location);

    let isBoatShot = true;

    boatToLocation.locations.forEach((boatLocation) => {
      if (
        this.#shotArray[boatLocation.x][boatLocation.y] ===
        Constants.CELL.NOT_SHOT_YET
      ) {
        isBoatShot = false;
      }
    });
    return isBoatShot;
  }

  isNextToShotBoat(potentialShot) {
    return (
      this.#locationsNextToShotBoat.filter((location) =>
        location.equals(potentialShot)
      ).length > 0
    );
  }

  #initializeShotArray() {
    const initialBoard = new Array(this.#originalBoard.dimension);

    for (var i = 0; i < initialBoard.length; i++) {
      initialBoard[i] = new Array(this.#originalBoard.dimension).fill(0);
    }

    return initialBoard;
  }

  get shotLocations() {
    return this.#shotLocations;
  }

  get allBoatsShot() {
    return this.#shotBoats.length === 10;
  }

  get notShotBoats() {
    return this.#boats.filter(
      (boat) =>
        this.#shotBoats.filter((shotBoat) => shotBoat.id === boat.id).length ===
        0
    );
  }

  get id() {
    return this.#id;
  }

  get dimension() {
    return this.#originalBoard.dimension;
  }

  get type() {
    return this.#originalBoard.type;
  }
}
