import type { GameController } from "./controller";

export const startSimulationTicker = (controller: GameController) => {
  let lastTime = performance.now();
  let frameId = 0;

  const tick = (time: number) => {
    const delta = Math.min(time - lastTime, 100);
    lastTime = time;
    controller.advance(delta);
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frameId);
};
