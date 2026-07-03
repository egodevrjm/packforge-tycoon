import type { TycoonGamePack } from "@packforge/core";

export const gameStudioPack: TycoonGamePack = {
  id: "game-studio",
  theme: {
    title: "Indie Studio Tycoon",
    subtitle: "Grow from laptop gigs into a hit-making studio.",
    description:
      "A management pack about building small games, hiring specialists, taking publishing contracts, and turning prototypes into fans.",
    visual: {
      icon: "gamepad",
      illustration: "studio",
      sceneImage: "/assets/key-art/indie-studio-room.png",
      logoImage: "/assets/ui/studio-logo-mark.png"
    },
    palette: {
      soil: "#3c4250",
      grid: "#687184",
      accent: "#67d4ff",
      panel: "#20242c"
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
    { id: "ideas", name: "Ideas", description: "Raw concepts, sketches, and half-awake shower thoughts." },
    { id: "design", name: "Design", description: "Structured mechanics and production-ready plans." },
    { id: "code", name: "Code", description: "Playable systems and technical implementation." },
    { id: "art", name: "Art", description: "Visual assets, animation, UI, and polish." },
    { id: "audio", name: "Audio", description: "Music, sound effects, and juice." },
    { id: "builds", name: "Builds", description: "Playable versions ready for testing or delivery." },
    { id: "hype", name: "Hype", description: "Attention from trailers, demos, and community posts." },
    { id: "fans", name: "Fans", description: "People who care about what the studio ships." },
    { id: "reputation", name: "Reputation", description: "Trust from publishers and players." },
    { id: "revenue", name: "Revenue", description: "Sales, advances, and contract payouts." }
  ],
  recipes: [
    {
      id: "brainstorm_ideas",
      name: "Brainstorm Ideas",
      durationMs: 1800,
      inputs: {},
      outputs: { ideas: 3 }
    },
    {
      id: "write_designs",
      name: "Write Designs",
      durationMs: 2600,
      inputs: { ideas: 2 },
      outputs: { design: 2 }
    },
    {
      id: "write_code",
      name: "Write Code",
      durationMs: 3200,
      inputs: { design: 1 },
      outputs: { code: 2 }
    },
    {
      id: "make_art",
      name: "Make Art",
      durationMs: 3200,
      inputs: { design: 1 },
      outputs: { art: 2 }
    },
    {
      id: "compose_audio",
      name: "Compose Audio",
      durationMs: 3600,
      inputs: { ideas: 1 },
      outputs: { audio: 2 }
    },
    {
      id: "create_build",
      name: "Create Build",
      durationMs: 4600,
      inputs: { code: 3, art: 2 },
      outputs: { builds: 1 }
    },
    {
      id: "market_demo",
      name: "Market Demo",
      durationMs: 4000,
      inputs: { builds: 1 },
      outputs: { hype: 3, fans: 2 }
    },
    {
      id: "ship_game",
      name: "Ship Game",
      durationMs: 5600,
      inputs: { builds: 2, hype: 4, audio: 2 },
      outputs: { revenue: 6, reputation: 2, fans: 4 }
    }
  ],
  buildings: [
    {
      id: "garage_desk",
      name: "Garage Desk",
      description: "A battered desk where every studio starts.",
      category: "creative",
      size: { width: 1, height: 1 },
      cost: 0,
      recipeId: "brainstorm_ideas",
      color: "#67d4ff"
    },
    {
      id: "design_corner",
      name: "Design Corner",
      description: "Turns raw ideas into real game plans.",
      category: "design",
      size: { width: 1, height: 1 },
      cost: 60,
      recipeId: "write_designs",
      color: "#8cc46f"
    },
    {
      id: "code_pod",
      name: "Code Pod",
      description: "Builds systems, tools, and playable mechanics.",
      category: "engineering",
      size: { width: 1, height: 1 },
      cost: 110,
      recipeId: "write_code",
      color: "#6f91c2"
    },
    {
      id: "art_station",
      name: "Art Station",
      description: "Creates visuals that make the game readable and charming.",
      category: "art",
      size: { width: 1, height: 1 },
      cost: 115,
      recipeId: "make_art",
      color: "#d49b4d"
    },
    {
      id: "audio_booth",
      name: "Audio Booth",
      description: "Adds music, effects, and feedback.",
      category: "audio",
      size: { width: 1, height: 1 },
      cost: 130,
      recipeId: "compose_audio",
      color: "#9860a6"
    },
    {
      id: "qa_rig",
      name: "QA Rig",
      description: "Packages code and assets into playable builds.",
      category: "production",
      size: { width: 1, height: 1 },
      cost: 180,
      recipeId: "create_build",
      color: "#c7834d"
    },
    {
      id: "community_corner",
      name: "Community Corner",
      description: "Turns demos into hype and fans.",
      category: "marketing",
      size: { width: 1, height: 1 },
      cost: 220,
      recipeId: "market_demo",
      color: "#56a66b"
    },
    {
      id: "launch_room",
      name: "Launch Room",
      description: "Ships finished games and grows the studio's reputation.",
      category: "publishing",
      size: { width: 2, height: 1 },
      cost: 340,
      recipeId: "ship_game",
      color: "#d46a3a"
    }
  ],
  contracts: [
    {
      id: "first_pitch",
      name: "First Client Pitch",
      description: "A local shop wants a tiny playable pitch.",
      requires: { design: 6 },
      rewardCash: 100,
      unlockIds: ["code_pod", "art_station", "code_crunch", "art_jam"]
    },
    {
      id: "prototype_contract",
      name: "Prototype Contract",
      description: "Build a rough but playable demo for a small publisher.",
      requires: { code: 8, art: 4 },
      rewardCash: 220,
      unlockIds: ["qa_rig", "audio_booth", "faster_design", "microgame_bundle"]
    },
    {
      id: "microgame_bundle",
      name: "Microgame Bundle",
      description: "Package three tiny games for a community showcase.",
      requires: { design: 8, code: 6, art: 6 },
      rewardCash: 260,
      unlockIds: ["audio_booth", "playtest_night"]
    },
    {
      id: "festival_demo",
      name: "Festival Demo",
      description: "Prepare a demo people will actually stop to play.",
      requires: { builds: 3, audio: 4 },
      rewardCash: 360,
      unlockIds: ["community_corner", "engineering_focus", "community_post", "press_preview"]
    },
    {
      id: "press_preview",
      name: "Press Preview",
      description: "Give journalists a build with enough style to write about.",
      requires: { builds: 2, art: 8, hype: 6 },
      rewardCash: 430,
      unlockIds: ["launch_room", "streamer_push"]
    },
    {
      id: "early_access",
      name: "Early Access Launch",
      description: "Release a public build and start building an audience.",
      requires: { builds: 4, hype: 8, fans: 6 },
      rewardCash: 620,
      unlockIds: ["launch_room", "art_pipeline", "launch_party", "console_port"]
    },
    {
      id: "console_port",
      name: "Console Port",
      description: "Adapt your game for a new platform audience.",
      requires: { code: 12, builds: 5, reputation: 3 },
      rewardCash: 760,
      unlockIds: ["audio_pipeline", "publishing_tools"]
    },
    {
      id: "publisher_deal",
      name: "Publisher Deal",
      description: "Ship something polished enough for a proper deal.",
      requires: { revenue: 8, reputation: 4, fans: 12 },
      rewardCash: 1000,
      unlockIds: ["marketing_push", "sequel_pitch"]
    },
    {
      id: "sequel_pitch",
      name: "Sequel Pitch",
      description: "Use your audience and reputation to pitch something bigger.",
      requires: { revenue: 12, reputation: 8, fans: 24 },
      rewardCash: 1500,
      unlockIds: ["studio_expansion"]
    }
  ],
  upgrades: [
    {
      id: "faster_design",
      name: "Design Templates",
      description: "Design work completes 25% faster.",
      cost: 180,
      effect: {
        productionMultipliers: [{ category: "design", multiplier: 1.25 }]
      }
    },
    {
      id: "engineering_focus",
      name: "Build Tools",
      description: "Engineering and production move 25% faster.",
      cost: 320,
      effect: {
        productionMultipliers: [
          { category: "engineering", multiplier: 1.25 },
          { category: "production", multiplier: 1.25 }
        ]
      }
    },
    {
      id: "art_pipeline",
      name: "Style Guide",
      description: "Art work completes 30% faster.",
      cost: 360,
      effect: {
        productionMultipliers: [{ category: "art", multiplier: 1.3 }]
      }
    },
    {
      id: "marketing_push",
      name: "Trailer Budget",
      description: "Marketing creates more attention from every demo.",
      cost: 520,
      effect: {
        productionMultipliers: [{ category: "marketing", multiplier: 1.35 }]
      }
    },
    {
      id: "audio_pipeline",
      name: "Sample Library",
      description: "Audio work completes 30% faster.",
      cost: 440,
      effect: {
        productionMultipliers: [{ category: "audio", multiplier: 1.3 }]
      }
    },
    {
      id: "publishing_tools",
      name: "Release Checklist",
      description: "Publishing work completes 30% faster.",
      cost: 640,
      effect: {
        productionMultipliers: [{ category: "publishing", multiplier: 1.3 }]
      }
    },
    {
      id: "streamer_push",
      name: "Creator Outreach",
      description: "Marketing work completes 20% faster and unlocks better launch momentum.",
      cost: 580,
      effect: {
        productionMultipliers: [{ category: "marketing", multiplier: 1.2 }]
      }
    },
    {
      id: "studio_expansion",
      name: "Second Room Lease",
      description: "Expand the studio floor for larger teams.",
      cost: 900,
      effect: {
        expandGrid: { width: 4, height: 2 }
      }
    }
  ],
  actions: [
    {
      id: "brainstorm_jam",
      name: "Brainstorm Jam",
      description: "Spend a little cash to generate a burst of fresh ideas.",
      costCash: 20,
      cooldownMs: 12_000,
      effect: {
        resources: { ideas: 10 }
      },
      icon: "ideas"
    },
    {
      id: "design_sprint",
      name: "Design Sprint",
      description: "Spend ideas and cash to double design speed for a short push.",
      costCash: 35,
      costResources: { ideas: 4 },
      cooldownMs: 25_000,
      effect: {
        productionBoost: { category: "design", multiplier: 2, durationMs: 15_000 }
      },
      icon: "design"
    },
    {
      id: "code_crunch",
      name: "Code Crunch",
      description: "Turn planning pressure into a temporary engineering speed boost.",
      costCash: 55,
      costResources: { design: 3 },
      cooldownMs: 30_000,
      effect: {
        productionBoost: { category: "engineering", multiplier: 2, durationMs: 18_000 }
      },
      icon: "code"
    },
    {
      id: "art_jam",
      name: "Art Jam",
      description: "Give the art team a focused push on style and polish.",
      costCash: 55,
      costResources: { design: 3 },
      cooldownMs: 30_000,
      effect: {
        productionBoost: { category: "art", multiplier: 2, durationMs: 18_000 }
      },
      icon: "art"
    },
    {
      id: "playtest_night",
      name: "Playtest Night",
      description: "Spend a build to learn what players care about.",
      costCash: 70,
      costResources: { builds: 1 },
      cooldownMs: 35_000,
      effect: {
        resources: { fans: 4, reputation: 1 }
      },
      icon: "gamepad"
    },
    {
      id: "community_post",
      name: "Community Post",
      description: "Turn a playable build into attention and early fans.",
      costCash: 65,
      costResources: { builds: 1 },
      cooldownMs: 28_000,
      effect: {
        resources: { hype: 5, fans: 3 }
      },
      icon: "megaphone"
    },
    {
      id: "launch_party",
      name: "Launch Party",
      description: "Spend launch momentum to convert hype into loyal fans.",
      costCash: 140,
      costResources: { hype: 5, revenue: 2 },
      cooldownMs: 45_000,
      effect: {
        resources: { fans: 12, reputation: 2 }
      },
      icon: "reputation"
    }
  ],
  markets: [
    {
      id: "pc-indie",
      name: "PC Indie Audience",
      description: "Players who reward fresh ideas, readable design, and visible polish.",
      demand: 1.15,
      rewardMultiplier: 1.1,
      qualityMultiplier: 1.15
    },
    {
      id: "festival-crowd",
      name: "Festival Crowd",
      description: "A smaller audience that cares about playable demos and surprise.",
      demand: 0.95,
      rewardMultiplier: 1,
      qualityMultiplier: 1.25
    }
  ],
  projects: [
    {
      id: "tiny_game_project",
      name: "Untitled Game",
      description: "A small commercial game built phase by phase by your new studio.",
      marketId: "pc-indie",
      rewardCash: 260,
      unlockIds: ["prototype_contract", "playtest_night"],
      phases: [
        {
          id: "design",
          name: "Design",
          durationMs: 5_000,
          qualityFromResources: { ideas: 1.5, design: 2 },
          risk: 1
        },
        {
          id: "engineering",
          name: "Production",
          durationMs: 7_000,
          qualityFromResources: { code: 2, art: 1 },
          risk: 3
        },
        {
          id: "art",
          name: "Polish",
          durationMs: 6_000,
          qualityFromResources: { art: 2, audio: 1 },
          risk: 1
        },
        {
          id: "production",
          name: "Testing",
          durationMs: 5_000,
          qualityFromResources: { builds: 3 },
          risk: -2
        },
        {
          id: "publishing",
          name: "Release",
          durationMs: 5_000,
          qualityFromResources: { hype: 2, fans: 1 },
          risk: 0
        }
      ]
    },
    {
      id: "festival_demo_project",
      name: "Festival Demo",
      description: "A focused showcase build designed to earn attention before launch.",
      marketId: "festival-crowd",
      costCash: 120,
      requiredResources: { builds: 1 },
      rewardCash: 420,
      unlockIds: ["community_corner", "press_preview"],
      phases: [
        { id: "design", name: "Hook", durationMs: 4_000, qualityFromResources: { design: 2 }, risk: 1 },
        { id: "engineering", name: "Demo Build", durationMs: 7_000, qualityFromResources: { code: 2, builds: 2 }, risk: 2 },
        { id: "marketing", name: "Show Floor", durationMs: 6_000, qualityFromResources: { hype: 3, fans: 1 }, risk: 0 }
      ]
    }
  ],
  events: [
    {
      id: "late-night-bug",
      name: "Late Night Bug",
      description: "A nasty issue appears just as momentum starts building.",
      trigger: { elapsedMs: 35_000 },
      choices: [
        {
          id: "fix-carefully",
          label: "Fix Carefully",
          description: "Lose a little morale but lower release risk.",
          effect: { morale: -4, projectRisk: -5, projectQuality: 2 }
        },
        {
          id: "ship-around-it",
          label: "Ship Around It",
          description: "Keep morale steady but accept extra risk.",
          effect: { projectRisk: 7, resources: { hype: 2 } }
        }
      ]
    },
    {
      id: "streamer-email",
      name: "Streamer Email",
      description: "A small creator asks for an early build.",
      trigger: { unlockedId: "community_corner" },
      choices: [
        {
          id: "send-build",
          label: "Send Build",
          description: "Trade a build for attention.",
          effect: { resources: { hype: 5, fans: 3 }, projectRisk: 1 }
        },
        {
          id: "wait",
          label: "Wait",
          description: "Keep the build private and polish longer.",
          effect: { projectQuality: 4 }
        }
      ]
    }
  ],
  staffRoles: [
    { id: "designer", name: "Designer", category: "design", baseWage: 0.14 },
    { id: "engineer", name: "Engineer", category: "engineering", baseWage: 0.17 },
    { id: "artist", name: "Artist", category: "art", baseWage: 0.16 },
    { id: "producer", name: "Producer", category: "production", baseWage: 0.15 },
    { id: "marketer", name: "Community Lead", category: "marketing", baseWage: 0.15 }
  ],
  staffCandidates: [
    { id: "candidate-maya", name: "Maya Quinn", roleId: "designer", hireCost: 140, level: 1, traits: ["systems", "steady"], morale: 78 },
    { id: "candidate-ori", name: "Ori Patel", roleId: "engineer", hireCost: 190, level: 2, traits: ["tools", "quick"], morale: 72 },
    { id: "candidate-lena", name: "Lena Fox", roleId: "artist", hireCost: 165, level: 1, traits: ["style", "polish"], morale: 80 }
  ],
  startingState: {
    grid: { width: 8, height: 6 },
    cash: 240,
    resources: {
      ideas: 14,
      design: 0,
      code: 0,
      art: 0,
      audio: 0,
      builds: 0,
      hype: 0,
      fans: 0,
      reputation: 0,
      revenue: 0
    },
    unlockedIds: [
      "garage_desk",
      "design_corner",
      "first_pitch",
      "brainstorm_jam",
      "design_sprint",
      "tiny_game_project"
    ]
  }
};
