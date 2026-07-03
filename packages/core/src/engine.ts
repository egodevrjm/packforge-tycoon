import type {
  ActiveEvent,
  ActiveProject,
  BuildingDefinition,
  CommandResult,
  EventDefinition,
  EventDeckDefinition,
  FounderProfile,
  GameCommand,
  ManagementEffect,
  MarketDefinition,
  MarketTrendDefinition,
  PlacedBuilding,
  ProjectDefinition,
  ProjectPhaseDefinition,
  RecipeDefinition,
  ResourceBag,
  SimulationEngine,
  SimulationState,
  StaffCandidateDefinition,
  StaffMember,
  StaffRoleDefinition,
  StaffTraitDefinition,
  WrappedSimulationSave,
  TycoonGamePack
} from "./types";

export const PACKFORGE_SAVE_SCHEMA_VERSION = "packforge.save.v1" as const;
export const PACKFORGE_ENGINE_VERSION = "0.2.0";

const copyBag = (bag: ResourceBag): ResourceBag => ({ ...bag });

const defaultProfileFor = (pack: TycoonGamePack): FounderProfile => ({
  companyName: pack.id === "game-studio" ? "Tiny Cartridge Studio" : "First Light Yard",
  founderName: "Alex",
  logoIcon: pack.theme.visual?.icon ?? "station",
  logoColor: pack.theme.ui?.accent ?? pack.theme.palette.accent,
  logoShape: "squircle",
  logoPattern: "shine",
  difficulty: "standard"
});

const applyDifficultyToCash = (cash: number, difficulty: FounderProfile["difficulty"]) => {
  if (difficulty === "relaxed") {
    return cash + 120;
  }
  if (difficulty === "hard") {
    return Math.max(40, Math.floor(cash * 0.72));
  }
  return cash;
};

const applyDifficultyToResources = (
  resources: ResourceBag,
  difficulty: FounderProfile["difficulty"]
) => {
  if (difficulty === "standard") {
    return resources;
  }
  const factor = difficulty === "relaxed" ? 1.25 : 0.75;
  return Object.fromEntries(
    Object.entries(resources).map(([id, amount]) => [id, Math.max(0, Math.floor(amount * factor))])
  );
};

const addToBag = (bag: ResourceBag, change: ResourceBag, factor = 1) => {
  for (const [resourceId, amount] of Object.entries(change)) {
    bag[resourceId] = Math.max(0, (bag[resourceId] ?? 0) + amount * factor);
  }
};

const hasResources = (bag: ResourceBag, cost: ResourceBag) =>
  Object.entries(cost).every(([resourceId, amount]) => (bag[resourceId] ?? 0) >= amount);

const categoriesFor = (pack: TycoonGamePack) => [
  ...new Set(pack.buildings.map((building) => building.category))
];

const titleCase = (value: string) =>
  value
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const defaultMarketsFor = (pack: TycoonGamePack): MarketDefinition[] =>
  pack.markets?.length
    ? pack.markets
    : [
        {
          id: "mainstream",
          name: `${pack.theme.title} Market`,
          description: "The default audience for this tycoon pack.",
          demand: 1,
          rewardMultiplier: 1,
          qualityMultiplier: 1
        }
      ];

const defaultErasFor = (pack: TycoonGamePack) =>
  pack.eras?.length
    ? pack.eras
    : [
        {
          id: "starter",
          name: "Starter",
          description: `The first scrappy stage of ${pack.theme.title}.`,
          requires: {},
          unlockIds: pack.startingState.unlockedIds
        }
      ];

const defaultTrendsFor = (pack: TycoonGamePack): MarketTrendDefinition[] =>
  pack.marketTrends?.length
    ? pack.marketTrends
    : [
        {
          id: "opening-momentum",
          name: "Opening Momentum",
          description: "Early attention gives the business a small lift.",
          startsAtMs: 18_000,
          durationMs: 45_000,
          rewardMultiplier: 1.05,
          qualityMultiplier: 1.05
        }
      ];

const defaultEventDecksFor = (pack: TycoonGamePack): EventDeckDefinition[] =>
  pack.eventDecks?.length
    ? pack.eventDecks
    : pack.events?.length
      ? [
          {
            id: "operations",
            name: "Operations",
            description: "Routine opportunities and problems.",
            intervalMs: 28_000,
            maxActive: 2,
            eventIds: pack.events.map((event) => event.id)
          }
        ]
      : [];

const defaultTraitsFor = (pack: TycoonGamePack): StaffTraitDefinition[] =>
  pack.staffTraits?.length
    ? pack.staffTraits
    : [
        {
          id: "founder",
          name: "Founder",
          description: "A flexible generalist who cares about the whole business.",
          productionBonus: 0.08,
          projectQualityBonus: 1,
          riskModifier: -1,
          moraleDrainModifier: -0.2
        },
        {
          id: "steady",
          name: "Steady",
          description: "Reliable under pressure.",
          productionBonus: 0.06,
          riskModifier: -1
        },
        {
          id: "quick",
          name: "Quick",
          description: "Moves fast, especially on routine work.",
          productionBonus: 0.1,
          moraleDrainModifier: 0.1
        },
        {
          id: "organized",
          name: "Organized",
          description: "Reduces project mess and operational risk.",
          productionBonus: 0.04,
          riskModifier: -2
        },
        {
          id: "creative",
          name: "Creative",
          description: "Adds quality to projects.",
          projectQualityBonus: 2,
          riskModifier: 1
        }
      ];

const defaultProjectNameFor = (pack: TycoonGamePack) =>
  ({
    "game-studio": "Untitled Game",
    "coffee-shop": "Morning Rush",
    "space-colony": "Starter Mission",
    scrapyard: "Local Job"
  })[pack.id] ?? "First Project";

