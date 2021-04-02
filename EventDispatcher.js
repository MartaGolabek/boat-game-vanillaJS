export default class EventDispatcher {
  #listeners = {};

  dispatch(action, payload) {
    //console.log("DISPATCH ACTION: " + action);
    //console.log("DISPATCH PAYLOAD: " + payload);
    if (this.#listeners.hasOwnProperty(action)) {
      this.#listeners[action].forEach((listener) => {
        listener(payload);
      });
    }
  }

  registerListener(action, listener) {
    if (!this.#listeners.hasOwnProperty(action)) {
      this.#listeners[action] = [];
    }
    this.#listeners[action].push(listener);
  }
}
