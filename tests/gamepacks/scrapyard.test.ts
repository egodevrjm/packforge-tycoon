import { describe, expect, it } from "vitest";
import { validateGamePack } from "@packforge/core";
import { scrapyardPack } from "@packforge/packs/scrapyard";

describe("scrapyard game pack", () => {
  it("is internally valid data", () => {
    const result = validateGamePack(scrapyardPack);
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("has a bigger prototype amount of content", () => {
    expect(scrapyardPack.resources.length).toBeGreaterThanOrEqual(10);
    expect(scrapyardPack.resources.length).toBeLessThanOrEqual(12);
    expect(scrapyardPack.buildings.length).toBeGreaterThanOrEqual(10);
    expect(scrapyardPack.buildings.length).toBeLessThanOrEqual(14);
    expect(scrapyardPack.contracts.length).toBeGreaterThanOrEqual(12);
    expect(scrapyardPack.contracts.length).toBeLessThanOrEqual(16);
    expect(scrapyardPack.upgrades.length).toBeGreaterThanOrEqual(8);
    expect(scrapyardPack.upgrades.length).toBeLessThanOrEqual(10);
  });

  it("keeps the starting yard immediately playable", () => {
    expect(scrapyardPack.startingState.cash).toBeGreaterThan(0);
    expect(scrapyardPack.startingState.resources.scrap).toBeGreaterThan(0);
    expect(scrapyardPack.startingState.unlockedIds).toContain("junk_pile");
    expect(scrapyardPack.startingState.unlockedIds).toContain("sorting_table");
    expect(scrapyardPack.startingState.unlockedIds).toContain("first_sort");
  });
});