const defaultProjectsFor = (pack: TycoonGamePack): ProjectDefinition[] => {
  if (pack.projects?.length) {
    return pack.projects;
  }
  const categories = categoriesFor(pack).slice(0, 5);
  const phases = (categories.length > 0 ? categories : ["production"]).map<ProjectPhaseDefinition>(
    (category, index) => ({
      id: category,
      name: titleCase(category),
      durationMs: 4_000 + index * 1_000,
      qualityFromResources: {},
      risk: index === 0 ? 0 : 2
    })
  );
  const firstContract = pack.contracts[0];
  return [
    {
      id: "starter_project",
      name: defaultProjectNameFor(pack),
      description: `A self-directed ${pack.theme.title.toLowerCase()} project.`,
      phases,
      rewardCash: firstContract?.rewardCash ?? 100,
      unlockIds: firstContract?.unlockIds ?? [],
      marketId: defaultMarketsFor(pack)[0]?.id
    }
  ];
};

const defaultRolesFor = (pack: TycoonGamePack): StaffRoleDefinition[] =>
  pack.staffRoles?.length
    ? pack.staffRoles
    : categoriesFor(pack).map((category) => ({
        id: category,
        name: `${titleCase(category)} Specialist`,
        category,
        baseWage: 0.12,
        description: `Improves ${titleCase(category)} work.`
      }));

const defaultCandidatesFor = (pack: TycoonGamePack): StaffCandidateDefinition[] => {
  if (pack.staffCandidates?.length) {
    return pack.staffCandidates;
  }
  const roles = defaultRolesFor(pack);
  return roles.slice(0, 4).map((role, index) => ({
    id: `candidate-${role.id}`,
    name: ["Sam Rivera", "Mo Chen", "Jules Carter", "Priya Stone"][index] ?? `${role.name} Hire`,
    roleId: role.id,
    hireCost: 120 + index * 45,
    level: 1,
    traits: index % 2 === 0 ? ["steady"] : ["quick"],
    morale: 72
  }));
};

const roleFor = (pack: TycoonGamePack, roleId: string) =>
  defaultRolesFor(pack).find((role) => role.id === roleId);

const traitFor = (pack: TycoonGamePack, traitId: string) =>
  defaultTraitsFor(pack).find((trait) => trait.id === traitId);

const starterStaffFor = (pack: TycoonGamePack, profile: FounderProfile): StaffMember => {
  const roles = defaultRolesFor(pack);
  const requestedRole =
    roles.find((role) => role.category === profile.firstDepartment) ?? roles[0];
  const category = profile.firstDepartment ?? requestedRole?.category ?? "production";
  return {
    id: "staff-1",
    name: profile.founderName || "Founder",
    roleId: requestedRole?.id ?? category,
    category,
    level: 1,
    traits: ["founder"],
    morale: 80,
    wage: requestedRole?.baseWage ?? 0.12,
    assignment: profile.firstDepartment
  };
};

const cloneState = (state: SimulationState): SimulationState => ({
  ...state,
  grid: { ...state.grid },
  buildings: state.buildings.map((building) => ({ ...building })),
  resources: copyBag(state.resources),
  profile: { ...state.profile },
  staff: {
    unassigned: state.staff?.unassigned ?? 0,
    assignments: { ...(state.staff?.assignments ?? {}) },
    totalHired: state.staff?.totalHired ?? 0,
    members: (state.staff?.members ?? []).map((member) => ({ ...member, traits: [...member.traits] })),
    candidates: (state.staff?.candidates ?? []).map((candidate) => ({
      ...candidate,
      traits: [...candidate.traits]
    })),
    nextStaffNumber: state.staff?.nextStaffNumber ?? 1
  },
  activeProject: state.activeProject ? { ...state.activeProject } : undefined,
  completedProjects: (state.completedProjects ?? []).map((project) => ({ ...project })),
  currentEraId: state.currentEraId,
  reachedEraIds: [...(state.reachedEraIds ?? [])],
  activeTrends: (state.activeTrends ?? []).map((trend) => ({ ...trend })),
  resolvedTrends: [...(state.resolvedTrends ?? [])],
  eventDecks: Object.fromEntries(
    Object.entries(state.eventDecks ?? {}).map(([id, deck]) => [id, { ...deck }])
  ),
  activeEvents: (state.activeEvents ?? []).map((event) => ({ ...event })),
  resolvedEvents: [...(state.resolvedEvents ?? [])],
  activeContracts: [...state.activeContracts],
  completedContracts: [...state.completedContracts],
  purchasedUpgrades: [...state.purchasedUpgrades],
  unlockedIds: [...state.unlockedIds],
  actionCooldowns: { ...(state.actionCooldowns ?? {}) },
  activeBoosts: (state.activeBoosts ?? []).map((boost) => ({ ...boost }))
});

const byId = <T extends { id: string }>(items: T[], id: string) =>
  items.find((item) => item.id === id);

const isUnlocked = (state: SimulationState, id: string) => state.unlockedIds.includes(id);

const unlock = (state: SimulationState, ids: string[]) => {
  for (const id of ids) {
    if (!state.unlockedIds.includes(id)) {
      state.unlockedIds.push(id);
    }
  }
};

const productionMultiplierFor = (
  pack: TycoonGamePack,
  state: SimulationState,
  building: BuildingDefinition
) => {
  let multiplier = 1;
  for (const upgradeId of state.purchasedUpgrades) {
    const upgrade = byId(pack.upgrades, upgradeId);
    for (const effect of upgrade?.effect.productionMultipliers ?? []) {
      if (effect.category === building.category) {
        multiplier *= effect.multiplier;
      }
    }
  }
  for (const boost of state.activeBoosts ?? []) {
    if (boost.category === building.category && boost.remainingMs > 0) {
      multiplier *= boost.multiplier;
    }
  }
  const assignedMembers = state.staff.members.filter((member) => member.assignment === building.category);
  const staffBonus = assignedMembers.reduce((total, member) => {
    const traitBonus = member.traits.reduce((traitTotal, traitId) => {
      const trait = traitFor(pack, traitId);
      if (trait?.category && trait.category !== building.category) {
        return traitTotal;
      }
      return traitTotal + (trait?.productionBonus ?? 0);
    }, 0);
    const moraleFactor = Math.max(0.35, member.morale / 100);
    return total + (0.16 + member.level * 0.08 + traitBonus) * moraleFactor;
  }, 0);
  multiplier *= 1 + staffBonus;
  return multiplier;
};

