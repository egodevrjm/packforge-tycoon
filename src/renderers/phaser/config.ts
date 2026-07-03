import Phaser from "phaser";
import type { GameController } from "../../app/controller";
import { setPhaserController } from "./controllerBridge";
import { GameScene } from "./GameScene";

export const createPhaserGame = (controller: GameController) => {
  setPhaserController(controller);
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: "phaser-root",
    backgroundColor: "#40392f",
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: "100%",
      height: "100%"
    },
    input: {
      mouse: {
        preventDefaultWheel: true
      }
    },
    scene: [GameScene]
  });
};
