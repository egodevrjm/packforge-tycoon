import { describe, expect, it } from "vitest";
import { validateGamePack, validateGamePackage } from "@packforge/core";
import {
  defaultGamePackId,
  gamePackages,
  gamePacks,
  getGamePack,
  sampleGamePackage
} from "@packforge/packs";

describe("game pack registry", () => {
  it("exposes multiple selectable packs", () => {
    expect(gamePacks.length).toBe(10);
    expect(gamePacks.map((entry) => entry.pack.id)).toContain("game-studio");
    expect(gamePacks.map((entry) => entry.pack.id)).toContain("scrapyard");
    expect(gamePacks.map((entry) => entry.pack.id)).toContain("coffee-shop");
    expect(gamePacks.map((entry) => entry.pack.id)).toContain("space-colony");
    expect(gamePacks.map((entry) => entry.pack.id)).toContain("boutique-hotel");
    expect(gamePacks.map((entry) => entry.pack.id)).toContain("festival");
    expect(gamePacks.map((entry) => entry.pack.id)).toContain("theme-park");
    expect(gamePacks.map((entry) => entry.pack.id)).toContain("farm-market");
    expect(gamePacks.map((entry) => entry.pack.id)).toContain("movie-studio");
    expect(gamePacks.map((entry) => entry.pack.id)).toContain("aquarium");
  });

  it("only registers valid packs", () => {
    for (const entry of gamePacks) {
      const result = validateGamePack(entry.pack);
      expect(result.errors, entry.pack.id).toEqual([]);
    }
  });

  it("ships authored management systems for every selectable pack", () => {
    for (const entry of gamePacks) {
      expect(entry.pack.buildings.length, `${entry.pack.id} buildings`).toBeGreaterThanOrEqual(12);
      expect(entry.pack.contracts.length, `${entry.pack.id} contracts`).toBeGreaterThanOrEqual(16);
      expect(entry.pack.upgrades.length, `${entry.pack.id} upgrades`).toBeGreaterThanOrEqual(8);
      expect(entry.pack.projects?.length, `${entry.pack.id} projects`).toBeGreaterThanOrEqual(8);
      expect(entry.pack.markets?.length, `${entry.pack.id} markets`).toBeGreaterThan(0);
      expect(entry.pack.events?.length, `${entry.pack.id} events`).toBeGreaterThanOrEqual(12);
      expect(entry.pack.eras?.length, `${entry.pack.id} eras`).toBeGreaterThanOrEqual(5);
      expect(entry.pack.marketTrends?.length, `${entry.pack.id} trends`).toBeGreaterThanOrEqual(8);
      expect(entry.pack.eventDecks?.length, `${entry.pack.id} event decks`).toBeGreaterThanOrEqual(3);
      expect(entry.pack.staffRoles?.length, `${entry.pack.id} staff roles`).toBeGreaterThan(0);
      expect(entry.pack.staffCandidates?.length, `${entry.pack.id} staff candidates`).toBeGreaterThan(0);
      expect(entry.pack.staffTraits?.length, `${entry.pack.id} staff traits`).toBeGreaterThanOrEqual(5);
      expect(entry.pack.startingState.unlockedIds).toContain(entry.pack.projects?.[0]?.id);
    }
  });

  it("exports valid downloadable game packages", () => {
    expect(gamePackages).toContain(sampleGamePackage);
    for (const gamePackage of gamePackages) {
      const result = validateGamePackage(gamePackage);
      expect(result.errors, gamePackage.manifest.packageId).toEqual([]);
    }
  });

  it("falls back to the default pack for unknown ids", () => {
    expect(getGamePack("missing-pack").id).toBe(defaultGamePackId);
  });
});