export const workerHireCost = (state: SimulationState) =>
  75 + (state.staff?.totalHired ?? 0) * 45;

export const buildingPurchaseCost = (state: SimulationState, building: BuildingDefinition) => {
  const owned = state.buildings.filter((placed) => placed.buildingId === building.id).length;
  if (owned === 0) {
    return building.cost;
  }
  const baseCost = Math.max(60, building.cost);
  return Math.ceil(baseCost * (1 + owned * 0.55));
};

export const staffWagePerSecond = (state: SimulationState) =>
  state.staff?.members?.length
    ? state.staff.members.reduce((total, member) => total + member.wage, 0)
    : (state.staff?.totalHired ?? 0) * 0.12;

const overlaps = (
  placed: PlacedBuilding,
  placedDef: BuildingDefinition,
  x: number,
  y: number,
  candidate: BuildingDefinition
) => {
  const leftA = placed.x;
  const rightA = placed.x + placedDef.size.width;
  const topA = placed.y;
  const bottomA = placed.y + placedDef.size.height;
  const leftB = x;
  const rightB = x + candidate.size.width;
  const topB = y;
  const bottomB = y + candidate.size.height;
  return leftA < rightB && rightA > leftB && topA < bottomB && bottomA > topB;
};

const canPlace = (
  pack: TycoonGamePack,
  state: SimulationState,
  building: BuildingDefinition,
  x: number,
  y: number
) => {
  if (x < 0 || y < 0 || x + building.size.width > state.grid.width) {
    return "That machine does not fit inside the available space.";
  }
  if (y + building.size.height > state.grid.height) {
    return "That machine does not fit inside the available space.";
  }
  for (const placed of state.buildings) {
    const placedDef = byId(pack.buildings, placed.buildingId);
    if (placedDef && overlaps(placed, placedDef, x, y, building)) {
      return "That tile is already occupied.";
    }
  }
  return undefined;
};

const runRecipeCycle = (
  resources: ResourceBag,
  recipe: RecipeDefinition,
  multiplier: number
) => {
  if (!hasResources(resources, recipe.inputs)) {
    return false;
  }
  addToBag(resources, recipe.inputs, -1);
  addToBag(resources, recipe.outputs, multiplier);
  return true;
};

const normalizeState = (pack: TycoonGamePack, state: Partial<SimulationState>): SimulationState => {
  const fresh = tycoonEngine.createGame(pack);
  const rawStaff = state.staff ?? fresh.staff;
  const members = rawStaff.members?.length
    ? rawStaff.members
    : Array.from({ length: rawStaff.totalHired ?? 0 }, (_, index) => {
        const categories = Object.entries(rawStaff.assignments ?? {});
        const assignedCategory = categories.find(([, count]) => count > index)?.[0];
        const role = defaultRolesFor(pack).find((item) => item.category === assignedCategory) ??
          defaultRolesFor(pack)[0];
        return {
          id: `staff-${index + 1}`,
          name: index === 0 ? (state.profile?.founderName ?? "Founder") : `Worker ${index + 1}`,
          roleId: role?.id ?? "production",
          category: role?.category ?? "production",
          level: 1,
          traits: index === 0 ? ["founder"] : ["steady"],
          morale: 75,
          wage: role?.baseWage ?? 0.12,
          assignment: assignedCategory
        };
      });
  return {
    ...fresh,
    ...state,
    grid: { ...fresh.grid, ...(state.grid ?? {}) },
    resources: { ...fresh.resources, ...(state.resources ?? {}) },
    profile: {
      ...fresh.profile,
      ...(state.profile ?? {})
    },
    staff: {
      unassigned: rawStaff.unassigned ?? members.filter((member) => !member.assignment).length,
      assignments: { ...(rawStaff.assignments ?? fresh.staff.assignments) },
      totalHired: rawStaff.totalHired ?? members.length,
      members: members.map((member) => ({ ...member, traits: [...member.traits] })),
      candidates: (rawStaff.candidates ?? fresh.staff.candidates).map((candidate) => ({
        ...candidate,
        traits: [...candidate.traits]
      })),
      nextStaffNumber: rawStaff.nextStaffNumber ?? members.length + 1
    },
    activeProject: state.activeProject ? { ...state.activeProject } : undefined,
    completedProjects: Array.isArray(state.completedProjects) ? state.completedProjects : [],
    currentEraId: state.currentEraId ?? fresh.currentEraId,
    reachedEraIds: Array.isArray(state.reachedEraIds) ? state.reachedEraIds : fresh.reachedEraIds,
    activeTrends: Array.isArray(state.activeTrends) ? state.activeTrends : fresh.activeTrends,
    resolvedTrends: Array.isArray(state.resolvedTrends) ? state.resolvedTrends : fresh.resolvedTrends,
    eventDecks: state.eventDecks ?? fresh.eventDecks,
    activeEvents: Array.isArray(state.activeEvents) ? state.activeEvents : [],
    resolvedEvents: Array.isArray(state.resolvedEvents) ? state.resolvedEvents : [],
    buildings: Array.isArray(state.buildings) ? state.buildings : [],
    activeContracts: Array.isArray(state.activeContracts) ? state.activeContracts : [],
    completedContracts: Array.isArray(state.completedContracts) ? state.completedContracts : [],
    purchasedUpgrades: Array.isArray(state.purchasedUpgrades) ? state.purchasedUpgrades : [],
    unlockedIds: Array.isArray(state.unlockedIds) ? state.unlockedIds : fresh.unlockedIds,
    actionCooldowns: state.actionCooldowns ?? fresh.actionCooldowns,
    activeBoosts: Array.isArray(state.activeBoosts) ? state.activeBoosts : fresh.activeBoosts,
    nextBuildingNumber: state.nextBuildingNumber || fresh.nextBuildingNumber
  };
};

