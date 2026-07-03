import type {
  BuildingDefinition,
  ContractDefinition,
  EventDefinition,
  ProjectDefinition,
  RecipeDefinition,
  StaffCandidateDefinition,
  StaffTraitDefinition,
  TycoonGamePack,
  UpgradeDefinition
} from "@packforge/core";

const titleCase = (value: string) =>
  value
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const scaleBag = (bag: Record<string, number>, factor: number) =>
  Object.fromEntries(Object.entries(bag).map(([id, amount]) => [id, Math.max(1, Math.ceil(amount * factor))]));

const firstResourceIds = (pack: TycoonGamePack, count: number) =>
  pack.resources.slice(0, count).map((resource) => resource.id);

const resourceAt = (pack: TycoonGamePack, index: number) =>
  pack.resources[Math.min(pack.resources.length - 1, Math.max(0, index))];

const categoriesFor = (pack: TycoonGamePack) => [...new Set(pack.buildings.map((building) => building.category))];

const iconForCategory = (pack: TycoonGamePack, category: string) =>
  pack.buildings.find((building) => building.category === category)?.icon ?? pack.theme.visual?.icon ?? "station";

const colorForCategory = (pack: TycoonGamePack, category: string) =>
  pack.buildings.find((building) => building.category === category)?.color ?? pack.theme.palette.accent;

const generatedRecipesFor = (pack: TycoonGamePack): RecipeDefinition[] =>
  pack.recipes.slice(0, 6).map((recipe, index) => ({
    id: `${recipe.id}_specialist`,
    name: `Specialist ${recipe.name}`,
    durationMs: Math.max(900, Math.floor(recipe.durationMs * 0.72)),
    inputs: scaleBag(recipe.inputs, index < 2 ? 1 : 1.35),
    outputs: scaleBag(recipe.outputs, 1.8)
  }));

const generatedBuildingsFor = (pack: TycoonGamePack, recipes: RecipeDefinition[]): BuildingDefinition[] => {
  const categories = categoriesFor(pack);
  return recipes.map((recipe, index) => {
    const category = categories[index % categories.length] ?? pack.buildings[0]?.category ?? "production";
    return {
      id: `${category}_specialist_${index + 1}`,
      name: `${titleCase(category)} Specialist ${index + 1}`,
      description: `A higher-capacity ${titleCase(category).toLowerCase()} station for the mid-game.`,
      category,
      size: index % 3 === 0 ? { width: 2, height: 2 } : { width: 2, height: 1 },
      cost: 220 + index * 95,
      recipeId: recipe.id,
      color: colorForCategory(pack, category),
      icon: iconForCategory(pack, category)
    };
  });
};

const generatedUpgradesFor = (pack: TycoonGamePack): UpgradeDefinition[] =>
  categoriesFor(pack)
    .slice(0, 8)
    .map((category, index) => ({
      id: `depth_${category}_systems`,
      name: `${titleCase(category)} Systems`,
      description: `Adds management process and better tools for ${titleCase(category).toLowerCase()} work.`,
      cost: 260 + index * 140,
      effect: { productionMultipliers: [{ category, multiplier: 1.18 + index * 0.02 }] },
      icon: iconForCategory(pack, category)
    }));

const generatedContractsFor = (
  pack: TycoonGamePack,
  buildings: BuildingDefinition[],
  upgrades: UpgradeDefinition[]
): ContractDefinition[] => {
  const contractNames = [
    "Proof of Demand",
    "Busy Week",
    "Operations Push",
    "Local Reputation",
    "Expansion Brief",
    "Specialist Order",
    "Peak Season",
    "Quality Standard",
    "Regional Attention",
    "Flagship Delivery",
    "Prestige Run",
    "Legacy Contract"
  ];
  return contractNames.map((name, index) => {
    const primary = resourceAt(pack, index % pack.resources.length);
    const secondary = resourceAt(pack, (index + 3) % pack.resources.length);
    const unlockIds = [
      buildings[index % buildings.length]?.id,
      upgrades[index % upgrades.length]?.id,
      index < 8 ? `depth_project_${index + 1}` : undefined,
      index < contractNames.length - 1 ? `depth_contract_${index + 2}` : undefined
    ].filter((id): id is string => Boolean(id));
    return {
      id: `depth_contract_${index + 1}`,
      name,
      description: `A deeper ${pack.theme.title} objective that tests ${primary.name.toLowerCase()} and ${secondary.name.toLowerCase()}.`,
      requires: {
        [primary.id]: 8 + index * 3,
        [secondary.id]: 5 + index * 2
      },
      rewardCash: 260 + index * 115,
      unlockIds,
      repeatable: index >= contractNames.length - 2
    };
  });
};

