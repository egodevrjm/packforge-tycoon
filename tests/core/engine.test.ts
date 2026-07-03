import { describe, expect, it } from "vitest";
import { buildingPurchaseCost, tycoonEngine, type TycoonGamePack } from "@packforge/core";
import { gameStudioPack } from "@packforge/packs/game-studio";
import { scrapyardPack } from "@packforge/packs/scrapyard";

const place = (buildingId: string, x: number, y: number) =>
  ({ type: "placeBuilding" as const, buildingId, x, y });

describe("tycoonEngine", () => {
  it("places unlocked buildings, charges cash, and rejects overlaps", () => {
    const state = tycoonEngine.createGame(scrapyardPack);
    const placed = tycoonEngine.dispatch(scrapyardPack, state, place("junk_pile", 0, 0));

    expect(placed.ok).toBe(true);
    expect(placed.state.buildings).toHaveLength(1);
    expect(placed.state.cash).toBe(220);

    const overlap = tycoonEngine.dispatch(scrapyardPack, placed.state, place("sorting_table", 1, 1));
    expect(overlap.ok).toBe(false);
    expect(overlap.message).toMatch(/occupied/i);
  });

  it("scales station purchase cost after the first free starter station", () => {
    let state = tycoonEngine.createGame(scrapyardPack);
    const junkPile = scrapyardPack.buildings.find((building) => building.id === "junk_pile");
    expect(junkPile).toBeDefined();
    expect(buildingPurchaseCost(state, junkPile!)).toBe(0);

    const first = tycoonEngine.dispatch(scrapyardPack, state, place("junk_pile", 0, 0));
    expect(first.ok, first.message).toBe(true);
    state = first.state;

    const secondCost = buildingPurchaseCost(state, junkPile!);
    expect(secondCost).toBeGreaterThan(0);

    const second = tycoonEngine.dispatch(scrapyardPack, state, place("junk_pile", 2, 0));
    expect(second.ok, second.message).toBe(true);
    expect(second.state.cash).toBe(state.cash - secondCost);
  });

  it("creates an owned company profile with difficulty and a first staff assignment", () => {
    const standard = tycoonEngine.createGame(gameStudioPack);
    const founded = tycoonEngine.createGame(gameStudioPack, {
      companyName: "Nova Byte",
      founderName: "Riley",
      logoIcon: "bolt",
      logoColor: "#8b5cf6",
      logoShape: "shield",
      logoPattern: "grid",
      difficulty: "hard",
      firstDepartment: "design"
    });

    expect(founded.profile.companyName).toBe("Nova Byte");
    expect(founded.profile.founderName).toBe("Riley");
    expect(founded.profile.logoIcon).toBe("bolt");
    expect(founded.profile.logoShape).toBe("shield");
    expect(founded.profile.logoPattern).toBe("grid");
    expect(founded.cash).toBeLessThan(standard.cash);
    expect(founded.resources.ideas).toBeLessThan(standard.resources.ideas);
    expect(founded.staff.unassigned).toBe(0);
    expect(founded.staff.assignments.design).toBe(1);
  });

  it("advances recipes without importing renderer state", () => {
    let state = tycoonEngine.createGame(scrapyardPack);
    state = tycoonEngine.dispatch(scrapyardPack, state, place("junk_pile", 0, 0)).state;
    state = tycoonEngine.dispatch(scrapyardPack, state, place("sorting_table", 3, 0)).state;

    const advanced = tycoonEngine.advance(scrapyardPack, state, 10_000);

    expect(advanced.resources.scrap).toBeGreaterThan(state.resources.scrap);
    expect(advanced.resources.sorted_metal).toBeGreaterThan(0);
    expect(advanced.resources.plastic_bits).toBeGreaterThan(0);
  });

  it("starts and claims contracts when resources are available", () => {
    let state = tycoonEngine.createGame(scrapyardPack);
    state = {
      ...state,
      resources: { ...state.resources, sorted_metal: 8 }
    };
    state = tycoonEngine.dispatch(scrapyardPack, state, {
      type: "startContract",
      contractId: "first_sort"
    }).state;

    const result = tycoonEngine.dispatch(scrapyardPack, state, {
      type: "claimContract",
      contractId: "first_sort"
    });

    expect(result.ok).toBe(true);
    expect(result.state.cash).toBe(310);
    expect(result.state.resources.sorted_metal).toBe(0);
    expect(result.state.completedContracts).toContain("first_sort");
    expect(result.state.unlockedIds).toContain("crusher");
    expect(result.state.unlockedIds).toContain("more_scrap");
  });

  it("buys upgrades and expands the saveable grid", () => {
    let state = tycoonEngine.createGame(scrapyardPack);
    state = {
      ...state,
      cash: 1_000,
      unlockedIds: [...state.unlockedIds, "yard_expansion_1"]
    };

    const result = tycoonEngine.dispatch(scrapyardPack, state, {
      type: "buyUpgrade",
      upgradeId: "yard_expansion_1"
    });

    expect(result.ok).toBe(true);
    expect(result.state.grid.width).toBe(14);
    expect(result.state.grid.height).toBe(10);
    expect(result.state.purchasedUpgrades).toContain("yard_expansion_1");
  });

  it("round-trips save data without renderer objects", () => {
    let state = tycoonEngine.createGame(scrapyardPack);
    state = tycoonEngine.dispatch(scrapyardPack, state, place("wire_picker", 0, 0)).state;
    const restored = tycoonEngine.deserialize(scrapyardPack, tycoonEngine.serialize(state));

    expect(restored).toEqual(state);
    expect(JSON.stringify(restored)).not.toContain("Phaser");
  });

  it("hires and assigns staff to speed up a department", () => {
    let state = tycoonEngine.createGame(scrapyardPack);
    state = { ...state, cash: 500 };

    const hired = tycoonEngine.dispatch(scrapyardPack, state, { type: "hireWorker" });
    expect(hired.ok).toBe(true);
    expect(hired.state.staff.unassigned).toBe(2);

    const assigned = tycoonEngine.dispatch(scrapyardPack, hired.state, {
      type: "assignWorker",
      category: "source",
      delta: 1
    });
    expect(assigned.ok).toBe(true);
    expect(assigned.state.staff.unassigned).toBe(1);
    expect(assigned.state.staff.assignments.source).toBe(1);
  });

  it("runs pack actions with costs, cooldowns, and production boosts", () => {
    let state = tycoonEngine.createGame(gameStudioPack);

    const brainstorm = tycoonEngine.dispatch(gameStudioPack, state, {
      type: "runAction",
      actionId: "brainstorm_jam"
    });

    expect(brainstorm.ok).toBe(true);
    expect(brainstorm.state.cash).toBe(220);
    expect(brainstorm.state.resources.ideas).toBe(24);
    expect(brainstorm.state.actionCooldowns.brainstorm_jam).toBe(12_000);

    const blocked = tycoonEngine.dispatch(gameStudioPack, brainstorm.state, {
      type: "runAction",
      actionId: "brainstorm_jam"
    });
    expect(blocked.ok).toBe(false);
    expect(blocked.message).toMatch(/cooling down/i);

    state = tycoonEngine.dispatch(gameStudioPack, brainstorm.state, {
      type: "runAction",
      actionId: "design_sprint"
    }).state;
    expect(state.activeBoosts).toContainEqual(
      expect.objectContaining({ actionId: "design_sprint", category: "design", multiplier: 2 })
    );

    const advanced = tycoonEngine.advance(gameStudioPack, state, 16_000);
    expect(advanced.actionCooldowns.design_sprint).toBeLessThan(state.actionCooldowns.design_sprint);
    expect(advanced.activeBoosts.find((boost) => boost.actionId === "design_sprint")).toBeUndefined();
  });

  it("runs a project through phases and releases with market scoring", () => {
    let state = tycoonEngine.createGame(gameStudioPack);

    const started = tycoonEngine.dispatch(gameStudioPack, state, {
      type: "startProject",
      projectId: gameStudioPack.projects?.[0]?.id ?? "starter_project",
      name: "Moon Beans"
    });
    expect(started.ok).toBe(true);
    expect(started.state.activeProject?.name).toBe("Moon Beans");

    state = tycoonEngine.advance(gameStudioPack, started.state, 8_000);
    expect(state.activeProject?.quality).toBeGreaterThan(0);

    const phaseCount =
      gameStudioPack.projects?.[0]?.phases.length ??
      Math.min(5, [...new Set(gameStudioPack.buildings.map((building) => building.category))].length);
    for (let phase = 1; phase < phaseCount; phase += 1) {
      const advanced = tycoonEngine.dispatch(gameStudioPack, state, {
        type: "advanceProjectPhase"
      });
      expect(advanced.ok, advanced.message).toBe(true);
      expect(advanced.state.activeProject?.phaseIndex).toBe(phase);
      state = tycoonEngine.advance(gameStudioPack, advanced.state, 10_000);
    }

    const released = tycoonEngine.dispatch(gameStudioPack, state, { type: "releaseProject" });
    expect(released.ok, released.message).toBe(true);
    expect(released.state.activeProject).toBeUndefined();
    expect(released.state.completedProjects[0].score).toBeGreaterThan(0);
    expect(released.state.cash).toBeGreaterThan(state.cash);
  });

  it("hires named candidates, assigns by staff id, trains, and rests them", () => {
    let state = tycoonEngine.createGame(gameStudioPack);
    state = { ...state, cash: 1_000 };
    const candidate = state.staff.candidates[0];

    const hired = tycoonEngine.dispatch(gameStudioPack, state, {
      type: "hireCandidate",
      candidateId: candidate.id
    });
    expect(hired.ok).toBe(true);
    const newHire = hired.state.staff.members.find((member) => member.name === candidate.name);
    expect(newHire).toBeDefined();
    expect(hired.state.staff.candidates.map((item) => item.id)).not.toContain(candidate.id);

    const assigned = tycoonEngine.dispatch(gameStudioPack, hired.state, {
      type: "assignStaff",
      staffId: newHire?.id ?? "",
      category: "design"
    });
    expect(assigned.ok).toBe(true);
    expect(assigned.state.staff.assignments.design).toBe(1);

    const trained = tycoonEngine.dispatch(gameStudioPack, assigned.state, {
      type: "trainStaff",
      staffId: newHire?.id ?? ""
    });
    expect(trained.ok).toBe(true);
    expect(trained.state.staff.members.find((member) => member.id === newHire?.id)?.level).toBe(2);

    const rested = tycoonEngine.dispatch(gameStudioPack, trained.state, {
      type: "restStaff",
      staffId: newHire?.id ?? ""
    });
    expect(rested.ok).toBe(true);
    expect(rested.state.staff.members.find((member) => member.id === newHire?.id)?.morale).toBeGreaterThan(
      trained.state.staff.members.find((member) => member.id === newHire?.id)?.morale ?? 0
    );
  });

  it("triggers and resolves data-driven events", () => {
    const eventPack: TycoonGamePack = {
      ...gameStudioPack,
      events: [
        {
          id: "press-call",
          name: "Press Call",
          description: "A journalist wants a quick interview.",
          trigger: { elapsedMs: 1_000 },
          choices: [
            {
              id: "take-call",
              label: "Take the call",
              description: "Spend time with press.",
              effect: { cash: 15, resources: { hype: 3 }, morale: -2 }
            }
          ]
        }
      ]
    };
    let state = tycoonEngine.createGame(eventPack);
    state = tycoonEngine.advance(eventPack, state, 1_200);
    expect(state.activeEvents).toContainEqual(expect.objectContaining({ eventId: "press-call" }));

    const resolved = tycoonEngine.dispatch(eventPack, state, {
      type: "resolveEvent",
      eventId: "press-call",
      choiceId: "take-call"
    });
    expect(resolved.ok).toBe(true);
    expect(resolved.state.resources.hype).toBe(3);
    expect(resolved.state.resolvedEvents).toContain("press-call");
  });

  it("advances eras, activates market trends, and draws event decks", () => {
    const depthPack: TycoonGamePack = {
      ...gameStudioPack,
      eras: [
        {
          id: "starter",
          name: "Starter",
          description: "Opening era."
        },
        {
          id: "growth",
          name: "Growth",
          description: "A larger era.",
          requires: { elapsedMs: 1_000 },
          rewardCash: 50,
          unlockIds: ["design_corner"]
        }
      ],
      marketTrends: [
        {
          id: "cozy-trend",
          name: "Cozy Trend",
          description: "Players want cozy work.",
          startsAtMs: 1_000,
          durationMs: 4_000,
          rewardMultiplier: 1.2
        }
      ],
      events: [
        {
          id: "deck-event",
          name: "Deck Event",
          description: "An event from a deck.",
          deckId: "ops",
          repeatable: true,
          trigger: {},
          choices: [
            {
              id: "take",
              label: "Take",
              description: "Take it.",
              effect: { cash: 5 }
            }
          ]
        }
      ],
      eventDecks: [
        {
          id: "ops",
          name: "Ops",
          description: "Operations events.",
          intervalMs: 1_000,
          eventIds: ["deck-event"]
        }
      ]
    };

    const state = tycoonEngine.advance(depthPack, tycoonEngine.createGame(depthPack), 1_200);

    expect(state.currentEraId).toBe("growth");
    expect(state.cash).toBeGreaterThan(tycoonEngine.createGame(depthPack).cash);
    expect(state.unlockedIds).toContain("design_corner");
    expect(state.activeTrends).toContainEqual(expect.objectContaining({ trendId: "cozy-trend" }));
    expect(state.activeEvents).toContainEqual(expect.objectContaining({ eventId: "deck-event" }));
  });

  it("wraps new saves, migrates old saves, and rejects future save schemas", () => {
    const state = tycoonEngine.createGame(scrapyardPack);
    const saved = tycoonEngine.serialize(state);
    expect(saved).toContain("packforge.save.v1");
    expect(tycoonEngine.deserialize(scrapyardPack, saved)).toEqual(state);

    const oldSave = JSON.stringify({
      grid: state.grid,
      buildings: [],
      resources: state.resources,
      cash: state.cash,
      profile: state.profile,
      staff: {
        unassigned: 1,
        assignments: {},
        totalHired: 1
      },
      activeContracts: [],
      completedContracts: [],
      purchasedUpgrades: [],
      unlockedIds: state.unlockedIds,
      actionCooldowns: {},
      activeBoosts: [],
      elapsedMs: 0,
      nextBuildingNumber: 1
    });
    const migrated = tycoonEngine.deserialize(scrapyardPack, oldSave);
    expect(migrated.packId).toBe(scrapyardPack.id);
    expect(migrated.staff.members).toHaveLength(1);

    expect(() =>
      tycoonEngine.deserialize(
        scrapyardPack,
        JSON.stringify({ schemaVersion: "packforge.save.v99", packId: scrapyardPack.id, state })
      )
    ).toThrow(/unsupported save schema/i);
  });
});
