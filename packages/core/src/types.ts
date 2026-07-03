export type ResourceBag = Record<string, number>;

export interface Size {
  width: number;
  height: number;
}

export interface ResourceDefinition {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface RecipeDefinition {
  id: string;
  name: string;
  durationMs: number;
  inputs: ResourceBag;
  outputs: ResourceBag;
}

export interface BuildingDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  size: Size;
  cost: number;
  recipeId?: string;
  color: string;
  icon?: string;
}

export interface ContractDefinition {
  id: string;
  name: string;
  description: string;
  requires: ResourceBag;
  rewardCash: number;
  unlockIds: string[];
  repeatable?: boolean;
  icon?: string;
}

export interface UpgradeEffect {
  unlockIds?: string[];
  expandGrid?: Size;
  productionMultipliers?: Array<{
    category: string;
    multiplier: number;
  }>;
}

export interface EraDefinition {
  id: string;
  name: string;
  description: string;
  requires?: {
    elapsedMs?: number;
    cash?: number;
    completedContracts?: number;
    completedProjects?: number;
    resources?: ResourceBag;
    unlockedIds?: string[];
  };
  unlockIds?: string[];
  expandGrid?: Size;
  rewardCash?: number;
  icon?: string;
}

export interface UpgradeDefinition {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: UpgradeEffect;
  icon?: string;
}

export interface PackActionEffect {
  resources?: ResourceBag;
  cash?: number;
  unlockIds?: string[];
  productionBoost?: {
    category: string;
    multiplier: number;
    durationMs: number;
  };
}

export interface PackActionDefinition {
  id: string;
  name: string;
  description: string;
  costCash?: number;
  costResources?: ResourceBag;
  cooldownMs: number;
  unlockIds?: string[];
  effect: PackActionEffect;
  icon?: string;
}

export interface ProjectPhaseDefinition {
  id: string;
  name: string;
  durationMs: number;
  description?: string;
  qualityFromResources?: ResourceBag;
  risk?: number;
}

export interface ProjectDefinition {
  id: string;
  name: string;
  description: string;
  phases: ProjectPhaseDefinition[];
  costCash?: number;
  requiredResources?: ResourceBag;
  rewardCash?: number;
  unlockIds?: string[];
  marketId?: string;
  category?: string;
  icon?: string;
}

export interface MarketDefinition {
  id: string;
  name: string;
  description: string;
  demand: number;
  rewardMultiplier?: number;
  qualityMultiplier?: number;
}

export interface MarketTrendDefinition {
  id: string;
  name: string;
  description: string;
  startsAtMs: number;
  durationMs: number;
  marketId?: string;
  category?: string;
  rewardMultiplier?: number;
  qualityMultiplier?: number;
  riskDelta?: number;
  resourceDemand?: ResourceBag;
  icon?: string;
}

export interface ManagementEffect {
  cash?: number;
  resources?: ResourceBag;
  unlockIds?: string[];
  morale?: number;
  projectQuality?: number;
  projectRisk?: number;
}

export interface EventChoiceDefinition {
  id: string;
  label: string;
  description: string;
  effect: ManagementEffect;
}

export interface EventDefinition {
  id: string;
  name: string;
  description: string;
  deckId?: string;
  weight?: number;
  cooldownMs?: number;
  trigger: {
    elapsedMs?: number;
    minCash?: number;
    unlockedId?: string;
    eraId?: string;
    trendId?: string;
    projectActive?: boolean;
  };
  choices: EventChoiceDefinition[];
  repeatable?: boolean;
  icon?: string;
}

export interface EventDeckDefinition {
  id: string;
  name: string;
  description: string;
  intervalMs: number;
  maxActive?: number;
  eventIds: string[];
}

export interface StaffRoleDefinition {
  id: string;
  name: string;
  category: string;
  baseWage: number;
  description?: string;
}

export interface StaffTraitDefinition {
  id: string;
  name: string;
  description: string;
  productionBonus?: number;
  projectQualityBonus?: number;
  riskModifier?: number;
  moraleDrainModifier?: number;
  category?: string;
}

export interface StaffCandidateDefinition {
  id: string;
  name: string;
  roleId: string;
  hireCost: number;
  level: number;
  traits: string[];
  morale?: number;
}

export interface GameTheme {
  title: string;
  subtitle: string;
  description?: string;
  visual?: {
    icon: string;
    illustration: string;
    sceneImage?: string;
    logoImage?: string;
  };
  palette: {
    soil: string;
    grid: string;
    accent: string;
    panel: string;
  };
  ui?: {
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    muted: string;
    border: string;
    accent: string;
    accentStrong: string;
    accentSoft: string;
    success: string;
    warning: string;
    danger: string;
  };
}

export interface StartingStateDefinition {
  grid: Size;
  cash: number;
  resources: ResourceBag;
  unlockedIds: string[];
}

export type GameDifficulty = "relaxed" | "standard" | "hard";
export type LogoShape = "squircle" | "circle" | "diamond" | "shield";
export type LogoPattern = "shine" | "grid" | "stripes" | "spotlight";

export interface FounderProfile {
  companyName: string;
  founderName: string;
  logoIcon: string;
  logoColor: string;
  logoShape: LogoShape;
  logoPattern: LogoPattern;
  difficulty: GameDifficulty;
  firstDepartment?: string;
}

