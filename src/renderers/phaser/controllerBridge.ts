import type { GameController } from "../../app/controller";

let activeController: GameController | undefined;

export const setPhaserController = (controller: GameController) => {
  activeController = controller;
};

export const getPhaserController = () => {
  if (!activeController) {
    throw new Error("Phaser controller has not been set.");
  }
  return activeController;
};