const generatedProjectsFor = (pack: TycoonGamePack): ProjectDefinition[] => {
  const categories = categoriesFor(pack);
  const projectNames = [
    "Local Breakthrough",
    "Operational Upgrade",
    "Signature Offering",
    "Seasonal Push",
    "Regional Launch",
    "Premium Experience",
    "Flagship Program",
    "Legacy Milestone"
  ];
  return projectNames.map((name, index) => {
    const market = pack.markets?.[index % Math.max(1, pack.markets.length)];
    return {
      id: `depth_project_${index + 1}`,
      name,
      description: `A larger ${pack.theme.title} project with multi-phase quality, risk, and market response.`,
      category: categories[index % categories.length],
      marketId: market?.id,
      costCash: index < 2 ? undefined : 120 + index * 45,
      requiredResources:
        index < 2
          ? undefined
          : {
              [resourceAt(pack, index % pack.resources.length).id]: 2 + index
            },
      rewardCash: 420 + index * 160,
      unlockIds: index < projectNames.length - 1 ? [`depth_project_${index + 2}`] : [],
      phases: [0, 1, 2, 3].map((phaseIndex) => {
        const resource = resourceAt(pack, (index + phaseIndex) % pack.resources.length);
        const category = categories[(index + phaseIndex) % categories.length] ?? "operations";
        return {
          id: category,
          name: titleCase(category),
          durationMs: 4_500 + index * 350 + phaseIndex * 900,
          qualityFromResources: { [resource.id]: 2 + phaseIndex },
          risk: Math.max(0, phaseIndex + Math.floor(index / 3))
        };
      })
    };
  });
};

const generatedEventsFor = (pack: TycoonGamePack): EventDefinition[] => {
  const resources = firstResourceIds(pack, 6);
  const events = [
    ["supply-crunch", "Supply Crunch", "A key supply line gets tight at the worst moment."],
    ["staff-conflict", "Staff Conflict", "Two staff members disagree about how to handle the next push."],
    ["press-attention", "Press Attention", "Local attention spikes and the business can lean into it."],
    ["quality-scare", "Quality Scare", "A quality issue appears before customers notice."],
    ["vip-request", "VIP Request", "A high-value customer asks for special treatment."],
    ["equipment-fault", "Equipment Fault", "One important station starts acting unreliable."],
    ["trend-window", "Trend Window", "The market briefly wants exactly what you can offer."],
    ["community-offer", "Community Offer", "A nearby partner offers a useful collaboration."],
    ["cost-spike", "Cost Spike", "Costs rise for a short period."],
    ["morale-check", "Morale Check", "The team needs attention before the next big milestone."],
    ["review-moment", "Review Moment", "A public review could shape demand."],
    ["late-opportunity", "Late Opportunity", "A risky late opportunity appears."]
  ];
  return events.map(([suffix, name, description], index) => {
    const resource = resources[index % resources.length] ?? pack.resources[0]?.id;
    return {
      id: `depth_event_${suffix}`,
      deckId: index < 4 ? "operations" : index < 8 ? "market" : "staff",
      name,
      description,
      weight: 1 + (index % 3),
      cooldownMs: 40_000 + index * 3_000,
      repeatable: index % 4 === 0,
      trigger: {
        elapsedMs: 20_000 + index * 8_000,
        projectActive: index % 3 === 0 ? true : undefined
      },
      choices: [
        {
          id: "invest",
          label: "Invest",
          description: "Spend cash to stabilize the opportunity.",
          effect: {
            cash: -(35 + index * 8),
            resources: resource ? { [resource]: 3 + Math.floor(index / 2) } : {},
            projectQuality: 2 + (index % 3),
            projectRisk: -2
          }
        },
        {
          id: "improvise",
          label: "Improvise",
          description: "Save cash, accept risk, and hope the team carries it.",
          effect: {
            cash: 25 + index * 5,
            morale: index % 2 === 0 ? -2 : 2,
            projectRisk: 3 + (index % 4)
          }
        }
      ]
    };
  });
};

