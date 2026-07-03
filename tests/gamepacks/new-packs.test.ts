import { describe, expect, it } from "vitest";
import { tycoonEngine, validateGamePack } from "@packforge/core";
import {
  aquariumPack,
  boutiqueHotelPack,
  coffeeShopPack,
  farmMarketPack,
  festivalPack,
  movieStudioPack,
  spaceColonyPack,
  themeParkPack
} from "@packforge/packs";

describe("new sample game packs", () => {
  it("registers Coffee Shop Tycoon as valid and immediately playable", () => {
    const result = validateGamePack(coffeeShopPack);
    expect(result.errors).toEqual([]);

    let state = tycoonEngine.createGame(coffeeShopPack);
    for (const buildingId of ["bean_crates", "sample_roaster", "counter_grinder", "espresso_bar"]) {
      const placed = tycoonEngine.dispatch(coffeeShopPack, state, {
        type: "placeBuilding",
        buildingId,
        x: state.buildings.length,
        y: 0
      });
      expect(placed.ok, placed.message).toBe(true);
      state = placed.state;
    }

    state = tycoonEngine.advance(coffeeShopPack, state, 35_000);
    expect(state.resources.espresso).toBeGreaterThan(0);
  });

  it("registers Space Colony Tycoon as valid and immediately playable", () => {
    const result = validateGamePack(spaceColonyPack);
    expect(result.errors).toEqual([]);

    let state = tycoonEngine.createGame(spaceColonyPack);
    for (const buildingId of ["solar_mast", "ice_drill", "water_processor"]) {
      const placed = tycoonEngine.dispatch(spaceColonyPack, state, {
        type: "placeBuilding",
        buildingId,
        x: state.buildings.length,
        y: 0
      });
      expect(placed.ok, placed.message).toBe(true);
      state = placed.state;
    }

    state = tycoonEngine.advance(spaceColonyPack, state, 35_000);
    expect(state.resources.water).toBeGreaterThan(0);
  });

  it("registers Boutique Hotel Tycoon as valid and immediately playable", () => {
    const result = validateGamePack(boutiqueHotelPack);
    expect(result.errors).toEqual([]);

    let state = tycoonEngine.createGame(boutiqueHotelPack);
    for (const [index, buildingId] of ["linen_closet", "starter_rooms", "front_desk"].entries()) {
      const placed = tycoonEngine.dispatch(boutiqueHotelPack, state, {
        type: "placeBuilding",
        buildingId,
        x: [0, 1, 3][index],
        y: 0
      });
      expect(placed.ok, placed.message).toBe(true);
      state = placed.state;
    }

    state = tycoonEngine.advance(boutiqueHotelPack, state, 35_000);
    expect(state.resources.service).toBeGreaterThan(0);
  });

  it("registers Festival Tycoon as valid and immediately playable", () => {
    const result = validateGamePack(festivalPack);
    expect(result.errors).toEqual([]);

    let state = tycoonEngine.createGame(festivalPack);
    for (const [index, buildingId] of ["artist_roster", "permit_clipboard", "community_stage"].entries()) {
      const placed = tycoonEngine.dispatch(festivalPack, state, {
        type: "placeBuilding",
        buildingId,
        x: [0, 1, 2][index],
        y: 0
      });
      expect(placed.ok, placed.message).toBe(true);
      state = placed.state;
    }

    state = tycoonEngine.advance(festivalPack, state, 35_000);
    expect(state.resources.stages).toBeGreaterThan(0);
  });

  it.each([
    {
      pack: themeParkPack,
      buildings: ["flat_ride", "snack_cart", "ticket_gate"],
      positions: [0, 2, 4],
      resource: "guests"
    },
    {
      pack: farmMarketPack,
      buildings: ["seed_table", "garden_beds", "stall_row"],
      positions: [0, 2, 4],
      resource: "harvest"
    },
    {
      pack: movieStudioPack,
      buildings: ["writers_table", "prop_corner", "casting_sofa", "camera_rig"],
      positions: [0, 1, 3, 4],
      resource: "footage"
    },
    {
      pack: aquariumPack,
      buildings: ["tank_room", "water_lab", "quarantine_bay", "reef_gallery"],
      positions: [0, 2, 3, 5],
      resource: "exhibits"
    }
  ])("registers $pack.theme.title as valid and immediately playable", ({ pack, buildings, positions, resource }) => {
    const result = validateGamePack(pack);
    expect(result.errors).toEqual([]);

    let state = tycoonEngine.createGame(pack);
    for (const [index, buildingId] of buildings.entries()) {
      const placed = tycoonEngine.dispatch(pack, state, {
        type: "placeBuilding",
        buildingId,
        x: positions[index],
        y: 0
      });
      expect(placed.ok, placed.message).toBe(true);
      state = placed.state;
    }

    state = tycoonEngine.advance(pack, state, 45_000);
    expect(state.resources[resource]).toBeGreaterThan(0);
  });
});
