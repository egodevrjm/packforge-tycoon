# PackForge Core

PackForge Core is the renderer-independent SDK for building management tycoon games.

It exports the simulation engine, saveable state types, data-pack contracts, game-package
validation, management-sim project/staff/event systems, and JSON import/export helpers.
It does not import Phaser, DOM APIs, or browser storage.

```ts
import { tycoonEngine, validateGamePackage } from "@packforge/core";
import type { TycoonGamePack } from "@packforge/core";

const state = tycoonEngine.createGame(myPack);
const next = tycoonEngine.dispatch(myPack, state, {
  type: "startContract",
  contractId: "first_job"
});
```

The core production layer remains resource/recipe based, while the management layer adds
phase-based projects, market scoring, named staff, data-driven events, and wrapped save
migration.