const applyManagementEffect = (state: SimulationState, effect: ManagementEffect) => {
  state.cash += effect.cash ?? 0;
  addToBag(state.resources, effect.resources ?? {});
  unlock(state, effect.unlockIds ?? []);
  if (effect.morale) {
    for (const member of state.staff.members) {
      member.morale = Math.max(0, Math.min(100, member.morale + effect.morale));
    }
  }
  if (state.activeProject) {
    state.activeProject.quality = Math.max(0, state.activeProject.quality + (effect.projectQuality ?? 0));
    state.activeProject.risk = Math.max(0, state.activeProject.risk + (effect.projectRisk ?? 0));
  }
};

const eraRequirementsMet = (state: SimulationState, era: NonNullable<TycoonGamePack["eras"]>[number]) => {
  const requirements = era.requires ?? {};
  if (requirements.elapsedMs !== undefined && state.elapsedMs < requirements.elapsedMs) {
    return false;
  }
  if (requirements.cash !== undefined && state.cash < requirements.cash) {
    return false;
  }
  if (
    requirements.completedContracts !== undefined &&
    state.completedContracts.length < requirements.completedContracts
  ) {
    return false;
  }
  if (
    requirements.completedProjects !== undefined &&
    state.completedProjects.length < requirements.completedProjects
  ) {
    return false;
  }
  if (requirements.unlockedIds?.some((id) => !state.unlockedIds.includes(id))) {
    return false;
  }
  if (requirements.resources && !hasResources(state.resources, requirements.resources)) {
    return false;
  }
  return true;
};

const maybeAdvanceEra = (pack: TycoonGamePack, state: SimulationState) => {
  for (const era of defaultErasFor(pack)) {
    if (state.reachedEraIds.includes(era.id) || !eraRequirementsMet(state, era)) {
      continue;
    }
    state.reachedEraIds.push(era.id);
    state.currentEraId = era.id;
    state.cash += era.rewardCash ?? 0;
    if (era.expandGrid) {
      state.grid.width += era.expandGrid.width;
      state.grid.height += era.expandGrid.height;
    }
    unlock(state, era.unlockIds ?? []);
  }
};

const updateMarketTrends = (pack: TycoonGamePack, state: SimulationState, deltaMs: number) => {
  state.activeTrends = (state.activeTrends ?? [])
    .map((trend) => ({
      ...trend,
      remainingMs: Math.max(0, trend.remainingMs - deltaMs)
    }))
    .filter((trend) => trend.remainingMs > 0);

  for (const trend of defaultTrendsFor(pack)) {
    if (state.resolvedTrends.includes(trend.id)) {
      continue;
    }
    if (state.activeTrends.some((active) => active.trendId === trend.id)) {
      continue;
    }
    if (state.elapsedMs < trend.startsAtMs) {
      continue;
    }
    state.activeTrends.push({
      trendId: trend.id,
      startedAtMs: state.elapsedMs,
      remainingMs: trend.durationMs
    });
    state.resolvedTrends.push(trend.id);
  }
};

const activeTrendDefinitions = (pack: TycoonGamePack, state: SimulationState) =>
  state.activeTrends
    .map((trend) => defaultTrendsFor(pack).find((definition) => definition.id === trend.trendId))
    .filter((trend): trend is MarketTrendDefinition => Boolean(trend));

const maybeTriggerEvents = (pack: TycoonGamePack, state: SimulationState) => {
  for (const event of pack.events ?? []) {
    if (!event.repeatable && state.resolvedEvents.includes(event.id)) {
      continue;
    }
    if (state.activeEvents.some((active) => active.eventId === event.id)) {
      continue;
    }
    const trigger = event.trigger;
    if (trigger.elapsedMs !== undefined && state.elapsedMs < trigger.elapsedMs) {
      continue;
    }
    if (trigger.minCash !== undefined && state.cash < trigger.minCash) {
      continue;
    }
    if (trigger.unlockedId !== undefined && !state.unlockedIds.includes(trigger.unlockedId)) {
      continue;
    }
    if (trigger.eraId !== undefined && !state.reachedEraIds.includes(trigger.eraId)) {
      continue;
    }
    if (
      trigger.trendId !== undefined &&
      !state.activeTrends.some((trend) => trend.trendId === trigger.trendId)
    ) {
      continue;
    }
    if (trigger.projectActive !== undefined && Boolean(state.activeProject) !== trigger.projectActive) {
      continue;
    }
    state.activeEvents.push({ eventId: event.id, appearedAtMs: state.elapsedMs });
  }
};

