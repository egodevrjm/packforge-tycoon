import { buildingPurchaseCost, tycoonEngine } from "@packforge/core";
import { clearSave, loadGame, saveGame } from "./storage";
import type {
  BuildingDefinition,
  ContractDefinition,
  EventDefinition,
  FounderProfile,
  GameCommand,
  PackActionDefinition,
  ProjectDefinition,
  SimulationState,
  StaffCandidateDefinition,
  TycoonGamePack,
  UpgradeDefinition
} from "@packforge/core";

export type ToolSelection =
  | { type: "build"; buildingId: string }
  | { type: "remove" }
  | { type: "inspect" };

export interface GameSnapshot {
  pack: TycoonGamePack;
  state: SimulationState;
  selection: ToolSelection;
  message: string;
}

type Listener = (snapshot: GameSnapshot) => void;

const packTerms = (pack: TycoonGamePack) =>
  ({
    "game-studio": {
      place: "studio",
      station: "stations",
      contract: "jobs",
      action: "Studio action"
    },
    "coffee-shop": {
      place: "shop",
      station: "stations",
      contract: "orders",
      action: "Shop action"
    },
    "space-colony": {
      place: "colony",
      station: "systems",
      contract: "milestones",
      action: "Colony action"
    },
    scrapyard: {
      place: "yard",
      station: "stations",
      contract: "contracts",
      action: "Yard action"
    }
  })[pack.id] ?? {
    place: "business",
    station: "stations",
    contract: "contracts",
    action: "Business action"
  };

export class GameController {
  private state: SimulationState;
  private selection: ToolSelection;
  private listeners = new Set<Listener>();
  private message: string;
  private saveTimer = 0;
  private notifyTimer = 0;

  constructor(private readonly pack: TycoonGamePack, profile?: Partial<FounderProfile>) {
    this.state = profile ? tycoonEngine.createGame(pack, profile) : (loadGame(pack) ?? tycoonEngine.createGame(pack));
    if (profile) {
      saveGame(pack, this.state);
    }
    this.selection = { type: "inspect" };
    const terms = packTerms(pack);
    this.message = `Run the ${terms.place} from the command panels. Buy ${terms.station}, assign staff, and deliver ${terms.contract}.`;
  }