export interface TycoonGamePack {
  id: string;
  resources: ResourceDefinition[];
  buildings: BuildingDefinition[];
  recipes: RecipeDefinition[];
  contracts: ContractDefinition[];
  upgrades: UpgradeDefinition[];
  actions?: PackActionDefinition[];
  eras?: EraDefinition[];
  projects?: ProjectDefinition[];
  markets?: MarketDefinition[];
  marketTrends?: MarketTrendDefinition[];
  events?: EventDefinition[];
  eventDecks?: EventDeckDefinition[];
  staffRoles?: StaffRoleDefinition[];
  staffTraits?: StaffTraitDefinition[];
  staffCandidates?: StaffCandidateDefinition[];
  startingState: StartingStateDefinition;
  theme: GameTheme;
}

export interface ActiveProductionBoost {
  actionId: string;
  category: string;
  multiplier: number;
  remainingMs: number;
}

export interface PackForgePackageManifest {
  schemaVersion: "packforge.package.v1";
  packageId: string;
  displayName: string;
  version: string;
  description?: string;
  author?: string;
  tags?: string[];
  entryPackId: string;
}

export interface PackForgeGamePackage {
  manifest: PackForgePackageManifest;
  packs: TycoonGamePack[];
}

export interface PlacedBuilding {
  id: string;
  buildingId: string;
  x: number;
  y: number;
  progressMs: number;
}

export interface StaffMember {
  id: string;
  name: string;
  roleId: string;
  category: string;
  level: number;
  traits: string[];
  morale: number;
  wage: number;
  assignment?: string;
}

export interface ActiveProject {
  id: string;
  projectId: string;
  name: string;
  phaseIndex: number;
  phaseProgressMs: number;
  focusCategory?: string;
  quality: number;
  risk: number;
  marketFit: number;
  startedAtMs: number;
}

export interface ProjectOutcome {
  id: string;
  projectId: string;
  name: string;
  quality: number;
  risk: number;
  marketFit: number;
  score: number;
  rewardCash: number;
  releasedAtMs: number;
}

export interface ActiveEvent {
  eventId: string;
  appearedAtMs: number;
}

export interface ActiveMarketTrend {
  trendId: string;
  startedAtMs: number;
  remainingMs: number;
}

export interface SimulationState {
  packId: string;
  grid: Size;
  buildings: PlacedBuilding[];
  resources: ResourceBag;
  cash: number;
  profile: FounderProfile;
  staff: {
    unassigned: number;
    assignments: Record<string, number>;
    totalHired: number;
    members: StaffMember[];
    candidates: StaffCandidateDefinition[];
    nextStaffNumber: number;
  };
  activeProject?: ActiveProject;
  completedProjects: ProjectOutcome[];
  currentEraId?: string;
  reachedEraIds: string[];
  activeTrends: ActiveMarketTrend[];
  resolvedTrends: string[];
  eventDecks: Record<string, { lastDrawMs: number; nextDrawMs: number; draws: number }>;
  activeEvents: ActiveEvent[];
  resolvedEvents: string[];
  activeContracts: string[];
  completedContracts: string[];
  purchasedUpgrades: string[];
  unlockedIds: string[];
  actionCooldowns: Record<string, number>;
  activeBoosts: ActiveProductionBoost[];
  elapsedMs: number;
  nextBuildingNumber: number;
}

export type GameCommand =
  | { type: "placeBuilding"; buildingId: string; x: number; y: number }
  | { type: "removeBuilding"; buildingId: string }
  | { type: "startContract"; contractId: string }
  | { type: "claimContract"; contractId: string }
  | { type: "buyUpgrade"; upgradeId: string }
  | { type: "hireWorker" }
  | { type: "assignWorker"; category: string; delta: 1 | -1 }
  | { type: "hireCandidate"; candidateId: string }
  | { type: "assignStaff"; staffId: string; category?: string }
  | { type: "trainStaff"; staffId: string }
  | { type: "restStaff"; staffId: string }
  | { type: "startProject"; projectId: string; name?: string }
  | { type: "advanceProjectPhase" }
  | { type: "setProjectFocus"; category: string }
  | { type: "releaseProject" }
  | { type: "cancelProject" }
  | { type: "resolveEvent"; eventId: string; choiceId: string }
  | { type: "runAction"; actionId: string }
  | { type: "tick"; deltaMs: number };

export interface CommandResult {
  state: SimulationState;
  ok: boolean;
  message?: string;
}

export interface SimulationEngine {
  createGame(pack: TycoonGamePack, profile?: Partial<FounderProfile>): SimulationState;
  dispatch(
    pack: TycoonGamePack,
    state: SimulationState,
    command: GameCommand
  ): CommandResult;
  advance(
    pack: TycoonGamePack,
    state: SimulationState,
    deltaMs: number
  ): SimulationState;
  serialize(state: SimulationState): string;
  deserialize(pack: TycoonGamePack, save: string): SimulationState;
}

export interface WrappedSimulationSave {
  schemaVersion: "packforge.save.v1";
  engineVersion: string;
  packId: string;
  state: SimulationState;
}
