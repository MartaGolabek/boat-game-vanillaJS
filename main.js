import Game from "./Game.js";
import generateId from "./helpers/idGenerator.js";

window.addEventListener("load", () => {
  const game1 = new Game(generateId(), 10);
  const game2 = new Game(generateId(), 10);
  game1.run();
  game2.run();
  // It is possible to run even more games at once (as many as fit on your screen)
});
