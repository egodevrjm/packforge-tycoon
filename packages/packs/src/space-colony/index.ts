import type { TycoonGamePack } from "@packforge/core";

export const spaceColonyPack: TycoonGamePack = {
  id: "space-colony",
  theme: {
    title: "Space Colony Tycoon",
    subtitle: "Build a tiny outpost into a self-sustaining frontier.",
    description:
      "A survival-infrastructure management pack about power, water, oxygen, crops, fabrication, research, and morale.",
    visual: {
      icon: "rocket",
      illustration: "colony",
      sceneImage: "/assets/key-art/space-colony-room.png",
      logoImage: "/assets/key-art/space-colony-room.png"
    },
    palette: {
      soil: "#334155",
      grid: "#64748b",
      accent: "#8b5cf6",
      panel: "#f8fafc"
    },
    ui: {
      background: "#f7f7ff",
      surface: "#ffffff",
      surfaceAlt: "#eef2ff",
      text: "#111827",
      muted: "#667085",
      border: "#dcdff1",
      accent: "#8b5cf6",
      accentStrong: "#5b21b6",
      accentSoft: "#ede9fe",
      success: "#16a34a",
      warning: "#f97316",
      danger: "#dc2626"
    }
  },
  resources: [
    { id: "power", name: "Power", description: "Stored solar energy for colony systems." },
    { id: "ice", name: "Ice", description: "Frozen resource deposits near the landing site." },
    { id: "water", name: "Water", description: "Processed water for people, crops, and oxygen." },
    { id: "oxygen", name: "Oxygen", description: "Breathable air reserves." },
    { id: "regolith", name: "Regolith", description: "Useful dust, rock, and sample material." },
    { id: "ore", name: "Ore", description: "Raw mineral feedstock." },
    { id: "alloys", name: "Alloys", description: "Refined construction material." },
    { id: "components", name: "Components", description: "Fabricated parts for expansion." },
    { id: "crops", name: "Crops", description: "Fresh food grown under glass." },
    { id: "research", name: "Research", description: "Scientific progress and useful discoveries." },
    { id: "morale", name: "Morale", description: "How much the crew believes tomorrow will work." }
  ],
  recipes: [
    {
      id: "collect_power",
      name: "Collect Power",
      durationMs: 1800,
      inputs: {},
      outputs: { power: 4 }
    },
    {
      id: "drill_ice",
      name: "Drill Ice",
      durationMs: 2400,
      inputs: { power: 1 },
      outputs: { ice: 3 }
    },
    {
      id: "process_water",
      name: "Process Water",
      durationMs: 2800,
      inputs: { ice: 2, power: 1 },
      outputs: { water: 2 }
    },
    {
      id: "make_oxygen",
      name: "Make Oxygen",
      durationMs: 3200,
      inputs: { water: 2, power: 1 },
      outputs: { oxygen: 3 }
    },
    {
      id: "scoop_regolith",
      name: "Scoop Regolith",
      durationMs: 2600,
      inputs: { power: 1 },
      outputs: { regolith: 3, ore: 1 }
    },
    {
      id: "smelt_alloys",
      name: "Smelt Alloys",
      durationMs: 4200,
      inputs: { ore: 3, power: 2 },
      outputs: { alloys: 2 }
    },
    {
      id: "fabricate_components",
      name: "Fabricate Components",
      durationMs: 4600,
      inputs: { alloys: 2, power: 2 },
      outputs: { components: 1 }
    },
    {
      id: "grow_crops",
      name: "Grow Crops",
      durationMs: 5200,
      inputs: { water: 2, oxygen: 2, power: 1 },
      outputs: { crops: 2 }
    },
    {
      id: "analyze_samples",
      name: "Analyze Samples",
      durationMs: 4400,
      inputs: { regolith: 2, oxygen: 1 },
      outputs: { research: 2 }
    },
    {
      id: "support_habitat",
      name: "Support Habitat",
      durationMs: 5600,
      inputs: { crops: 2, oxygen: 2, power: 2 },
      outputs: { morale: 2 }
    }
  ],
  buildings: [
    {
      id: "solar_mast",
      name: "Solar Mast",
      description: "The first panel array keeping the lights alive.",
      category: "power",
      size: { width: 1, height: 1 },
      cost: 0,
      recipeId: "collect_power",
      color: "#f59e0b",
      icon: "bolt"
    },
    {
      id: "ice_drill",
      name: "Ice Drill",
      description: "Chews into frozen deposits near the landing zone.",
      category: "extraction",
      size: { width: 1, height: 1 },
      cost: 55,
      recipeId: "drill_ice",
      color: "#38bdf8",
      icon: "crusher"
    },
    {
      id: "water_processor",
      name: "Water Processor",
      description: "Turns rough ice into something the crew can use.",
      category: "life_support",
      size: { width: 2, height: 1 },
      cost: 90,
      recipeId: "process_water",
      color: "#0ea5e9",
      icon: "gear"
    },
    {
      id: "oxygenator",
      name: "Oxygenator",
      description: "Makes the base feel less like a sealed metal mistake.",
      category: "life_support",
      size: { width: 2, height: 1 },
      cost: 120,
      recipeId: "make_oxygen",
      color: "#22c55e",
      icon: "fans"
    },
    {
      id: "regolith_scoop",
      name: "Regolith Scoop",
      description: "Collects surface material and occasional useful ore.",
      category: "extraction",
      size: { width: 1, height: 1 },
      cost: 70,
      recipeId: "scoop_regolith",
      color: "#94a3b8",
      icon: "scrap"
    },
    {
      id: "alloy_kiln",
      name: "Alloy Kiln",
      description: "Smelts ore into colony-grade construction stock.",
      category: "industry",
      size: { width: 2, height: 2 },
      cost: 180,
      recipeId: "smelt_alloys",
      color: "#f97316",
      icon: "flame"
    },
    {
      id: "fab_bench",
      name: "Fab Bench",
      description: "Fabricates the parts that make expansion possible.",
      category: "fabrication",
      size: { width: 2, height: 1 },
      cost: 260,
      recipeId: "fabricate_components",
      color: "#a855f7",
      icon: "tools"
    },
    {
      id: "hydroponics_bay",
      name: "Hydroponics Bay",
      description: "Grows food, oxygen confidence, and a little hope.",
      category: "habitat",
      size: { width: 2, height: 2 },
      cost: 240,
      recipeId: "grow_crops",
      color: "#16a34a",
      icon: "station"
    },
    {
      id: "research_lab",
      name: "Research Lab",
      description: "Turns weird dust into useful decisions.",
      category: "science",
      size: { width: 2, height: 1 },
      cost: 320,
      recipeId: "analyze_samples",
      color: "#6366f1",
      icon: "ideas"
    },
    {
      id: "habitat_dome",
      name: "Habitat Dome",
      description: "A better living module for a crew with a future.",
      category: "habitat",
      size: { width: 3, height: 2 },
      cost: 420,
      recipeId: "support_habitat",
      color: "#14b8a6",
      icon: "workers"
    }
  ],
  contracts: [
    {
      id: "first_water",
      name: "Water Reserve",
      description: "Make the first dependable water buffer.",
      requires: { water: 8 },
      rewardCash: 120,
      unlockIds: ["oxygenator", "regolith_scoop", "breathable_start"]
    },
    {
      id: "breathable_start",
      name: "Breathable Start",
      description: "Build up enough oxygen to stop everyone staring at the gauge.",
      requires: { oxygen: 10 },
      rewardCash: 180,
      unlockIds: ["alloy_kiln", "ore_survey"]
    },
    {
      id: "ore_survey",
      name: "Ore Survey",
      description: "Collect surface material and map the useful bits.",
      requires: { regolith: 10, ore: 4 },
      rewardCash: 190,
      unlockIds: ["hydroponics_bay", "solar_tracking"]
    },
    {
      id: "first_alloys",
      name: "First Alloys",
      description: "Refine enough material to build beyond the landing kit.",
      requires: { alloys: 8 },
      rewardCash: 280,
      unlockIds: ["fab_bench", "oxygen_discipline"]
    },
    {
      id: "food_loop",
      name: "Food Loop",
      description: "Prove the crew can grow something better than excuses.",
      requires: { crops: 8 },
      rewardCash: 320,
      unlockIds: ["research_lab", "greenhouse_focus"]
    },
    {
      id: "parts_manifest",
      name: "Parts Manifest",
      description: "Fabricate a proper inventory of expansion components.",
      requires: { components: 6 },
      rewardCash: 420,
      unlockIds: ["habitat_dome", "fabrication_jigs"]
    },
    {
      id: "science_packet",
      name: "Science Packet",
      description: "Send home enough research to earn another supply window.",
      requires: { research: 8 },
      rewardCash: 460,
      unlockIds: ["sample_burst", "base_expansion"]
    },
    {
      id: "crew_comfort",
      name: "Crew Comfort",
      description: "Make the outpost feel like a place people can choose.",
      requires: { morale: 8, crops: 6 },
      rewardCash: 680,
      unlockIds: ["habitat_protocols", "frontier_charter"]
    },
    {
      id: "frontier_charter",
      name: "Frontier Charter",
      description: "A repeatable mature-colony shipment of science and systems.",
      requires: { components: 8, research: 10, morale: 8 },
      rewardCash: 980,
      unlockIds: [],
      repeatable: true
    }
  ],
  upgrades: [
    {
      id: "solar_tracking",
      name: "Solar Tracking",
      description: "Power systems work 30% faster.",
      cost: 180,
      effect: {
        productionMultipliers: [{ category: "power", multiplier: 1.3 }]
      }
    },
    {
      id: "oxygen_discipline",
      name: "Leak Discipline",
      description: "Life support systems work 25% faster.",
      cost: 260,
      effect: {
        productionMultipliers: [{ category: "life_support", multiplier: 1.25 }]
      }
    },
    {
      id: "greenhouse_focus",
      name: "Growth Lamps",
      description: "Habitat systems work 25% faster.",
      cost: 340,
      effect: {
        productionMultipliers: [{ category: "habitat", multiplier: 1.25 }]
      }
    },
    {
      id: "fabrication_jigs",
      name: "Fabrication Jigs",
      description: "Fabrication systems work 30% faster.",
      cost: 420,
      effect: {
        productionMultipliers: [{ category: "fabrication", multiplier: 1.3 }]
      }
    },
    {
      id: "habitat_protocols",
      name: "Habitat Protocols",
      description: "Science and habitat work both improve.",
      cost: 560,
      effect: {
        productionMultipliers: [
          { category: "science", multiplier: 1.25 },
          { category: "habitat", multiplier: 1.2 }
        ]
      }
    },
    {
      id: "base_expansion",
      name: "Survey the Ridge",
      description: "Expand the outpost footprint for larger modules.",
      cost: 620,
      effect: {
        expandGrid: { width: 4, height: 2 }
      }
    }
  ],
  actions: [
    {
      id: "emergency_supply",
      name: "Emergency Supply Drop",
      description: "Spend cash to patch the colony's water and oxygen reserves.",
      costCash: 45,
      cooldownMs: 24_000,
      effect: {
        resources: { water: 4, oxygen: 4 }
      },
      icon: "package"
    },
    {
      id: "sample_burst",
      name: "Sample Burst",
      description: "Spend power to quickly collect extra research samples.",
      costCash: 35,
      costResources: { power: 6 },
      cooldownMs: 30_000,
      effect: {
        resources: { regolith: 6, research: 2 }
      },
      icon: "ideas"
    },
    {
      id: "power_ration",
      name: "Power Ration",
      description: "Double life support speed during a short operational push.",
      costCash: 70,
      costResources: { power: 8 },
      cooldownMs: 40_000,
      effect: {
        productionBoost: { category: "life_support", multiplier: 2, durationMs: 18_000 }
      },
      icon: "bolt"
    }
  ],
  markets: [
    {
      id: "mission-control",
      name: "Mission Control",
      description: "Earth-side sponsors who reward stable systems and clear science returns.",
      demand: 1.05,
      rewardMultiplier: 1.1,
      qualityMultiplier: 1.1
    },
    {
      id: "frontier-settlers",
      name: "Frontier Settlers",
      description: "Future colonists who care about comfort, resilience, and morale.",
      demand: 0.9,
      rewardMultiplier: 1.2,
      qualityMultiplier: 1.25
    }
  ],
  projects: [
    {
      id: "stabilize_outpost",
      name: "Stabilize Outpost",
      description: "Turn the landing kit into a base that can survive its first season.",
      marketId: "mission-control",
      rewardCash: 320,
      unlockIds: ["first_alloys", "food_loop"],
      phases: [
        { id: "power", name: "Power", durationMs: 4_000, qualityFromResources: { power: 2 }, risk: 1 },
        { id: "extraction", name: "Ice", durationMs: 5_000, qualityFromResources: { ice: 2, regolith: 1 }, risk: 2 },
        { id: "life_support", name: "Water/Oxygen", durationMs: 7_000, qualityFromResources: { water: 2, oxygen: 2 }, risk: 4 },
        { id: "industry", name: "Materials", durationMs: 6_000, qualityFromResources: { alloys: 2 }, risk: 2 },
        { id: "science", name: "Report", durationMs: 5_000, qualityFromResources: { research: 2 }, risk: -1 }
      ]
    },
    {
      id: "habitat_charter_project",
      name: "Habitat Charter",
      description: "Prepare a base people could actually live in long-term.",
      marketId: "frontier-settlers",
      costCash: 180,
      requiredResources: { components: 1 },
      rewardCash: 720,
      unlockIds: ["frontier_charter"],
      phases: [
        { id: "fabrication", name: "Build Modules", durationMs: 7_000, qualityFromResources: { components: 3 }, risk: 2 },
        { id: "habitat", name: "Life Inside", durationMs: 7_000, qualityFromResources: { crops: 2, morale: 2 }, risk: 1 },
        { id: "science", name: "Charter", durationMs: 5_000, qualityFromResources: { research: 3 }, risk: -1 }
      ]
    }
  ],
  events: [
    {
      id: "dust-warning",
      name: "Dust Warning",
      description: "A dust front is approaching the ridge. Power and morale are both at risk.",
      trigger: { elapsedMs: 32_000 },
      choices: [
        {
          id: "secure-panels",
          label: "Secure Panels",
          description: "Protect infrastructure and accept slower progress.",
          effect: { morale: -3, projectRisk: -5, resources: { power: -3 } }
        },
        {
          id: "ride-it-out",
          label: "Ride It Out",
          description: "Keep the schedule, but the base gets riskier.",
          effect: { projectRisk: 8, projectQuality: 2 }
        }
      ]
    },
    {
      id: "crew-birthday",
      name: "Crew Birthday",
      description: "A small celebration could matter more than the schedule admits.",
      trigger: { unlockedId: "hydroponics_bay" },
      choices: [
        {
          id: "grow-dinner",
          label: "Grow Dinner",
          description: "Spend crops to lift morale.",
          effect: { resources: { crops: -1, morale: 3 }, morale: 8, projectQuality: 2 }
        },
        {
          id: "keep-working",
          label: "Keep Working",
          description: "Stay focused, at a morale cost.",
          effect: { projectQuality: 4, morale: -5 }
        }
      ]
    }
  ],
  staffRoles: [
    { id: "engineer", name: "Systems Engineer", category: "power", baseWage: 0.18 },
    { id: "miner", name: "Extraction Tech", category: "extraction", baseWage: 0.16 },
    { id: "medic", name: "Life Support Medic", category: "life_support", baseWage: 0.19 },
    { id: "fabricator", name: "Fabricator", category: "fabrication", baseWage: 0.2 },
    { id: "scientist", name: "Scientist", category: "science", baseWage: 0.2 },
    { id: "habitat-lead", name: "Habitat Lead", category: "habitat", baseWage: 0.18 }
  ],
  staffCandidates: [
    { id: "candidate-iko", name: "Iko Tan", roleId: "engineer", hireCost: 210, level: 2, traits: ["calm", "systems"], morale: 76 },
    { id: "candidate-sana", name: "Sana Voss", roleId: "medic", hireCost: 230, level: 2, traits: ["careful", "steady"], morale: 82 },
    { id: "candidate-marek", name: "Marek Sol", roleId: "scientist", hireCost: 260, level: 2, traits: ["curious", "night shift"], morale: 70 }
  ],
  startingState: {
    grid: { width: 8, height: 6 },
    cash: 320,
    resources: {
      power: 12,
      ice: 8,
      water: 0,
      oxygen: 0,
      regolith: 0,
      ore: 0,
      alloys: 0,
      components: 0,
      crops: 0,
      research: 0,
      morale: 0
    },
    unlockedIds: [
      "solar_mast",
      "ice_drill",
      "water_processor",
      "first_water",
      "emergency_supply",
      "stabilize_outpost"
    ]
  }
};