const maybeDrawEventDecks = (pack: TycoonGamePack, state: SimulationState) => {
  const events = pack.events ?? [];
  for (const deck of defaultEventDecksFor(pack)) {
    const deckState = state.eventDecks[deck.id] ?? {
      lastDrawMs: 0,
      nextDrawMs: deck.intervalMs,
      draws: 0
    };
    state.eventDecks[deck.id] = deckState;
    if (state.elapsedMs < deckState.nextDrawMs) {
      continue;
    }
    if ((deck.maxActive ?? 2) <= state.activeEvents.length) {
      deckState.nextDrawMs = state.elapsedMs + Math.ceil(deck.intervalMs * 0.35);
      continue;
    }
    const availableEvents = deck.eventIds
      .map((eventId) => events.find((event) => event.id === eventId))
      .filter((event): event is EventDefinition => {
        if (!event) {
          return false;
        }
        if (!event.repeatable && state.resolvedEvents.includes(event.id)) {
          return false;
        }
        if (state.activeEvents.some((active) => active.eventId === event.id)) {
          return false;
        }
        if ((event.cooldownMs ?? 0) > 0) {
          const previous = state.resolvedEvents.includes(event.id);
          if (previous && !event.repeatable) {
            return false;
          }
        }
        return true;
      });
    if (availableEvents.length === 0) {
      deckState.nextDrawMs = state.elapsedMs + deck.intervalMs;
      continue;
    }
    const index = deckState.draws % availableEvents.length;
    state.activeEvents.push({ eventId: availableEvents[index].id, appearedAtMs: state.elapsedMs });
    deckState.lastDrawMs = state.elapsedMs;
    deckState.nextDrawMs = state.elapsedMs + deck.intervalMs;
    deckState.draws += 1;
  }
};

const marketFor = (pack: TycoonGamePack, project: ProjectDefinition) =>
  defaultMarketsFor(pack).find((market) => market.id === project.marketId) ?? defaultMarketsFor(pack)[0];

const activeProjectDefinition = (pack: TycoonGamePack, state: SimulationState) =>
  state.activeProject
    ? defaultProjectsFor(pack).find((project) => project.id === state.activeProject?.projectId)
    : undefined;

