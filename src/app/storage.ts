import { tycoonEngine, type SimulationState, type TycoonGamePack } from "@packforge/core";

const saveKey = (pack: TycoonGamePack) => `tycoon-save:${pack.id}`;

export const saveGame = (pack: TycoonGamePack, state: SimulationState) => {
  localStorage.setItem(saveKey(pack), tycoonEngine.serialize(state));
};

export const loadGame = (pack: TycoonGamePack): SimulationState | undefined => {
  const save = localStorage.getItem(saveKey(pack));
  if (!save) {
    return undefined;
  }
  try {
    return tycoonEngine.deserialize(pack, save);
  } catch {
    localStorage.removeItem(saveKey(pack));
    return undefined;
  }
};

export const hasSavedGame = (pack: TycoonGamePack) => localStorage.getItem(saveKey(pack)) !== null;

export const clearSave = (pack: TycoonGamePack) => {
  localStorage.removeItem(saveKey(pack));
};