  getSnapshot(): GameSnapshot {
    return {
      pack: this.pack,
      state: this.state,
      selection: this.selection,
      message: this.message
    };
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  setSelection(selection: ToolSelection) {
    this.selection = selection;
    const terms = packTerms(this.pack);
    this.message =
      selection.type === "build"
        ? `Choose a spot in the ${terms.place} to place it.`
        : selection.type === "remove"
          ? "Choose something to sell it for half price."
          : `The ${terms.place} view is visual feedback. Manage the business from the command panels.`;
    this.notify();
  }

  dispatch(command: GameCommand) {
    const result = tycoonEngine.dispatch(this.pack, this.state, command);
    this.state = result.state;
    this.message = result.message ?? this.successMessage(command);
    if (result.ok) {
      this.persistSoon();
    }
    this.notify();
    return result;
  }

  buyStation(buildingId: string) {
    const building = this.pack.buildings.find((item) => item.id === buildingId);
    if (!building) {
      this.message = "Unknown station.";
      this.notify();
      return { ok: false, state: this.state, message: this.message };
    }
    const purchaseCost = buildingPurchaseCost(this.state, building);
    if (this.state.cash < purchaseCost) {
      this.message = "Not enough cash.";
      this.notify();
      return { ok: false, state: this.state, message: this.message };
    }

    for (let y = 0; y <= this.state.grid.height - building.size.height; y += 1) {
      for (let x = 0; x <= this.state.grid.width - building.size.width; x += 1) {
        const result = tycoonEngine.dispatch(this.pack, this.state, {
          type: "placeBuilding",
          buildingId,
          x,
          y
        });
        if (result.ok) {
          this.state = result.state;
          this.message = `${building.name} added to the ${packTerms(this.pack).place}.`;
          this.persistSoon();
          this.notify();
          return result;
        }
      }
    }

    this.message = `No open ${packTerms(this.pack).place} space. Buy an expansion upgrade.`;
    this.notify();
    return { ok: false, state: this.state, message: this.message };
  }

  advance(deltaMs: number) {
    this.state = tycoonEngine.advance(this.pack, this.state, deltaMs);
    this.saveTimer += deltaMs;
    this.notifyTimer += deltaMs;
    if (this.saveTimer > 2500) {
      this.saveTimer = 0;
      saveGame(this.pack, this.state);
    }
    if (this.notifyTimer > 180) {
      this.notifyTimer = 0;
      this.notify();
    }
  }

  reset() {
    clearSave(this.pack);
    this.state = tycoonEngine.createGame(this.pack, this.state.profile);
    this.selection = { type: "inspect" };
    const terms = packTerms(this.pack);
    this.message = `Fresh ${terms.place}. Buy ${terms.station}, assign staff, and choose your first ${terms.contract.slice(0, -1)}.`;
    this.notify();
  }

  saveNow() {
    saveGame(this.pack, this.state);
    this.message = `${packTerms(this.pack).place} saved.`;
    this.notify();
  }

  availableBuildings(): BuildingDefinition[] {
    return this.pack.buildings.filter((building) => this.state.unlockedIds.includes(building.id));
  }

  availableContracts(): ContractDefinition[] {
    return this.pack.contracts.filter((contract) => this.state.unlockedIds.includes(contract.id));
  }

  availableUpgrades(): UpgradeDefinition[] {
    return this.pack.upgrades.filter((upgrade) => this.state.unlockedIds.includes(upgrade.id));
  }

  availableActions(): PackActionDefinition[] {
    return (this.pack.actions ?? []).filter((action) => this.state.unlockedIds.includes(action.id));
  }

  availableProjects(): ProjectDefinition[] {
    if (this.pack.projects?.length) {
      return this.pack.projects.filter((project) => this.state.unlockedIds.includes(project.id));
    }
    const categories = [...new Set(this.pack.buildings.map((building) => building.category))].slice(0, 5);
    return [
      {
        id: "starter_project",
        name:
          this.pack.id === "game-studio"
            ? "Untitled Game"
            : this.pack.id === "coffee-shop"
              ? "Morning Rush"
              : this.pack.id === "space-colony"
                ? "Starter Mission"
                : "Local Job",
        description: this.pack.theme.subtitle,
        phases: categories.map((category, index) => ({
          id: category,
          name: category.charAt(0).toUpperCase() + category.slice(1),
          durationMs: 4_000 + index * 1_000,
          risk: index === 0 ? 0 : 2
        })),
        rewardCash: this.pack.contracts[0]?.rewardCash ?? 100
      }
    ];
  }

  activeEvents(): EventDefinition[] {
    return this.state.activeEvents
      .map((active) => (this.pack.events ?? []).find((event) => event.id === active.eventId))
      .filter((event): event is EventDefinition => event !== undefined);
  }

  staffCandidates(): StaffCandidateDefinition[] {
    return this.state.staff.candidates;
  }

  private notify() {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }

  private persistSoon() {
    saveGame(this.pack, this.state);
  }

  private successMessage(command: GameCommand) {
    if (command.type === "placeBuilding") {
      return "Machine placed.";
    }
    if (command.type === "removeBuilding") {
      return "Machine sold for scrap cash.";
    }
    if (command.type === "startContract") {
      return "Contract pinned to the board.";
    }
    if (command.type === "claimContract") {
      return "Contract delivered. Cash and unlocks added.";
    }
    if (command.type === "buyUpgrade") {
      return "Upgrade installed.";
    }
    if (command.type === "hireWorker") {
      return "Worker hired. Assign them to a department.";
    }
    if (command.type === "assignWorker") {
      return "Staff assignment updated.";
    }
    if (command.type === "runAction") {
      return `${packTerms(this.pack).action} started.`;
    }
    if (command.type === "startProject") {
      return "Project started. Build quality through each phase.";
    }
    if (command.type === "advanceProjectPhase") {
      return "Project moved into the next phase.";
    }
    if (command.type === "releaseProject") {
      return "Project released. Market results added.";
    }
    if (command.type === "cancelProject") {
      return "Project cancelled.";
    }
    if (command.type === "hireCandidate") {
      return "Candidate hired. Assign them to a department.";
    }
    if (command.type === "assignStaff") {
      return "Staff assignment updated.";
    }
    if (command.type === "trainStaff") {
      return "Staff training complete.";
    }
    if (command.type === "restStaff") {
      return "Staff morale recovered.";
    }
    if (command.type === "resolveEvent") {
      return "Event resolved.";
    }
    return this.message;
  }
}
