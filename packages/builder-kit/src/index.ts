import {
  createGamePackage,
  PACKFORGE_PACKAGE_SCHEMA_VERSION,
  serializeGamePackage,
  validateGamePackage,
  type PackForgeGamePackage,
  type TycoonGamePack
} from "@packforge/core";

export interface GamePackTemplateOptions {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
}

export const createGamePackTemplate = ({
  id,
  title,
  subtitle,
  description
}: GamePackTemplateOptions): TycoonGamePack => ({
  id,
  theme: {
    title,
    subtitle,
    description,
    visual: {
      icon: "gamepad",
      illustration: "studio"
    },
    palette: {
      soil: "#46515c",
      grid: "#7b8794",
      accent: "#0ea5e9",
      panel: "#ffffff"
    },
    ui: {
      background: "#f5f8fc",
      surface: "#ffffff",
      surfaceAlt: "#edf4fb",
      text: "#101828",
      muted: "#667085",
      border: "#d8e3ef",
      accent: "#0ea5e9",
      accentStrong: "#0369a1",
      accentSoft: "#e0f2fe",
      success: "#16a34a",
      warning: "#f97316",
      danger: "#dc2626"
    }
  },
  resources: [
    {
      id: "work",
      name: "Work",
      description: "The basic output every new management game can produce.",
      icon: "tools"
    }
  ],
  recipes: [
    {
      id: "make_work",
      name: "Make Work",
      durationMs: 2000,
      inputs: {},
      outputs: { work: 1 }
    }
  ],
  buildings: [
    {
      id: "starter_station",
      name: "Starter Station",
      description: "The first place where work gets done.",
      category: "production",
      size: { width: 1, height: 1 },
      cost: 0,
      recipeId: "make_work",
      color: "#0ea5e9",
      icon: "station"
    }
  ],
  contracts: [
    {
      id: "first_order",
      name: "First Order",
      description: "Deliver a small amount of work.",
      requires: { work: 5 },
      rewardCash: 100,
      unlockIds: [],
      icon: "contract"
    }
  ],
  upgrades: [],
  markets: [
    {
      id: "starter_market",
      name: "Starter Market",
      description: "A forgiving first audience for a new tycoon pack.",
      demand: 1,
      rewardMultiplier: 1,
      qualityMultiplier: 1
    }
  ],
  projects: [
    {
      id: "starter_project",
      name: "Starter Project",
      description: "A first management project that can be tuned in the builder.",
      marketId: "starter_market",
      rewardCash: 120,
      unlockIds: [],
      phases: [
        {
          id: "plan",
          name: "Plan",
          durationMs: 3000,
          qualityFromResources: {},
          risk: 1
        },
        {
          id: "produce",
          name: "Produce",
          durationMs: 5000,
          qualityFromResources: { work: 1 },
          risk: 2
        },
        {
          id: "deliver",
          name: "Deliver",
          durationMs: 3000,
          qualityFromResources: { work: 1 },
          risk: 0
        }
      ]
    }
  ],
  events: [
    {
      id: "first_surprise",
      name: "First Surprise",
      description: "A small opportunity appears once the business is running.",
      trigger: { elapsedMs: 10000 },
      choices: [
        {
          id: "take_it",
          label: "Take it",
          description: "Gain cash and a little pressure.",
          effect: { cash: 25, projectRisk: 1 }
        }
      ]
    }
  ],
  staffRoles: [
    {
      id: "operator",
      name: "Operator",
      category: "production",
      baseWage: 0.12,
      description: "Keeps the first station moving."
    }
  ],
  staffCandidates: [
    {
      id: "candidate_starter",
      name: "Riley Park",
      roleId: "operator",
      hireCost: 120,
      level: 1,
      traits: ["steady"],
      morale: 75
    }
  ],
  startingState: {
    grid: { width: 6, height: 4 },
    cash: 100,
    resources: { work: 0 },
    unlockedIds: ["starter_station", "first_order", "starter_project"]
  }
});

export const createGamePackageTemplate = (
  packageId: string,
  displayName: string,
  pack: TycoonGamePack
): PackForgeGamePackage =>
  createGamePackage(
    {
      packageId,
      displayName,
      version: "0.1.0",
      entryPackId: pack.id
    },
    [pack]
  );

export const exportBuilderPackage = (gamePackage: PackForgeGamePackage) => {
  const validation = validateGamePackage(gamePackage);
  return {
    ok: validation.ok,
    errors: validation.errors,
    schemaVersion: PACKFORGE_PACKAGE_SCHEMA_VERSION,
    json: validation.ok ? serializeGamePackage(gamePackage) : undefined
  };
};

export const importBuilderPackage = (source: string) => {
  const gamePackage = JSON.parse(source) as PackForgeGamePackage;
  const validation = validateGamePackage(gamePackage);
  return {
    gamePackage,
    validation
  };
};