export const tycoonEngine: SimulationEngine = {
  createGame(pack, profileInput = {}) {
    const profile = {
      ...defaultProfileFor(pack),
      ...profileInput
    };
    const firstDepartment = profile.firstDepartment;
    const starterStaff = starterStaffFor(pack, profile);
    const initialEra = defaultErasFor(pack)[0];
    const eventDeckState = Object.fromEntries(
      defaultEventDecksFor(pack).map((deck) => [
        deck.id,
        {
          lastDrawMs: 0,
          nextDrawMs: deck.intervalMs,
          draws: 0
        }
      ])
    );
    return {
      packId: pack.id,
      grid: { ...pack.startingState.grid },
      buildings: [],
      resources: applyDifficultyToResources(copyBag(pack.startingState.resources), profile.difficulty),
      cash: applyDifficultyToCash(pack.startingState.cash, profile.difficulty),
      profile,
      staff: {
        unassigned: firstDepartment ? 0 : 1,
        assignments: firstDepartment ? { [firstDepartment]: 1 } : {},
        totalHired: 1,
        members: [starterStaff],
        candidates: defaultCandidatesFor(pack),
        nextStaffNumber: 2
      },
      activeProject: undefined,
      completedProjects: [],
      currentEraId: initialEra?.id,
      reachedEraIds: initialEra ? [initialEra.id] : [],
      activeTrends: [],
      resolvedTrends: [],
      eventDecks: eventDeckState,
      activeEvents: [],
      resolvedEvents: [],
      activeContracts: [],
      completedContracts: [],
      purchasedUpgrades: [],
      unlockedIds: [...pack.startingState.unlockedIds],
      actionCooldowns: {},
      activeBoosts: [],
      elapsedMs: 0,
      nextBuildingNumber: 1
    };
  },

  dispatch(pack, state, command): CommandResult {
    if (command.type === "tick") {
      return { ok: true, state: this.advance(pack, state, command.deltaMs) };
    }

    const next = cloneState(state);

    if (command.type === "placeBuilding") {
      const building = byId(pack.buildings, command.buildingId);
      if (!building) {
        return { ok: false, state, message: "Unknown building." };
      }
      if (!isUnlocked(next, building.id)) {
        return { ok: false, state, message: `${building.name} is still locked.` };
      }
      const purchaseCost = buildingPurchaseCost(next, building);
      if (next.cash < purchaseCost) {
        return { ok: false, state, message: "Not enough cash." };
      }
      const problem = canPlace(pack, next, building, command.x, command.y);
      if (problem) {
        return { ok: false, state, message: problem };
      }
      next.cash -= purchaseCost;
      next.buildings.push({
        id: `machine-${next.nextBuildingNumber}`,
        buildingId: building.id,
        x: command.x,
        y: command.y,
        progressMs: 0
      });
      next.nextBuildingNumber += 1;
      return { ok: true, state: next };
    }

    if (command.type === "removeBuilding") {
      const existing = next.buildings.find((building) => building.id === command.buildingId);
      if (!existing) {
        return { ok: false, state, message: "Unknown placed machine." };
      }
      const definition = byId(pack.buildings, existing.buildingId);
      next.buildings = next.buildings.filter((building) => building.id !== command.buildingId);
      next.cash += Math.floor((definition?.cost ?? 0) * 0.5);
      return { ok: true, state: next };
    }

    if (command.type === "startContract") {
      const contract = byId(pack.contracts, command.contractId);
      if (!contract) {
        return { ok: false, state, message: "Unknown contract." };
      }
      if (!isUnlocked(next, contract.id)) {
        return { ok: false, state, message: `${contract.name} is still locked.` };
      }
      if (next.activeContracts.includes(contract.id)) {
        return { ok: false, state, message: "That contract is already active." };
      }
      if (!contract.repeatable && next.completedContracts.includes(contract.id)) {
        return { ok: false, state, message: "That contract is already complete." };
      }
      next.activeContracts.push(contract.id);
      return { ok: true, state: next };
    }

    if (command.type === "claimContract") {
      const contract = byId(pack.contracts, command.contractId);
      if (!contract || !next.activeContracts.includes(contract.id)) {
        return { ok: false, state, message: "That contract is not active." };
      }
      if (!hasResources(next.resources, contract.requires)) {
        return { ok: false, state, message: "Those required resources are not ready yet." };
      }
      addToBag(next.resources, contract.requires, -1);
      next.cash += contract.rewardCash;
      next.activeContracts = next.activeContracts.filter((id) => id !== contract.id);
      if (!next.completedContracts.includes(contract.id)) {
        next.completedContracts.push(contract.id);
      }
      unlock(next, contract.unlockIds);
      return { ok: true, state: next };
    }

    if (command.type === "buyUpgrade") {
      const upgrade = byId(pack.upgrades, command.upgradeId);
      if (!upgrade) {
        return { ok: false, state, message: "Unknown upgrade." };
      }
      if (!isUnlocked(next, upgrade.id)) {
        return { ok: false, state, message: `${upgrade.name} is still locked.` };
      }
      if (next.purchasedUpgrades.includes(upgrade.id)) {
        return { ok: false, state, message: "Upgrade already bought." };
      }
      if (next.cash < upgrade.cost) {
        return { ok: false, state, message: "Not enough cash." };
      }
      next.cash -= upgrade.cost;
      next.purchasedUpgrades.push(upgrade.id);
      if (upgrade.effect.expandGrid) {
        next.grid.width += upgrade.effect.expandGrid.width;
        next.grid.height += upgrade.effect.expandGrid.height;
      }
      unlock(next, upgrade.effect.unlockIds ?? []);
      return { ok: true, state: next };
    }

    if (command.type === "hireWorker") {
      const cost = workerHireCost(next);
      if (next.cash < cost) {
        return { ok: false, state, message: "Not enough cash to hire another worker." };
      }
      next.cash -= cost;
      next.staff.unassigned += 1;
      next.staff.totalHired += 1;
      const role = defaultRolesFor(pack)[0];
      next.staff.members.push({
        id: `staff-${next.staff.nextStaffNumber}`,
        name: `Worker ${next.staff.nextStaffNumber}`,
        roleId: role?.id ?? "production",
        category: role?.category ?? "production",
        level: 1,
        traits: ["steady"],
        morale: 70,
        wage: role?.baseWage ?? 0.12
      });
      next.staff.nextStaffNumber += 1;
      return { ok: true, state: next };
    }

    if (command.type === "hireCandidate") {
      const candidate = next.staff.candidates.find((item) => item.id === command.candidateId);
      if (!candidate) {
        return { ok: false, state, message: "Unknown candidate." };
      }
      if (next.cash < candidate.hireCost) {
        return { ok: false, state, message: "Not enough cash to hire that candidate." };
      }
      const role = roleFor(pack, candidate.roleId);
      next.cash -= candidate.hireCost;
      next.staff.members.push({
        id: `staff-${next.staff.nextStaffNumber}`,
        name: candidate.name,
        roleId: candidate.roleId,
        category: role?.category ?? candidate.roleId,
        level: candidate.level,
        traits: [...candidate.traits],
        morale: candidate.morale ?? 70,
        wage: role?.baseWage ?? 0.12
      });
      next.staff.nextStaffNumber += 1;
      next.staff.totalHired += 1;
      next.staff.unassigned += 1;
      next.staff.candidates = next.staff.candidates.filter((item) => item.id !== candidate.id);
      return { ok: true, state: next };
    }

    if (command.type === "runAction") {
      const action = byId(pack.actions ?? [], command.actionId);
      if (!action) {
        return { ok: false, state, message: "Unknown action." };
      }
      if (!isUnlocked(next, action.id)) {
        return { ok: false, state, message: `${action.name} is still locked.` };
      }
      if ((next.actionCooldowns[action.id] ?? 0) > 0) {
        return { ok: false, state, message: `${action.name} is still cooling down.` };
      }
      if (next.cash < (action.costCash ?? 0)) {
        return { ok: false, state, message: "Not enough cash." };
      }
      if (!hasResources(next.resources, action.costResources ?? {})) {
        return { ok: false, state, message: "Not enough resources for that action." };
      }

      next.cash -= action.costCash ?? 0;
      addToBag(next.resources, action.costResources ?? {}, -1);
      next.cash += action.effect.cash ?? 0;
      addToBag(next.resources, action.effect.resources ?? {});
      unlock(next, action.effect.unlockIds ?? []);
      if (action.effect.productionBoost) {
        next.activeBoosts = [
          ...next.activeBoosts.filter((boost) => boost.actionId !== action.id),
          {
            actionId: action.id,
            category: action.effect.productionBoost.category,
            multiplier: action.effect.productionBoost.multiplier,
            remainingMs: action.effect.productionBoost.durationMs
          }
        ];
      }
      next.actionCooldowns[action.id] = action.cooldownMs;
      return { ok: true, state: next };
    }

    if (command.type === "assignWorker") {
      const current = next.staff.assignments[command.category] ?? 0;
      if (command.delta > 0) {
        if (next.staff.unassigned <= 0) {
          return { ok: false, state, message: "No idle workers available." };
        }
        next.staff.unassigned -= 1;
        next.staff.assignments[command.category] = current + 1;
        const staffMember = next.staff.members.find((member) => !member.assignment);
        if (staffMember) {
          staffMember.assignment = command.category;
        }
        return { ok: true, state: next };
      }
      if (current <= 0) {
        return { ok: false, state, message: "No worker assigned there." };
      }
      next.staff.assignments[command.category] = current - 1;
      next.staff.unassigned += 1;
      const staffMember = [...next.staff.members]
        .reverse()
        .find((member) => member.assignment === command.category);
      if (staffMember) {
        staffMember.assignment = undefined;
      }
      return { ok: true, state: next };
    }

    if (command.type === "assignStaff") {
      const staffMember = next.staff.members.find((member) => member.id === command.staffId);
      if (!staffMember) {
        return { ok: false, state, message: "Unknown staff member." };
      }
      if (staffMember.assignment) {
        next.staff.assignments[staffMember.assignment] = Math.max(
          0,
          (next.staff.assignments[staffMember.assignment] ?? 0) - 1
        );
      } else {
        next.staff.unassigned = Math.max(0, next.staff.unassigned - 1);
      }
      staffMember.assignment = command.category;
      if (command.category) {
        next.staff.assignments[command.category] = (next.staff.assignments[command.category] ?? 0) + 1;
      } else {
        next.staff.unassigned += 1;
      }
      return { ok: true, state: next };
    }

    if (command.type === "trainStaff") {
      const staffMember = next.staff.members.find((member) => member.id === command.staffId);
      if (!staffMember) {
        return { ok: false, state, message: "Unknown staff member." };
      }
      const cost = 80 + staffMember.level * 60;
      if (next.cash < cost) {
        return { ok: false, state, message: "Not enough cash to train that staff member." };
      }
      next.cash -= cost;
      staffMember.level += 1;
      staffMember.morale = Math.max(0, staffMember.morale - 8);
      return { ok: true, state: next };
    }

    if (command.type === "restStaff") {
      const staffMember = next.staff.members.find((member) => member.id === command.staffId);
      if (!staffMember) {
        return { ok: false, state, message: "Unknown staff member." };
      }
      staffMember.morale = Math.min(100, staffMember.morale + 18);
      return { ok: true, state: next };
    }

    if (command.type === "startProject") {
      if (next.activeProject) {
        return { ok: false, state, message: "A project is already active." };
      }
      const project = defaultProjectsFor(pack).find((item) => item.id === command.projectId);
      if (!project) {
        return { ok: false, state, message: "Unknown project." };
      }
      const explicitProjects = pack.projects ?? [];
      if (explicitProjects.some((item) => item.id === project.id) && !isUnlocked(next, project.id)) {
        return { ok: false, state, message: `${project.name} is still locked.` };
      }
      if (next.cash < (project.costCash ?? 0)) {
        return { ok: false, state, message: "Not enough cash to start that project." };
      }
      if (!hasResources(next.resources, project.requiredResources ?? {})) {
        return { ok: false, state, message: "Not enough resources to start that project." };
      }
      next.cash -= project.costCash ?? 0;
      addToBag(next.resources, project.requiredResources ?? {}, -1);
      const market = marketFor(pack, project);
      next.activeProject = {
        id: `project-${next.completedProjects.length + 1}`,
        projectId: project.id,
        name: command.name ?? project.name,
        phaseIndex: 0,
        phaseProgressMs: 0,
        focusCategory: project.phases[0]?.id,
        quality: 0,
        risk: 0,
        marketFit: market?.demand ?? 1,
        startedAtMs: next.elapsedMs
      };
      return { ok: true, state: next };
    }

    if (command.type === "advanceProjectPhase") {
      const project = activeProjectDefinition(pack, next);
      if (!project || !next.activeProject) {
        return { ok: false, state, message: "No active project." };
      }
      const phase = project.phases[next.activeProject.phaseIndex];
      if (!phase) {
        return { ok: false, state, message: "Project has no active phase." };
      }
      if (next.activeProject.phaseProgressMs < phase.durationMs) {
        return { ok: false, state, message: "That phase is not ready yet." };
      }
      next.activeProject.phaseIndex = Math.min(project.phases.length - 1, next.activeProject.phaseIndex + 1);
      next.activeProject.phaseProgressMs = 0;
      next.activeProject.focusCategory = project.phases[next.activeProject.phaseIndex]?.id;
      return { ok: true, state: next };
    }

    if (command.type === "setProjectFocus") {
      if (!next.activeProject) {
        return { ok: false, state, message: "No active project." };
      }
      next.activeProject.focusCategory = command.category;
      return { ok: true, state: next };
    }

    if (command.type === "releaseProject") {
      const project = activeProjectDefinition(pack, next);
      if (!project || !next.activeProject) {
        return { ok: false, state, message: "No active project to release." };
      }
      const lastPhase = project.phases[project.phases.length - 1];
      if (next.activeProject.phaseIndex < project.phases.length - 1) {
        return { ok: false, state, message: "Finish the project phases before release." };
      }
      if (lastPhase && next.activeProject.phaseProgressMs < lastPhase.durationMs) {
        return { ok: false, state, message: "Final phase is not ready yet." };
      }
      const market = marketFor(pack, project);
      const relevantTrends = activeTrendDefinitions(pack, next).filter(
        (trend) =>
          !trend.marketId ||
          trend.marketId === market?.id ||
          !trend.category ||
          trend.category === project.category
      );
      const trendRewardMultiplier = relevantTrends.reduce(
        (multiplier, trend) => multiplier * (trend.rewardMultiplier ?? 1),
        1
      );
      const trendQualityMultiplier = relevantTrends.reduce(
        (multiplier, trend) => multiplier * (trend.qualityMultiplier ?? 1),
        1
      );
      const trendRiskDelta = relevantTrends.reduce((total, trend) => total + (trend.riskDelta ?? 0), 0);
      const score = Math.max(
        0,
        Math.round(
          next.activeProject.quality * (market?.qualityMultiplier ?? 1) * trendQualityMultiplier +
            next.activeProject.marketFit * 12 -
            Math.max(0, next.activeProject.risk + trendRiskDelta)
        )
      );
      const rewardCash = Math.max(
        0,
        Math.round(
          (project.rewardCash ?? 0) * (market?.rewardMultiplier ?? 1) * trendRewardMultiplier + score * 4
        )
      );
      next.cash += rewardCash;
      unlock(next, project.unlockIds ?? []);
      next.completedProjects.push({
        id: next.activeProject.id,
        projectId: project.id,
        name: next.activeProject.name,
        quality: next.activeProject.quality,
        risk: next.activeProject.risk,
        marketFit: next.activeProject.marketFit,
        score,
        rewardCash,
        releasedAtMs: next.elapsedMs
      });
      next.activeProject = undefined;
      return { ok: true, state: next };
    }

    if (command.type === "cancelProject") {
      if (!next.activeProject) {
        return { ok: false, state, message: "No active project to cancel." };
      }
      next.activeProject = undefined;
      return { ok: true, state: next };
    }

    if (command.type === "resolveEvent") {
      const event = (pack.events ?? []).find((item) => item.id === command.eventId);
      if (!event || !next.activeEvents.some((active) => active.eventId === event.id)) {
        return { ok: false, state, message: "Unknown active event." };
      }
      const choice = event.choices.find((item) => item.id === command.choiceId);
      if (!choice) {
        return { ok: false, state, message: "Unknown event choice." };
      }
      applyManagementEffect(next, choice.effect);
      next.activeEvents = next.activeEvents.filter((active) => active.eventId !== event.id);
      if (!event.repeatable && !next.resolvedEvents.includes(event.id)) {
        next.resolvedEvents.push(event.id);
      }
      return { ok: true, state: next };
    }

    return { ok: false, state, message: "Unknown command." };
  },

  advance(pack, state, deltaMs) {
    const next = cloneState(state);
    next.elapsedMs += deltaMs;
    next.cash -= (staffWagePerSecond(next) * deltaMs) / 1000;
    for (const [actionId, cooldown] of Object.entries(next.actionCooldowns)) {
      next.actionCooldowns[actionId] = Math.max(0, cooldown - deltaMs);
    }
    next.activeBoosts = next.activeBoosts
      .map((boost) => ({
        ...boost,
        remainingMs: Math.max(0, boost.remainingMs - deltaMs)
      }))
      .filter((boost) => boost.remainingMs > 0);

    for (const placed of next.buildings) {
      const building = byId(pack.buildings, placed.buildingId);
      const recipe = building?.recipeId ? byId(pack.recipes, building.recipeId) : undefined;
      if (!building || !recipe) {
        continue;
      }

      placed.progressMs += deltaMs * productionMultiplierFor(pack, next, building);
      let cycles = 0;
      while (placed.progressMs >= recipe.durationMs && cycles < 20) {
        if (!runRecipeCycle(next.resources, recipe, 1)) {
          placed.progressMs = Math.min(placed.progressMs, recipe.durationMs);
          break;
        }
        placed.progressMs -= recipe.durationMs;
        cycles += 1;
      }
    }

    if (next.activeProject) {
      const project = activeProjectDefinition(pack, next);
      const phase = project?.phases[next.activeProject.phaseIndex];
      if (project && phase) {
        const assigned = next.activeProject.focusCategory
          ? next.staff.members.filter((member) => member.assignment === next.activeProject?.focusCategory)
          : [];
        const staffMultiplier =
          assigned.length === 0
            ? 1
            : 1 +
              assigned.reduce(
                (total, member) => total + member.level * Math.max(0.25, member.morale / 100),
                0
              ) *
                0.18;
        const wasReady = next.activeProject.phaseProgressMs >= phase.durationMs;
        next.activeProject.phaseProgressMs = Math.min(
          phase.durationMs,
          next.activeProject.phaseProgressMs + deltaMs * staffMultiplier
        );
        if (!wasReady && next.activeProject.phaseProgressMs >= phase.durationMs) {
          const resourceQuality = Object.entries(phase.qualityFromResources ?? {}).reduce(
            (total, [resourceId, weight]) => {
              const available = next.resources[resourceId] ?? 0;
              const consumed = Math.min(available, Math.max(1, Math.ceil(weight)));
              next.resources[resourceId] = Math.max(0, available - consumed);
              return total + consumed * weight;
            },
            0
          );
          const staffQuality = assigned.reduce(
            (total, member) => {
              const traitQuality = member.traits.reduce(
                (traitTotal, traitId) => traitTotal + (traitFor(pack, traitId)?.projectQualityBonus ?? 0),
                0
              );
              return total + member.level * Math.max(0.25, member.morale / 100) + traitQuality;
            },
            0
          );
          const riskModifier = assigned.reduce(
            (total, member) =>
              total +
              member.traits.reduce(
                (traitTotal, traitId) => traitTotal + (traitFor(pack, traitId)?.riskModifier ?? 0),
                0
              ),
            0
          );
          next.activeProject.quality += Math.round(8 + resourceQuality + staffQuality * 4);
          next.activeProject.risk = Math.max(0, next.activeProject.risk + (phase.risk ?? 0) + riskModifier);
          for (const member of assigned) {
            const moraleDrainModifier = member.traits.reduce(
              (total, traitId) => total + (traitFor(pack, traitId)?.moraleDrainModifier ?? 0),
              0
            );
            member.morale = Math.max(0, member.morale - Math.max(0, 2 + moraleDrainModifier));
          }
        }
      }
    }

    maybeAdvanceEra(pack, next);
    updateMarketTrends(pack, next, deltaMs);
    maybeDrawEventDecks(pack, next);
    maybeTriggerEvents(pack, next);

    return next;
  },

  serialize(state) {
    const wrapped: WrappedSimulationSave = {
      schemaVersion: PACKFORGE_SAVE_SCHEMA_VERSION,
      engineVersion: PACKFORGE_ENGINE_VERSION,
      packId: state.packId,
      state
    };
    return JSON.stringify(wrapped);
  },

  deserialize(pack, save) {
    const parsed = JSON.parse(save) as SimulationState | WrappedSimulationSave;
    if ("schemaVersion" in parsed) {
      if (parsed.schemaVersion !== PACKFORGE_SAVE_SCHEMA_VERSION) {
        throw new Error(`Unsupported save schema "${parsed.schemaVersion}".`);
      }
      if (parsed.packId && parsed.packId !== pack.id) {
        throw new Error(`Save belongs to pack "${parsed.packId}", not "${pack.id}".`);
      }
      return normalizeState(pack, parsed.state);
    }
    return normalizeState(pack, parsed);
  }
};
