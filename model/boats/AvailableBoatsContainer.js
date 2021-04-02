import EventConstants from "../../constants/EventConstants.js";

export default class AvailableBoatsContainer {
  #boats;
  #selectedBoat;

  constructor(boats, eventDispatcher) {
    this.#boats = boats;
    this.#selectedBoat = boats[0];
    this.#registerListeners(eventDispatcher);
  }

  removeBoat(boatId) {
    this.#boats = this.#boats.filter((boat) => boat.id !== boatId);
  }

  get selectedBoat() {
    return this.#selectedBoat;
  }

  set selectedBoat(selectedBoat) {
    this.#selectedBoat = selectedBoat;
  }

  get otherBoats() {
    return this.#boats.filter((boat) => boat.id !== this.#selectedBoat.id);
  }

  get allBoats() {
    return this.#boats;
  }

  #registerListeners(eventDispatcher) {
    eventDispatcher.registerListener(EventConstants.SELECT_BOAT, (boatId) => {
      this.#selectedBoat = this.#boats.filter((boat) => boat.id === boatId)[0];
    });
  }
}
