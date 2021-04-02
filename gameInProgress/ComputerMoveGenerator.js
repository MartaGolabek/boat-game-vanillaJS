import RandomLocationGenerator from "../helpers/RandomLocationGenerator.js";

// generates computer moves
export default class ComputerMoveGenerator {
  #wasLastShotSuccessful;
  #targetedBoat = [];

  #playerProgressBoard;

  constructor(playerProgressBoard) {
    this.#playerProgressBoard = playerProgressBoard;
  }

  generateNextShot() {
    let nextShot;
    if (
      this.#targetedBoat.length > 0 &&
      !this.#playerProgressBoard.isEntireBoatShotAlready(this.#targetedBoat[0])
    ) {
      // finish boat
      nextShot = this.#generateNextShotSmartly(this.#targetedBoat);
    } else {
      // reset targeted boat
      this.#targetedBoat = [];
      let randomLocation;
      do {
        randomLocation = RandomLocationGenerator.generateRandomLocation(
          this.#playerProgressBoard.dimension
        );
      } while (
        this.#playerProgressBoard.isLocationShotAlready(randomLocation) ||
        this.#playerProgressBoard.isNextToShotBoat(randomLocation)
      );
      nextShot = randomLocation;
    }

    this.#wasLastShotSuccessful = this.#playerProgressBoard.isBoat(nextShot);
    if (this.#wasLastShotSuccessful) {
      this.#targetedBoat.push(nextShot);
    }
    return nextShot;
  }

  #isAvailableForShot(location) {
    return (
      !this.#playerProgressBoard.isLocationShotAlready(location) &&
      this.#playerProgressBoard.locationinBoard(location)
    );
  }

  #generateNextShotSmartly(targetedBoat) {
    let nextShot;
    if (targetedBoat.length > 1 && targetedBoat[0].y === targetedBoat[1].y) {
      nextShot = this.#generateNextMoveIfTargetedBoatIsHorizontal(targetedBoat);
    }

    if (targetedBoat.length > 1 && targetedBoat[0].x === targetedBoat[1].x) {
      nextShot = this.#generateNextMoveIfTargetedBoatIsVertical(targetedBoat);
    }

    if (targetedBoat.length === 1) {
      nextShot = this.#generateNextMoveIfOnlyOneMastKnown(targetedBoat);
    }

    return nextShot;
  }

  #generateNextMoveIfOnlyOneMastKnown(targetedBoat) {
    let nextShot;
    targetedBoat.forEach((boatLocation) => {
      if (this.#isAvailableForShot(boatLocation.left())) {
        nextShot = boatLocation.left();
        // return immediately and stop loop
        return;
      }

      if (this.#isAvailableForShot(boatLocation.up())) {
        nextShot = boatLocation.up();
        return;
      }

      if (this.#isAvailableForShot(boatLocation.right())) {
        nextShot = boatLocation.right();
        return;
      }

      if (this.#isAvailableForShot(boatLocation.down())) {
        nextShot = boatLocation.down();
        return;
      }
    });
    return nextShot;
  }

  #generateNextMoveIfTargetedBoatIsVertical(targetedBoat) {
    let nextShot;
    targetedBoat.forEach((boatLocation) => {
      if (this.#isAvailableForShot(boatLocation.up())) {
        nextShot = boatLocation.up();
        return;
      }

      if (this.#isAvailableForShot(boatLocation.down())) {
        nextShot = boatLocation.down();
        return;
      }
    });

    if (nextShot === undefined) {
      return this.#generateNextMoveIfOnlyOneMastKnown(targetedBoat);
    } else {
      return nextShot;
    }
  }

  #generateNextMoveIfTargetedBoatIsHorizontal(targetedBoat) {
    let nextShot;
    targetedBoat.forEach((boatLocation) => {
      if (this.#isAvailableForShot(boatLocation.left())) {
        nextShot = boatLocation.left();
        return;
      }

      if (this.#isAvailableForShot(boatLocation.right())) {
        nextShot = boatLocation.right();
        return;
      }
    });

    if (nextShot === undefined) {
      return this.#generateNextMoveIfOnlyOneMastKnown(targetedBoat);
    } else {
      return nextShot;
    }
  }
}
