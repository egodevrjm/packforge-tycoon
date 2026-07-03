# PackForge Packages

PackForge is split into SDK-style packages:

- `@packforge/core`: renderer-independent tycoon simulation, types, validation, and package JSON import/export.
- `@packforge/packs`: sample downloadable game packages used by the demo player.
- `@packforge/builder-kit`: helpers intended for a future visual gameworld builder.

The browser app in `src/` imports these packages through the same public aliases that an
external game or builder would use.
