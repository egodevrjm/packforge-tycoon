# PackForge SDK

PackForge games are data packages. A player app, launcher, or future builder tool loads a
`PackForgeGamePackage`, validates it, chooses its entry pack, and drives the simulation
with commands.

## Core Runtime

```ts
import {
  getEntryPack,
  tycoonEngine,
  validateGamePackage,
  type PackForgeGamePackage
} from "@packforge/core";

const validation = validateGamePackage(gamePackage);
if (!validation.ok) throw new Error(validation.errors.join("\n"));

const pack = getEntryPack(gamePackage);
let state = tycoonEngine.createGame(pack);

state = tycoonEngine.dispatch(pack, state, {
  type: "startContract",
  contractId: "first_order"
}).state;

state = tycoonEngine.dispatch(pack, state, {
  type: "startProject",
  projectId: pack.projects?.[0]?.id ?? "starter_project"
}).state;
```

## Package Format

```ts
type PackForgeGamePackage = {
  manifest: {
    schemaVersion: "packforge.package.v1";
    packageId: string;
    displayName: string;
    version: string;
    entryPackId: string;
  };
  packs: TycoonGamePack[];
};
```

Game packs can optionally define management-sim systems in addition to resources,
recipes, stations, contracts, upgrades, and actions:

- `projects`: phase-based work with quality, risk, market fit, release scoring, and unlocks.
- `markets`: audience demand and multipliers used by project releases.
- `events`: timed or unlock-triggered choices with data-only effects.
- `staffRoles` and `staffCandidates`: named hires with roles, traits, morale, wages, and assignments.

Saves are wrapped as `packforge.save.v1` with the engine version, pack id, and serializable
simulation state. Old raw `SimulationState` saves still migrate through `deserialize`.

## Builder Tool Path

The `@packforge/builder-kit` package exposes starter templates and JSON import/export
helpers. A visual builder can edit pack data, validate it in real time, then export the
same package JSON a player app consumes.
