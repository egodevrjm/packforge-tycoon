import type { TycoonGamePack } from "@packforge/core";

export const boutiqueHotelPack: TycoonGamePack = {
  id: "boutique-hotel",
  theme: {
    title: "Boutique Hotel Tycoon",
    subtitle: "Turn a quiet townhouse into the city's favorite little stay.",
    description:
      "A hospitality management pack about rooms, service, amenities, reviews, events, and guest loyalty.",
    visual: {
      icon: "hotel",
      illustration: "hotel",
      sceneImage: "/assets/key-art/boutique-hotel-lobby.png",
      logoImage: "/assets/key-art/boutique-hotel-lobby.png"
    },
    palette: {
      soil: "#344256",
      grid: "#c7d2fe",
      accent: "#2563eb",
      panel: "#f8fafc"
    },
    ui: {
      background: "#f3f7fb",
      surface: "#ffffff",
      surfaceAlt: "#eaf1fb",
      text: "#111827",
      muted: "#64748b",
      border: "#d8e5f2",
      accent: "#2563eb",
      accentStrong: "#1d4ed8",
      accentSoft: "#dbeafe",
      success: "#16a34a",
      warning: "#f59e0b",
      danger: "#dc2626"
    }
  },
  resources: [
    { id: "rooms", name: "Rooms", description: "Prepared rooms ready for guests." },
    { id: "linen", name: "Linen", description: "Clean sheets, towels, and the quiet promise of comfort." },
    { id: "service", name: "Service", description: "Front desk attention, housekeeping, and thoughtful touches." },
    { id: "breakfast", name: "Breakfast", description: "Morning plates that make reviews warmer." },
    { id: "comfort", name: "Comfort", description: "Room quality, atmosphere, and little luxuries." },
    { id: "reviews", name: "Reviews", description: "Public praise from guests who would stay again." },
    { id: "events", name: "Events", description: "Private bookings, tastings, and local partnerships." },
    { id: "loyalty", name: "Loyalty", description: "Guests who recommend the hotel without being prompted." }
  ],
  recipes: [
    { id: "turn_rooms", name: "Turn Rooms", durationMs: 2200, inputs: { linen: 1 }, outputs: { rooms: 3 } },
    { id: "laundry_run", name: "Laundry Run", durationMs: 2000, inputs: {}, outputs: { linen: 4 } },
    { id: "front_desk_service", name: "Front Desk Service", durationMs: 2500, inputs: { rooms: 1 }, outputs: { service: 3 } },
    { id: "serve_breakfast", name: "Serve Breakfast", durationMs: 3000, inputs: { service: 1 }, outputs: { breakfast: 2 } },
    { id: "style_rooms", name: "Style Rooms", durationMs: 3600, inputs: { rooms: 2, service: 1 }, outputs: { comfort: 2 } },
    { id: "collect_reviews", name: "Collect Reviews", durationMs: 4200, inputs: { comfort: 2, breakfast: 1 }, outputs: { reviews: 2 } },
    { id: "host_salon", name: "Host Salon Night", durationMs: 5000, inputs: { service: 2, comfort: 2 }, outputs: { events: 2, loyalty: 1 } },
    { id: "guest_followup", name: "Guest Follow-Up", durationMs: 4400, inputs: { reviews: 2, service: 1 }, outputs: { loyalty: 2 } }
  ],
  buildings: [
    {
      id: "linen_closet",
      name: "Linen Closet",
      description: "A tiny back-room system that keeps the rooms moving.",
      category: "housekeeping",
      size: { width: 1, height: 1 },
      cost: 0,
      recipeId: "laundry_run",
      color: "#60a5fa",
      icon: "package"
    },
    {
      id: "starter_rooms",
      name: "Starter Rooms",
      description: "A few simple rooms that can start earning tonight.",
      category: "rooms",
      size: { width: 2, height: 1 },
      cost: 55,
      recipeId: "turn_rooms",
      color: "#2563eb",
      icon: "hotel"
    },
    {
      id: "front_desk",
      name: "Front Desk",
      description: "Turns available rooms into actual guest service.",
      category: "service",
      size: { width: 1, height: 1 },
      cost: 75,
      recipeId: "front_desk_service",
      color: "#0f766e",
      icon: "clipboard"
    },
    {
      id: "breakfast_nook",
      name: "Breakfast Nook",
      description: "A small morning service that makes the place memorable.",
      category: "food",
      size: { width: 2, height: 1 },
      cost: 130,
      recipeId: "serve_breakfast",
      color: "#f59e0b",
      icon: "coffee"
    },
    {
      id: "design_suite",
      name: "Design Suite",
      description: "Adds comfort, character, and better nightly rates.",
      category: "amenities",
      size: { width: 2, height: 2 },
      cost: 190,
      recipeId: "style_rooms",
      color: "#8b5cf6",
      icon: "brush"
    },
    {
      id: "review_desk",
      name: "Review Desk",
      description: "Follows up with guests and turns good stays into proof.",
      category: "marketing",
      size: { width: 1, height: 1 },
      cost: 180,
      recipeId: "collect_reviews",
      color: "#06b6d4",
      icon: "reputation"
    },
    {
      id: "salon_room",
      name: "Salon Room",
      description: "Hosts tastings and small events for high-value guests.",
      category: "events",
      size: { width: 2, height: 2 },
      cost: 300,
      recipeId: "host_salon",
      color: "#ec4899",
      icon: "audio"
    },
    {
      id: "concierge_desk",
      name: "Concierge Desk",
      description: "Builds guest loyalty with personal recommendations.",
      category: "service",
      size: { width: 2, height: 1 },
      cost: 260,
      recipeId: "guest_followup",
      color: "#14b8a6",
      icon: "workers"
    }
  ],
  contracts: [
    {
      id: "first_checkins",
      name: "First Check-Ins",
      description: "Prepare enough rooms for the first paying weekend.",
      requires: { rooms: 8 },
      rewardCash: 130,
      unlockIds: ["breakfast_nook", "guest_breakfast"]
    },
    {
      id: "guest_breakfast",
      name: "Guest Breakfast",
      description: "Serve a proper breakfast service for early reviewers.",
      requires: { breakfast: 8 },
      rewardCash: 190,
      unlockIds: ["design_suite", "comfort_push"]
    },
    {
      id: "comfort_push",
      name: "Comfort Push",
      description: "Upgrade the feeling of the stay, not just the room count.",
      requires: { comfort: 8, service: 6 },
      rewardCash: 280,
      unlockIds: ["review_desk", "review_drive"]
    },
    {
      id: "review_drive",
      name: "Review Drive",
      description: "Earn enough public praise to attract better bookings.",
      requires: { reviews: 10 },
      rewardCash: 360,
      unlockIds: ["salon_room", "concierge_desk", "local_salon"]
    },
    {
      id: "local_salon",
      name: "Local Salon Night",
      description: "Host a small private event for neighborhood tastemakers.",
      requires: { events: 6, comfort: 8 },
      rewardCash: 520,
      unlockIds: ["return_guests", "hotel_extension"]
    },
    {
      id: "return_guests",
      name: "Return Guests",
      description: "Build enough loyalty that guests start planning repeat stays.",
      requires: { loyalty: 8, reviews: 8 },
      rewardCash: 720,
      unlockIds: [],
      repeatable: true
    }
  ],
  upgrades: [
    {
      id: "fresh_laundry",
      name: "Fresh Laundry Rhythm",
      description: "Housekeeping systems work 30% faster.",
      cost: 180,
      effect: { productionMultipliers: [{ category: "housekeeping", multiplier: 1.3 }] }
    },
    {
      id: "desk_scripts",
      name: "Desk Scripts",
      description: "Service work becomes smoother and faster.",
      cost: 240,
      effect: { productionMultipliers: [{ category: "service", multiplier: 1.25 }] }
    },
    {
      id: "breakfast_supplier",
      name: "Breakfast Supplier",
      description: "Food service moves faster during busy mornings.",
      cost: 280,
      effect: { productionMultipliers: [{ category: "food", multiplier: 1.3 }] }
    },
    {
      id: "designer_rates",
      name: "Designer Rates",
      description: "Amenities produce comfort more quickly.",
      cost: 360,
      effect: { productionMultipliers: [{ category: "amenities", multiplier: 1.3 }] }
    },
    {
      id: "hotel_extension",
      name: "Townhouse Extension",
      description: "Open the back wing for larger rooms and events.",
      cost: 720,
      effect: { expandGrid: { width: 4, height: 2 } }
    }
  ],
  actions: [
    {
      id: "welcome_gifts",
      name: "Welcome Gifts",
      description: "Spend cash on little details that lift comfort.",
      costCash: 45,
      cooldownMs: 20_000,
      effect: { resources: { comfort: 5 } },
      icon: "reputation"
    },
    {
      id: "late_checkout",
      name: "Late Checkout",
      description: "Trade some room flow for better loyalty and reviews.",
      costCash: 55,
      costResources: { rooms: 2 },
      cooldownMs: 30_000,
      effect: { resources: { loyalty: 2, reviews: 3 } },
      icon: "clock"
    },
    {
      id: "weekend_push",
      name: "Weekend Push",
      description: "Boost service speed during a high-pressure booking window.",
      costCash: 90,
      costResources: { service: 4 },
      cooldownMs: 38_000,
      effect: { productionBoost: { category: "service", multiplier: 2, durationMs: 18_000 } },
      icon: "bolt"
    }
  ],
  markets: [
    {
      id: "city-breakers",
      name: "City Break Guests",
      description: "Short-stay travelers who reward comfort, breakfast, and clean execution.",
      demand: 1.1,
      rewardMultiplier: 1.1,
      qualityMultiplier: 1.05
    },
    {
      id: "boutique-tastemakers",
      name: "Boutique Tastemakers",
      description: "Guests who care about atmosphere, events, and a story worth sharing.",
      demand: 0.88,
      rewardMultiplier: 1.22,
      qualityMultiplier: 1.3
    }
  ],
  projects: [
    {
      id: "opening_weekend",
      name: "Opening Weekend",
      description: "Run the hotel's first weekend and turn a soft launch into real momentum.",
      marketId: "city-breakers",
      rewardCash: 300,
      unlockIds: ["comfort_push", "welcome_gifts"],
      phases: [
        { id: "housekeeping", name: "Prep Rooms", durationMs: 4_000, qualityFromResources: { linen: 2, rooms: 2 }, risk: 1 },
        { id: "service", name: "Check In", durationMs: 5_000, qualityFromResources: { service: 2 }, risk: 2 },
        { id: "food", name: "Breakfast", durationMs: 5_000, qualityFromResources: { breakfast: 2 }, risk: 1 },
        { id: "marketing", name: "Follow Up", durationMs: 4_000, qualityFromResources: { reviews: 2 }, risk: -1 }
      ]
    },
    {
      id: "boutique_launch",
      name: "Boutique Relaunch",
      description: "Position the hotel as a destination instead of just somewhere to sleep.",
      marketId: "boutique-tastemakers",
      costCash: 160,
      requiredResources: { comfort: 2 },
      rewardCash: 640,
      unlockIds: ["return_guests"],
      phases: [
        { id: "amenities", name: "Style", durationMs: 6_000, qualityFromResources: { comfort: 3 }, risk: 1 },
        { id: "events", name: "Host", durationMs: 6_000, qualityFromResources: { events: 2 }, risk: 2 },
        { id: "marketing", name: "Reviews", durationMs: 5_000, qualityFromResources: { reviews: 3, loyalty: 1 }, risk: -1 }
      ]
    }
  ],
  events: [
    {
      id: "late-arrival",
      name: "Late Arrival",
      description: "A tired guest arrives after midnight and the first impression matters.",
      trigger: { elapsedMs: 28_000 },
      choices: [
        {
          id: "personal-welcome",
          label: "Personal Welcome",
          description: "Spend extra service attention to create a warmer stay.",
          effect: { resources: { service: -1, reviews: 3 }, projectQuality: 3, morale: -1 }
        },
        {
          id: "fast-keys",
          label: "Fast Keys",
          description: "Keep it efficient and protect the schedule.",
          effect: { projectRisk: -3, projectQuality: 1 }
        }
      ]
    },
    {
      id: "travel-writer",
      name: "Travel Writer",
      description: "A quiet guest may be reviewing the hotel for a city guide.",
      trigger: { unlockedId: "review_desk" },
      choices: [
        {
          id: "upgrade-room",
          label: "Upgrade Room",
          description: "Spend comfort to earn better public proof.",
          effect: { resources: { comfort: -1, reviews: 5 }, projectQuality: 4 }
        },
        {
          id: "stay-natural",
          label: "Stay Natural",
          description: "Avoid special treatment and keep morale steady.",
          effect: { morale: 4, projectRisk: -1 }
        }
      ]
    }
  ],
  staffRoles: [
    { id: "housekeeper", name: "Housekeeper", category: "housekeeping", baseWage: 0.14 },
    { id: "front-desk-agent", name: "Front Desk Agent", category: "service", baseWage: 0.15 },
    { id: "breakfast-lead", name: "Breakfast Lead", category: "food", baseWage: 0.15 },
    { id: "stylist", name: "Room Stylist", category: "amenities", baseWage: 0.17 },
    { id: "events-host", name: "Events Host", category: "events", baseWage: 0.18 }
  ],
  staffCandidates: [
    { id: "candidate-lena", name: "Lena Brooks", roleId: "front-desk-agent", hireCost: 150, level: 1, traits: ["warm", "unflappable"], morale: 80 },
    { id: "candidate-marc", name: "Marc Vale", roleId: "housekeeper", hireCost: 135, level: 1, traits: ["fast", "precise"], morale: 76 },
    { id: "candidate-isha", name: "Isha Kline", roleId: "stylist", hireCost: 210, level: 2, traits: ["tasteful", "guest-led"], morale: 74 }
  ],
  startingState: {
    grid: { width: 8, height: 6 },
    cash: 300,
    resources: {
      rooms: 0,
      linen: 14,
      service: 0,
      breakfast: 0,
      comfort: 0,
      reviews: 0,
      events: 0,
      loyalty: 0
    },
    unlockedIds: ["linen_closet", "starter_rooms", "front_desk", "first_checkins", "opening_weekend"]
  }
};
