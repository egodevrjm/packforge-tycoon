import type { PackForgeGamePackage, PackForgePackageManifest } from "./types";
import { validateGamePack, type ValidationResult } from "./validation";

export const PACKFORGE_PACKAGE_SCHEMA_VERSION = "packforge.package.v1" as const;

export interface PackageValidationResult extends ValidationResult {
  packResults: Record<string, ValidationResult>;
}

const duplicateIds = (ids: string[]) => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.add(id);
    }
    seen.add(id);
  }
  return [...duplicates];
};

export const createGamePackage = (
  manifest: Omit<PackForgePackageManifest, "schemaVersion"> &
    Partial<Pick<PackForgePackageManifest, "schemaVersion">>,
  packs: PackForgeGamePackage["packs"]
): PackForgeGamePackage => ({
  manifest: {
    ...manifest,
    schemaVersion: PACKFORGE_PACKAGE_SCHEMA_VERSION
  },
  packs
});

export const validateGamePackage = (
  gamePackage: PackForgeGamePackage
): PackageValidationResult => {
  const errors: string[] = [];
  const packResults: Record<string, ValidationResult> = {};

  if (gamePackage.manifest.schemaVersion !== PACKFORGE_PACKAGE_SCHEMA_VERSION) {
    errors.push(`Unsupported package schema "${gamePackage.manifest.schemaVersion}".`);
  }
  if (!gamePackage.manifest.packageId) {
    errors.push("Package manifest must include a packageId.");
  }
  if (!gamePackage.manifest.displayName) {
    errors.push("Package manifest must include a displayName.");
  }
  if (!gamePackage.manifest.version) {
    errors.push("Package manifest must include a version.");
  }
  if (gamePackage.packs.length === 0) {
    errors.push("Package must include at least one game pack.");
  }

  const packIds = gamePackage.packs.map((pack) => pack.id);
  for (const id of duplicateIds(packIds)) {
    errors.push(`Game pack id "${id}" is duplicated in package.`);
  }
  if (!packIds.includes(gamePackage.manifest.entryPackId)) {
    errors.push(`Package entryPackId "${gamePackage.manifest.entryPackId}" does not match a pack.`);
  }

  for (const pack of gamePackage.packs) {
    const result = validateGamePack(pack);
    packResults[pack.id] = result;
    errors.push(...result.errors.map((error) => `${pack.id}: ${error}`));
  }

  return {
    ok: errors.length === 0,
    errors,
    packResults
  };
};

export const serializeGamePackage = (gamePackage: PackForgeGamePackage) =>
  JSON.stringify(gamePackage, null, 2);

export const deserializeGamePackage = (source: string): PackForgeGamePackage =>
  JSON.parse(source) as PackForgeGamePackage;

export const getEntryPack = (gamePackage: PackForgeGamePackage) =>
  gamePackage.packs.find((pack) => pack.id === gamePackage.manifest.entryPackId) ??
  gamePackage.packs[0];