const generatedTraitsFor = (pack: TycoonGamePack): StaffTraitDefinition[] => {
  const existingTraitIds = new Set(pack.staffCandidates?.flatMap((candidate) => candidate.traits) ?? []);
  const traits: StaffTraitDefinition[] = [
    {
      id: "founder",
      name: "Founder",
      description: "A flexible generalist who steadies the business.",
      productionBonus: 0.08,
      projectQualityBonus: 1,
      riskModifier: -1
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
      description: "Moves quickly on routine work.",
      productionBonus: 0.1,
      moraleDrainModifier: 0.1
    },
    {
      id: "organized",
      name: "Organized",
      description: "Keeps larger projects controlled.",
      productionBonus: 0.04,
      riskModifier: -2
    },
    {
      id: "creative",
      name: "Creative",
      description: "Adds quality to projects but can make plans messier.",
      projectQualityBonus: 2,
      riskModifier: 1
    }
  ];
  for (const id of existingTraitIds) {
    if (traits.some((trait) => trait.id === id)) {
      continue;
    }
    traits.push({
      id,
      name: titleCase(id),
      description: `${titleCase(id)} staff bring a distinctive style to ${pack.theme.title}.`,
      productionBonus: 0.04,
      projectQualityBonus: id.includes("creative") || id.includes("taste") ? 1 : undefined,
      riskModifier: id.includes("organized") || id.includes("calm") ? -1 : undefined
    });
  }
  return traits;
};

const generatedCandidatesFor = (pack: TycoonGamePack): StaffCandidateDefinition[] => {
  const roles = pack.staffRoles ?? [];
  const names = ["Rowan Vale", "Mira Stone", "Theo Cross", "Nia Lane", "Jules Hart", "Amal Finch"];
  return roles.slice(0, 6).map((role, index) => ({
    id: `depth_candidate_${role.id}`,
    name: names[index] ?? `${role.name} Lead`,
    roleId: role.id,
    hireCost: 220 + index * 60,
    level: 2 + (index % 3),
    traits: index % 2 === 0 ? ["steady", "organized"] : ["quick", "creative"],
    morale: 72 + (index % 4) * 3
  }));
};

const generatedErasFor = (
  pack: TycoonGamePack,
  buildings: BuildingDefinition[],
  contracts: ContractDefinition[],
  upgrades: UpgradeDefinition[],
  projects: ProjectDefinition[]
) => [
  {
    id: "starter",
    name: "Starter",
    description: `The scrappy first chapter of ${pack.theme.title}.`,
    requires: {},
    unlockIds: pack.startingState.unlockedIds
  },
  {
    id: "foothold",
    name: "Foothold",
    description: "The business has proof of demand and can specialize.",
    requires: { completedContracts: 2 },
    unlockIds: [
      contracts[0]?.id,
      contracts[1]?.id,
      buildings[0]?.id,
      buildings[1]?.id,
      upgrades[0]?.id,
      projects[0]?.id
    ].filter((id): id is string => Boolean(id)),
    rewardCash: 120
  },
  {
    id: "growth",
    name: "Growth",
    description: "Operations expand beyond the first repeatable loop.",
    requires: { completedContracts: 5, completedProjects: 1 },
    unlockIds: [
      contracts[2]?.id,
      contracts[3]?.id,
      buildings[2]?.id,
      buildings[3]?.id,
      upgrades[1]?.id,
      upgrades[2]?.id,
      projects[1]?.id,
      projects[2]?.id
    ].filter((id): id is string => Boolean(id)),
    expandGrid: { width: 2, height: 1 },
    rewardCash: 220
  },
  {
    id: "regional",
    name: "Regional",
    description: "The business becomes known outside the first local circle.",
    requires: { completedContracts: 9, completedProjects: 3 },
    unlockIds: [
      contracts[4]?.id,
      contracts[5]?.id,
      contracts[6]?.id,
      buildings[4]?.id,
      upgrades[3]?.id,
      upgrades[4]?.id,
      projects[3]?.id,
      projects[4]?.id
    ].filter((id): id is string => Boolean(id)),
    expandGrid: { width: 2, height: 1 },
    rewardCash: 360
  },
  {
    id: "flagship",
    name: "Flagship",
    description: "The late game opens prestige work, larger projects, and bigger risks.",
    requires: { completedContracts: 14, completedProjects: 5 },
    unlockIds: [
      ...contracts.slice(7).map((contract) => contract.id),
      ...buildings.slice(5).map((building) => building.id),
      ...upgrades.slice(5).map((upgrade) => upgrade.id),
      ...projects.slice(5).map((project) => project.id)
    ],
    expandGrid: { width: 3, height: 2 },
    rewardCash: 620
  }
];

