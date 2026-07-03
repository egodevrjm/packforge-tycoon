import type { TycoonGamePack } from "@packforge/core";

export const festivalPack: TycoonGamePack = {
  id: "festival",
  theme: {
    title: "Festival Tycoon",
    subtitle: "Grow from a back-room gig into a must-play weekend festival.",
    description:
      "Book artists, win over the local crowd, sell early tickets, survive messy show nights, and turn one tiny gig into a field full of fans.",
    visual: {
      icon: "audio",
      illustration: "festival",
      sceneImage: "/assets/key-art/festival-gig-to-field.png",
      logoImage: "/assets/key-art/festival-gig-to-field.png"
    },
    palette: {
      soil: "#1f2937",
      grid: "#a5b4fc",
      accent: "#7c3aed",
      panel: "#ffffff"
    },
    ui: {
      background: "#f7f4ff",
      surface: "#ffffff",
      surfaceAlt: "#f1eaff",
      text: "#111827",
      muted: "#6b7280",
      border: "#ddd6fe",
      accent: "#7c3aed",
      accentStrong: "#5b21b6",
      accentSoft: "#ede9fe",
      success: "#16a34a",
      warning: "#f97316",
      danger: "#dc2626"
    }
  },
  resources: [
    { id: "artists", name: "Artists", description: "Booked performers, opener slots, and the first names on the poster." },
    { id: "stages", name: "Stages", description: "Rooms, risers, outdoor rigs, and playable performance capacity." },
    { id: "sound", name: "Sound", description: "Audio equipment, tech checks, and loud competence." },
    { id: "vendors", name: "Vendors", description: "Food, drinks, merch, and useful queues." },
    { id: "hype", name: "Hype", description: "Street posters, local chatter, shares, rumors, and the precious feeling that this might be a thing." },
    { id: "tickets", name: "Tickets", description: "Sold passes, guest lists, early birds, and committed audience demand." },
    { id: "logistics", name: "Logistics", description: "Permits, power, fencing, toilets, and the unglamorous truth." },
    { id: "reputation", name: "Reputation", description: "Proof that the event is worth coming back for." }
  ],
  recipes: [
    { id: "book_artists", name: "Book Artists", durationMs: 2200, inputs: {}, outputs: { artists: 3 } },
    { id: "build_stage", name: "Build Stage", durationMs: 3000, inputs: { logistics: 1 }, outputs: { stages: 2 } },
    { id: "sound_check", name: "Sound Check", durationMs: 2800, inputs: { stages: 1 }, outputs: { sound: 3 } },
    { id: "vendor_outreach", name: "Vendor Outreach", durationMs: 2600, inputs: {}, outputs: { vendors: 3 } },
    { id: "permit_run", name: "Permit Run", durationMs: 2400, inputs: {}, outputs: { logistics: 3 } },
    { id: "poster_campaign", name: "Poster Campaign", durationMs: 3200, inputs: { artists: 1 }, outputs: { hype: 4 } },
    { id: "ticket_push", name: "Ticket Push", durationMs: 4200, inputs: { hype: 3, sound: 1 }, outputs: { tickets: 3 } },
    { id: "run_show", name: "Run Show", durationMs: 5200, inputs: { artists: 2, stages: 1, sound: 2, vendors: 1 }, outputs: { reputation: 2, tickets: 2 } }
  ],
  buildings: [
    {
      id: "artist_roster",
      name: "Back Room Booker",
      description: "A laptop, a phone, and enough taste to convince local artists to take a chance.",
      category: "booking",
      size: { width: 1, height: 1 },
      cost: 0,
      recipeId: "book_artists",
      color: "#ec4899",
      icon: "audio"
    },
    {
      id: "permit_clipboard",
      name: "Permit Folder",
      description: "Keeps the show legally boring, which is secretly the best kind of boring.",
      category: "logistics",
      size: { width: 1, height: 1 },
      cost: 45,
      recipeId: "permit_run",
      color: "#64748b",
      icon: "clipboard"
    },
    {
      id: "community_stage",
      name: "Club Stage",
      description: "A cramped stage with good lights, loud monitors, and just enough magic.",
      category: "production",
      size: { width: 2, height: 1 },
      cost: 80,
      recipeId: "build_stage",
      color: "#7c3aed",
      icon: "station"
    },
    {
      id: "sound_tent",
      name: "Sound Desk",
      description: "Turns cables, favors, and nervous sound checks into a show people can actually hear.",
      category: "production",
      size: { width: 2, height: 1 },
      cost: 110,
      recipeId: "sound_check",
      color: "#2563eb",
      icon: "audio"
    },
    {
      id: "vendor_lane",
      name: "Food Truck Row",
      description: "Adds food, merch, coffee, and reasons for guests to stay past the opener.",
      category: "vendors",
      size: { width: 2, height: 1 },
      cost: 120,
      recipeId: "vendor_outreach",
      color: "#f59e0b",
      icon: "package"
    },
    {
      id: "poster_wall",
      name: "Poster Run",
      description: "Old-school promotion that still works when the art is good and the tape holds.",
      category: "marketing",
      size: { width: 1, height: 1 },
      cost: 95,
      recipeId: "poster_campaign",
      color: "#06b6d4",
      icon: "megaphone"
    },
    {
      id: "ticket_booth",
      name: "Door & Tickets",
      description: "Converts attention into actual attendance, wristbands, and a queue outside.",
      category: "sales",
      size: { width: 2, height: 1 },
      cost: 170,
      recipeId: "ticket_push",
      color: "#22c55e",
      icon: "coin"
    },
    {
      id: "main_stage_ops",
      name: "Main Field Ops",
      description: "Coordinates the field, stage turns, sponsors, vendors, crowd flow, and the story people tell afterwards.",
      category: "operations",
      size: { width: 3, height: 2 },
      cost: 320,
      recipeId: "run_show",
      color: "#ef4444",
      icon: "rocket"
    }
  ],
  contracts: [
    {
      id: "first_lineup",
      name: "Back Room Lineup",
      description: "Book enough local artists to make the first poster worth printing.",
      requires: { artists: 8 },
      rewardCash: 130,
      unlockIds: ["community_stage", "sound_tent", "sound_ready"]
    },
    {
      id: "sound_ready",
      name: "First Club Night",
      description: "Get the stage and sound together for a sweaty room that feels bigger than it is.",
      requires: { stages: 6, sound: 8 },
      rewardCash: 220,
      unlockIds: ["vendor_lane", "poster_wall", "poster_blast"]
    },
    {
      id: "poster_blast",
      name: "Street Poster Run",
      description: "Create enough buzz that people start asking where they can get tickets.",
      requires: { hype: 12 },
      rewardCash: 260,
      unlockIds: ["ticket_booth", "early_bird"]
    },
    {
      id: "early_bird",
      name: "Early Bird Field Tickets",
      description: "Turn hype into committed audience before the outdoor costs get scary.",
      requires: { tickets: 10 },
      rewardCash: 380,
      unlockIds: ["main_stage_ops", "vendor_sponsor"]
    },
    {
      id: "vendor_sponsor",
      name: "Food Truck Sponsor Row",
      description: "Bundle artists, vendors, and audience proof into a sponsor pitch for the first field event.",
      requires: { vendors: 10, tickets: 8, hype: 8 },
      rewardCash: 520,
      unlockIds: ["festival_expansion", "headline_weekend"]
    },
    {
      id: "headline_weekend",
      name: "Headline Weekend",
      description: "A repeatable mature festival weekend with a real crowd, proper queues, and stories by Monday.",
      requires: { reputation: 8, tickets: 14, logistics: 10 },
      rewardCash: 820,
      unlockIds: [],
      repeatable: true
    }
  ],
  upgrades: [
    {
      id: "booking_network",
      name: "Booking Network",
      description: "Booking work is 30% faster.",
      cost: 180,
      effect: { productionMultipliers: [{ category: "booking", multiplier: 1.3 }] }
    },
    {
      id: "stage_rigging",
      name: "Stage Rigging",
      description: "Production stations build output faster.",
      cost: 260,
      effect: { productionMultipliers: [{ category: "production", multiplier: 1.25 }] }
    },
    {
      id: "street_team",
      name: "Street Team",
      description: "Marketing creates hype faster.",
      cost: 300,
      effect: { productionMultipliers: [{ category: "marketing", multiplier: 1.35 }] }
    },
    {
      id: "box_office_flow",
      name: "Box Office Flow",
      description: "Sales stations convert hype into tickets faster.",
      cost: 380,
      effect: { productionMultipliers: [{ category: "sales", multiplier: 1.3 }] }
    },
    {
      id: "festival_expansion",
      name: "Open the Second Field",
      description: "Expand the festival grounds for bigger operations.",
      cost: 680,
      effect: { expandGrid: { width: 4, height: 2 } }
    }
  ],
  actions: [
    {
      id: "local_radio_spot",
      name: "Local Radio Spot",
      description: "Spend cash to create a burst of hype.",
      costCash: 50,
      cooldownMs: 22_000,
      effect: { resources: { hype: 8 } },
      icon: "megaphone"
    },
    {
      id: "artist_takeover",
      name: "Artist Takeover",
      description: "Use artists and hype to sell a batch of tickets.",
      costCash: 65,
      costResources: { artists: 2, hype: 2 },
      cooldownMs: 30_000,
      effect: { resources: { tickets: 5 } },
      icon: "audio"
    },
    {
      id: "volunteer_push",
      name: "Volunteer Push",
      description: "Double logistics output during a short operations sprint.",
      costCash: 90,
      costResources: { hype: 4 },
      cooldownMs: 40_000,
      effect: { productionBoost: { category: "logistics", multiplier: 2, durationMs: 18_000 } },
      icon: "workers"
    }
  ],
  markets: [
    {
      id: "local-crowd",
      name: "Local Crowd",
      description: "Affordable shows with familiar artists, friendly door prices, and low friction.",
      demand: 1.18,
      rewardMultiplier: 1.08,
      qualityMultiplier: 1
    },
    {
      id: "destination-fans",
      name: "Destination Fans",
      description: "Traveling fans who reward strong lineups, smooth logistics, and a weekend that feels worth the journey.",
      demand: 0.86,
      rewardMultiplier: 1.24,
      qualityMultiplier: 1.28
    }
  ],
  projects: [
    {
      id: "first_showcase",
      name: "Back Room Gig",
      description: "Run a compact local show, prove people will turn up, and earn the right to think bigger.",
      marketId: "local-crowd",
      rewardCash: 300,
      unlockIds: ["poster_blast", "local_radio_spot"],
      phases: [
        { id: "booking", name: "Book the Bill", durationMs: 4_000, qualityFromResources: { artists: 2 }, risk: 1 },
        { id: "production", name: "Build the Room", durationMs: 5_000, qualityFromResources: { stages: 2, sound: 2 }, risk: 2 },
        { id: "marketing", name: "Pack the Posters", durationMs: 5_000, qualityFromResources: { hype: 2 }, risk: 1 },
        { id: "operations", name: "Run the Night", durationMs: 6_000, qualityFromResources: { reputation: 2 }, risk: 3 }
      ]
    },
    {
      id: "weekend_festival",
      name: "First Field Festival",
      description: "Stretch from the club into the field with sponsors, ticketing, crowd flow, and a real weekend crowd.",
      marketId: "destination-fans",
      costCash: 180,
      requiredResources: { tickets: 2 },
      rewardCash: 700,
      unlockIds: ["headline_weekend"],
      phases: [
        { id: "booking", name: "Lock the Lineup", durationMs: 6_000, qualityFromResources: { artists: 3 }, risk: 2 },
        { id: "logistics", name: "Open the Field", durationMs: 6_000, qualityFromResources: { logistics: 3 }, risk: 2 },
        { id: "sales", name: "Sell the Weekend", durationMs: 5_000, qualityFromResources: { tickets: 3, hype: 2 }, risk: 1 },
        { id: "operations", name: "Run the Festival", durationMs: 7_000, qualityFromResources: { reputation: 3, vendors: 2 }, risk: 2 }
      ]
    }
  ],
  events: [
    {
      id: "weather-watch",
      name: "Weather Watch",
      description: "The forecast turns uncertain just as the outdoor schedule locks.",
      trigger: { elapsedMs: 30_000 },
      choices: [
        {
          id: "rent-cover",
          label: "Rent Cover",
          description: "Spend logistics to lower risk.",
          effect: { resources: { logistics: -2 }, projectRisk: -5, projectQuality: 1 }
        },
        {
          id: "keep-budget",
          label: "Keep Budget",
          description: "Save cash, but the show becomes riskier.",
          effect: { cash: 40, projectRisk: 7 }
        }
      ]
    },
    {
      id: "surprise-act",
      name: "Surprise Act",
      description: "A beloved local artist offers to play if you can squeeze them onto the bill.",
      trigger: { unlockedId: "ticket_booth" },
      choices: [
        {
          id: "add-slot",
          label: "Add Slot",
          description: "Boost hype and quality at an operations cost.",
          effect: { resources: { artists: 2, hype: 5 }, projectQuality: 4, projectRisk: 2 }
        },
        {
          id: "protect-schedule",
          label: "Protect Schedule",
          description: "Keep the plan clean and lower risk.",
          effect: { projectRisk: -3, morale: 2 }
        }
      ]
    }
  ],
  staffRoles: [
    { id: "booker", name: "Booker", category: "booking", baseWage: 0.15 },
    { id: "stage-tech", name: "Stage Tech", category: "production", baseWage: 0.17 },
    { id: "site-manager", name: "Site Manager", category: "logistics", baseWage: 0.18 },
    { id: "promoter", name: "Promoter", category: "marketing", baseWage: 0.15 },
    { id: "box-office-lead", name: "Box Office Lead", category: "sales", baseWage: 0.16 },
    { id: "ops-producer", name: "Ops Producer", category: "operations", baseWage: 0.2 }
  ],
  staffCandidates: [
    { id: "candidate-rhea", name: "Rhea Moon", roleId: "booker", hireCost: 155, level: 1, traits: ["taste", "networked"], morale: 78 },
    { id: "candidate-joss", name: "Joss Lane", roleId: "stage-tech", hireCost: 185, level: 2, traits: ["calm", "technical"], morale: 76 },
    { id: "candidate-amal", name: "Amal Cross", roleId: "site-manager", hireCost: 210, level: 2, traits: ["organized", "direct"], morale: 74 }
  ],
  startingState: {
    grid: { width: 8, height: 6 },
    cash: 280,
    resources: {
      artists: 0,
      stages: 0,
      sound: 0,
      vendors: 0,
      hype: 0,
      tickets: 0,
      logistics: 6,
      reputation: 0
    },
    unlockedIds: ["artist_roster", "permit_clipboard", "community_stage", "first_lineup", "first_showcase"]
  }
};