const generatedTrendsFor = (pack: TycoonGamePack) => {
  const categories = categoriesFor(pack);
  const trendNames = [
    "Opening Curiosity",
    "Local Demand Spike",
    "Quality Matters",
    "Budget Pressure",
    "Premium Window",
    "Crowd Favorite",
    "Reputation Wave",
    "Late-Game Scrutiny"
  ];
  return trendNames.map((name, index) => ({
    id: `depth_trend_${index + 1}`,
    name,
    description: `${pack.theme.title} market conditions shift: ${name.toLowerCase()}.`,
    startsAtMs: 25_000 + index * 45_000,
    durationMs: 55_000 + index * 8_000,
    marketId: pack.markets?.[index % Math.max(1, pack.markets.length)]?.id,
    category: categories[index % categories.length],
    rewardMultiplier: index === 3 ? 0.92 : 1.05 + index * 0.015,
    qualityMultiplier: index === 2 || index >= 4 ? 1.08 + index * 0.01 : 1,
    riskDelta: index === 3 || index === 7 ? 3 : index === 6 ? -2 : 0,
    resourceDemand: { [resourceAt(pack, index % pack.resources.length).id]: 3 + index }
  }));
};

export const deepenPack = (pack: TycoonGamePack): TycoonGamePack => {
  const recipes = generatedRecipesFor(pack);
  const buildings = generatedBuildingsFor(pack, recipes);
  const upgrades = generatedUpgradesFor(pack);
  const contracts = generatedContractsFor(pack, buildings, upgrades);
  const projects = generatedProjectsFor(pack);
  const events = generatedEventsFor(pack);
  return {
    ...pack,
    recipes: [...pack.recipes, ...recipes],
    buildings: [...pack.buildings, ...buildings],
    contracts: [...pack.contracts, ...contracts],
    upgrades: [...pack.upgrades, ...upgrades],
    projects: [...(pack.projects ?? []), ...projects],
    events: [...(pack.events ?? []), ...events],
    eras: [...(pack.eras ?? []), ...generatedErasFor(pack, buildings, contracts, upgrades, projects)],
    marketTrends: [...(pack.marketTrends ?? []), ...generatedTrendsFor(pack)],
    eventDecks: [
      ...(pack.eventDecks ?? []),
      {
        id: "operations",
        name: "Operations Deck",
        description: "Recurring operational problems and opportunities.",
        intervalMs: 32_000,
        maxActive: 3,
        eventIds: events.filter((event) => event.deckId === "operations").map((event) => event.id)
      },
      {
        id: "market",
        name: "Market Deck",
        description: "Demand, publicity, and customer-pressure events.",
        intervalMs: 44_000,
        maxActive: 3,
        eventIds: events.filter((event) => event.deckId === "market").map((event) => event.id)
      },
      {
        id: "staff",
        name: "Staff Deck",
        description: "Team morale, conflict, and staffing events.",
        intervalMs: 52_000,
        maxActive: 3,
        eventIds: events.filter((event) => event.deckId === "staff").map((event) => event.id)
      }
    ],
    staffTraits: [...(pack.staffTraits ?? []), ...generatedTraitsFor(pack)],
    staffCandidates: [...(pack.staffCandidates ?? []), ...generatedCandidatesFor(pack)]
  };
};
