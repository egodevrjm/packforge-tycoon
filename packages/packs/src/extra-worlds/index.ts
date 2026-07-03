import type { TycoonGamePack } from "@packforge/core";

const resource = (id: string, name: string, description: string) => ({ id, name, description });

const ui = (
  background: string,
  surfaceAlt: string,
  border: string,
  accent: string,
  accentStrong: string,
  accentSoft: string
) => ({
  background,
  surface: "#ffffff",
  surfaceAlt,
  text: "#111827",
  muted: "#64748b",
  border,
  accent,
  accentStrong,
  accentSoft,
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626"
});

export const themeParkPack: TycoonGamePack = {
  id: "theme-park",
  theme: {
    title: "Theme Park Tycoon",
    subtitle: "Turn a roadside mini fair into a full family theme park.",
    description:
      "Build rides, sell snacks, manage safety, control queues, and grow from a few attractions into a destination park.",
    visual: {
      icon: "rocket",
      illustration: "theme-park",
      sceneImage: "/assets/key-art/theme-park-gates.png",
      logoImage: "/assets/key-art/theme-park-gates.png"
    },
    palette: { soil: "#1e293b", grid: "#bfdbfe", accent: "#dc2626", panel: "#ffffff" },
    ui: ui("#fff7ed", "#ffedd5", "#fed7aa", "#dc2626", "#991b1b", "#fee2e2")
  },
  resources: [
    resource("attractions", "Attractions", "Playable rides, stalls, and things people point at."),
    resource("safety", "Safety", "Inspections, training, fencing, and calm operators."),
    resource("snacks", "Snacks", "Food, drinks, and tiny treats with excellent margins."),
    resource("guests", "Guests", "Visitors in the park, hopefully still smiling."),
    resource("thrills", "Thrills", "Memorable ride moments and brave repeat riders."),
    resource("queues", "Queue Flow", "Operational control over waiting, routes, and capacity."),
    resource("buzz", "Buzz", "Local excitement, school-holiday chatter, and social proof."),
    resource("reputation", "Reputation", "Trust that the park is worth a full day out.")
  ],
  recipes: [
    { id: "build_kiddie_ride", name: "Build Kiddie Ride", durationMs: 2200, inputs: {}, outputs: { attractions: 3 } },
    { id: "run_inspection", name: "Run Inspection", durationMs: 2600, inputs: { attractions: 1 }, outputs: { safety: 3 } },
    { id: "open_snack_cart", name: "Open Snack Cart", durationMs: 2400, inputs: {}, outputs: { snacks: 3 } },
    { id: "sell_day_passes", name: "Sell Day Passes", durationMs: 3200, inputs: { attractions: 1, snacks: 1 }, outputs: { guests: 3 } },
    { id: "tune_thrill_ride", name: "Tune Thrill Ride", durationMs: 3800, inputs: { safety: 2, attractions: 2 }, outputs: { thrills: 3 } },
    { id: "route_queues", name: "Route Queues", durationMs: 3400, inputs: { guests: 2 }, outputs: { queues: 3 } },
    { id: "launch_campaign", name: "Launch Campaign", durationMs: 4200, inputs: { thrills: 2, guests: 1 }, outputs: { buzz: 3 } },
    { id: "host_peak_day", name: "Host Peak Day", durationMs: 5200, inputs: { safety: 2, queues: 2, buzz: 2 }, outputs: { reputation: 2, guests: 2 } }
  ],
  buildings: [
    { id: "flat_ride", name: "First Flat Ride", description: "A compact ride that makes the fair feel real.", category: "rides", size: { width: 2, height: 1 }, cost: 0, recipeId: "build_kiddie_ride", color: "#ef4444", icon: "rocket" },
    { id: "safety_booth", name: "Safety Booth", description: "Checklists, radios, and staff who take the boring bits seriously.", category: "safety", size: { width: 1, height: 1 }, cost: 60, recipeId: "run_inspection", color: "#0f766e", icon: "clipboard" },
    { id: "snack_cart", name: "Snack Cart", description: "Popcorn, drinks, and the smell that keeps guests wandering.", category: "food", size: { width: 1, height: 1 }, cost: 80, recipeId: "open_snack_cart", color: "#f59e0b", icon: "coffee" },
    { id: "ticket_gate", name: "Ticket Gate", description: "Turns interest into visitors inside the gates.", category: "guest", size: { width: 2, height: 1 }, cost: 120, recipeId: "sell_day_passes", color: "#2563eb", icon: "coin" },
    { id: "thrill_shop", name: "Thrill Workshop", description: "Tunes bigger rides until they feel brave instead of alarming.", category: "rides", size: { width: 2, height: 2 }, cost: 210, recipeId: "tune_thrill_ride", color: "#7c3aed", icon: "bolt" },
    { id: "queue_ops", name: "Queue Ops", description: "Ropes, signs, and routing that make waiting feel shorter.", category: "operations", size: { width: 2, height: 1 }, cost: 180, recipeId: "route_queues", color: "#14b8a6", icon: "workers" },
    { id: "park_marketing", name: "Park Marketing", description: "Local ads, school flyers, and family-day bundles.", category: "marketing", size: { width: 1, height: 1 }, cost: 220, recipeId: "launch_campaign", color: "#ec4899", icon: "megaphone" },
    { id: "operations_tower", name: "Operations Tower", description: "Coordinates peak days without losing the plot.", category: "operations", size: { width: 3, height: 2 }, cost: 360, recipeId: "host_peak_day", color: "#1d4ed8", icon: "station" }
  ],
  contracts: [
    { id: "opening_weekend", name: "Opening Weekend", description: "Get enough attractions ready for the first families.", requires: { attractions: 8 }, rewardCash: 140, unlockIds: ["safety_booth", "ticket_gate", "safe_opening"] },
    { id: "safe_opening", name: "Safe Opening", description: "Prove the park is exciting and inspected.", requires: { safety: 8, guests: 5 }, rewardCash: 240, unlockIds: ["thrill_shop", "queue_ops", "bigger_rides"] },
    { id: "bigger_rides", name: "Bigger Rides", description: "Add proper thrills without melting the queue lines.", requires: { thrills: 8, queues: 6 }, rewardCash: 360, unlockIds: ["park_marketing", "summer_campaign"] },
    { id: "summer_campaign", name: "Summer Campaign", description: "Turn the park into the school-holiday choice.", requires: { buzz: 10, guests: 8 }, rewardCash: 520, unlockIds: ["operations_tower", "destination_day"] },
    { id: "destination_day", name: "Destination Day", description: "Run a big day that people recommend afterwards.", requires: { reputation: 6, queues: 8, safety: 8 }, rewardCash: 760, unlockIds: [], repeatable: true }
  ],
  upgrades: [
    { id: "ride_crews", name: "Ride Crews", description: "Ride work runs 30% faster.", cost: 180, effect: { productionMultipliers: [{ category: "rides", multiplier: 1.3 }] } },
    { id: "fast_lanes", name: "Fast Lane Routing", description: "Queue operations run faster.", cost: 300, effect: { productionMultipliers: [{ category: "operations", multiplier: 1.3 }] } },
    { id: "park_expansion", name: "Open Second Loop", description: "Expand the park path for larger attractions.", cost: 700, effect: { expandGrid: { width: 4, height: 2 } } }
  ],
  actions: [
    { id: "mascot_parade", name: "Mascot Parade", description: "Create a short burst of buzz.", costCash: 55, cooldownMs: 22_000, effect: { resources: { buzz: 6 } }, icon: "megaphone" },
    { id: "maintenance_sprint", name: "Maintenance Sprint", description: "Boost safety work during a busy period.", costCash: 80, costResources: { guests: 2 }, cooldownMs: 34_000, effect: { productionBoost: { category: "safety", multiplier: 2, durationMs: 16_000 } }, icon: "tools" }
  ],
  markets: [
    { id: "local-families", name: "Local Families", description: "Affordable fun, clean paths, and reliable snacks.", demand: 1.14, rewardMultiplier: 1.08 },
    { id: "day-trippers", name: "Day Trippers", description: "Guests who reward bigger rides and strong reputation.", demand: 0.88, rewardMultiplier: 1.25, qualityMultiplier: 1.22 }
  ],
  projects: [
    { id: "first_fun_day", name: "First Fun Day", description: "Run a small family day and prove the park can operate.", marketId: "local-families", rewardCash: 300, unlockIds: ["summer_campaign"], phases: [
      { id: "build", name: "Build", durationMs: 4000, qualityFromResources: { attractions: 2 }, risk: 1 },
      { id: "inspect", name: "Inspect", durationMs: 5000, qualityFromResources: { safety: 2 }, risk: 1 },
      { id: "host", name: "Host", durationMs: 6000, qualityFromResources: { guests: 2, snacks: 1 }, risk: 2 }
    ] },
    { id: "summer_peak", name: "Summer Peak Day", description: "Operate a full busy day with thrills and queues under control.", marketId: "day-trippers", costCash: 160, requiredResources: { guests: 2 }, rewardCash: 680, phases: [
      { id: "rides", name: "Rides", durationMs: 6000, qualityFromResources: { thrills: 3 }, risk: 2 },
      { id: "flow", name: "Flow", durationMs: 6000, qualityFromResources: { queues: 3 }, risk: 2 },
      { id: "reputation", name: "Memory", durationMs: 7000, qualityFromResources: { reputation: 3 }, risk: 2 }
    ] }
  ],
  events: [
    { id: "ride_squeak", name: "Ride Squeak", description: "A starter ride starts making a worrying noise.", trigger: { elapsedMs: 26_000 }, choices: [
      { id: "pause_fix", label: "Pause and Fix", description: "Spend safety to lower project risk.", effect: { resources: { safety: -2 }, projectRisk: -5 } },
      { id: "keep_open", label: "Keep It Open", description: "Earn a little cash but raise risk.", effect: { cash: 45, projectRisk: 7 } }
    ] },
    { id: "school_trip", name: "School Trip Call", description: "A school asks for a group day if you can handle the queue.", trigger: { unlockedId: "queue_ops" }, choices: [
      { id: "accept_trip", label: "Accept Trip", description: "Gain guests and buzz.", effect: { resources: { guests: 4, buzz: 3 }, projectRisk: 2 } },
      { id: "waitlist", label: "Waitlist Them", description: "Protect operations.", effect: { projectRisk: -2, morale: 1 } }
    ] }
  ],
  staffRoles: [
    { id: "ride-operator", name: "Ride Operator", category: "rides", baseWage: 0.16 },
    { id: "safety-lead", name: "Safety Lead", category: "safety", baseWage: 0.18 },
    { id: "guest-host", name: "Guest Host", category: "guest", baseWage: 0.14 },
    { id: "ops-planner", name: "Ops Planner", category: "operations", baseWage: 0.19 }
  ],
  staffCandidates: [
    { id: "candidate-nia", name: "Nia Park", roleId: "ride-operator", hireCost: 150, level: 1, traits: ["cheerful", "steady"], morale: 78 },
    { id: "candidate-omar", name: "Omar Vale", roleId: "safety-lead", hireCost: 190, level: 2, traits: ["careful", "direct"], morale: 75 },
    { id: "candidate-jules", name: "Jules Finch", roleId: "ops-planner", hireCost: 220, level: 2, traits: ["organized"], morale: 74 }
  ],
  startingState: { grid: { width: 8, height: 6 }, cash: 285, resources: { attractions: 0, safety: 0, snacks: 0, guests: 0, thrills: 0, queues: 0, buzz: 0, reputation: 0 }, unlockedIds: ["flat_ride", "snack_cart", "ticket_gate", "opening_weekend", "first_fun_day"] }
};

export const farmMarketPack: TycoonGamePack = {
  id: "farm-market",
  theme: {
    title: "Farm Market Tycoon",
    subtitle: "Grow a roadside stall into the region's weekend market.",
    description:
      "Plant crops, harvest produce, make preserves, stock stalls, serve locals, and build a market people plan their mornings around.",
    visual: { icon: "package", illustration: "farm-market", sceneImage: "/assets/key-art/farm-market-stall.png", logoImage: "/assets/key-art/farm-market-stall.png" },
    palette: { soil: "#365314", grid: "#bbf7d0", accent: "#16a34a", panel: "#ffffff" },
    ui: ui("#f7fee7", "#ecfccb", "#d9f99d", "#16a34a", "#166534", "#dcfce7")
  },
  resources: [
    resource("seeds", "Seeds", "Starter crops, saved seed, and growing plans."),
    resource("harvest", "Harvest", "Fresh produce ready to sort and sell."),
    resource("preserves", "Preserves", "Jams, pickles, sauces, and shelf-stable value."),
    resource("stalls", "Stalls", "Tables, crates, signage, and market capacity."),
    resource("customers", "Customers", "Locals and visitors walking the market."),
    resource("deliveries", "Deliveries", "Boxes packed for cafes, restaurants, and subscribers."),
    resource("buzz", "Buzz", "Neighborhood attention and weekend anticipation."),
    resource("reputation", "Reputation", "Trust that the produce is worth coming back for.")
  ],
  recipes: [
    { id: "start_seedlings", name: "Start Seedlings", durationMs: 2100, inputs: {}, outputs: { seeds: 4 } },
    { id: "harvest_beds", name: "Harvest Beds", durationMs: 2800, inputs: { seeds: 1 }, outputs: { harvest: 4 } },
    { id: "make_preserves", name: "Make Preserves", durationMs: 3400, inputs: { harvest: 2 }, outputs: { preserves: 3 } },
    { id: "build_stalls", name: "Build Stalls", durationMs: 2600, inputs: { harvest: 1 }, outputs: { stalls: 3 } },
    { id: "market_day", name: "Market Day", durationMs: 3600, inputs: { stalls: 1, harvest: 2 }, outputs: { customers: 4 } },
    { id: "pack_deliveries", name: "Pack Deliveries", durationMs: 3800, inputs: { preserves: 1, harvest: 1 }, outputs: { deliveries: 3 } },
    { id: "local_promo", name: "Local Promo", durationMs: 4200, inputs: { customers: 2 }, outputs: { buzz: 3 } },
    { id: "seasonal_market", name: "Seasonal Market", durationMs: 5200, inputs: { deliveries: 2, buzz: 2 }, outputs: { reputation: 2, customers: 2 } }
  ],
  buildings: [
    { id: "seed_table", name: "Seed Table", description: "A simple table where the season begins.", category: "growing", size: { width: 1, height: 1 }, cost: 0, recipeId: "start_seedlings", color: "#65a30d", icon: "package" },
    { id: "garden_beds", name: "Garden Beds", description: "Turns careful planting into crates of produce.", category: "growing", size: { width: 2, height: 1 }, cost: 60, recipeId: "harvest_beds", color: "#16a34a", icon: "station" },
    { id: "jam_kitchen", name: "Jam Kitchen", description: "Turns imperfect produce into perfect margins.", category: "kitchen", size: { width: 2, height: 1 }, cost: 110, recipeId: "make_preserves", color: "#dc2626", icon: "flame" },
    { id: "stall_row", name: "Stall Row", description: "Crates, awnings, and a place for customers to gather.", category: "market", size: { width: 2, height: 1 }, cost: 125, recipeId: "build_stalls", color: "#f59e0b", icon: "station" },
    { id: "market_counter", name: "Market Counter", description: "Turns produce displays into a steady crowd.", category: "sales", size: { width: 2, height: 1 }, cost: 160, recipeId: "market_day", color: "#0f766e", icon: "coin" },
    { id: "delivery_bench", name: "Delivery Bench", description: "Packs boxes for local cafes and subscribers.", category: "logistics", size: { width: 2, height: 1 }, cost: 210, recipeId: "pack_deliveries", color: "#2563eb", icon: "package" },
    { id: "community_board", name: "Community Board", description: "Promotes workshops, tastings, and weekend specials.", category: "marketing", size: { width: 1, height: 1 }, cost: 220, recipeId: "local_promo", color: "#ec4899", icon: "megaphone" },
    { id: "seasonal_pavilion", name: "Seasonal Pavilion", description: "Hosts the kind of market morning people remember.", category: "events", size: { width: 3, height: 2 }, cost: 360, recipeId: "seasonal_market", color: "#7c3aed", icon: "reputation" }
  ],
  contracts: [
    { id: "first_crates", name: "First Crates", description: "Harvest enough produce to fill the first stall.", requires: { harvest: 10 }, rewardCash: 140, unlockIds: ["stall_row", "market_counter", "opening_market"] },
    { id: "opening_market", name: "Opening Market", description: "Open a market day with stalls and customers.", requires: { stalls: 6, customers: 8 }, rewardCash: 240, unlockIds: ["jam_kitchen", "jam_tasting"] },
    { id: "jam_tasting", name: "Jam Tasting", description: "Prove the kitchen can add value to the harvest.", requires: { preserves: 8, customers: 6 }, rewardCash: 340, unlockIds: ["delivery_bench", "community_board", "cafe_delivery"] },
    { id: "cafe_delivery", name: "Cafe Delivery", description: "Pack a reliable order for local cafes.", requires: { deliveries: 8 }, rewardCash: 500, unlockIds: ["seasonal_pavilion", "harvest_fair"] },
    { id: "harvest_fair", name: "Harvest Fair", description: "Run the seasonal market that makes the name stick.", requires: { reputation: 6, buzz: 8 }, rewardCash: 740, unlockIds: [], repeatable: true }
  ],
  upgrades: [
    { id: "greenhouse_rhythm", name: "Greenhouse Rhythm", description: "Growing stations work faster.", cost: 180, effect: { productionMultipliers: [{ category: "growing", multiplier: 1.3 }] } },
    { id: "market_layout", name: "Market Layout", description: "Sales and market stations work faster.", cost: 320, effect: { productionMultipliers: [{ category: "market", multiplier: 1.25 }, { category: "sales", multiplier: 1.2 }] } },
    { id: "field_expansion", name: "Open Back Field", description: "Expand for seasonal pavilions and more rows.", cost: 700, effect: { expandGrid: { width: 4, height: 2 } } }
  ],
  actions: [
    { id: "sample_table", name: "Sample Table", description: "Spend a little to create customer buzz.", costCash: 45, cooldownMs: 22_000, effect: { resources: { buzz: 6 } }, icon: "coffee" },
    { id: "volunteer_harvest", name: "Volunteer Harvest", description: "Boost growing for a short window.", costCash: 75, costResources: { customers: 2 }, cooldownMs: 34_000, effect: { productionBoost: { category: "growing", multiplier: 2, durationMs: 16_000 } }, icon: "workers" }
  ],
  markets: [
    { id: "local-regulars", name: "Local Regulars", description: "They reward freshness, friendliness, and reliable stalls.", demand: 1.18, rewardMultiplier: 1.08 },
    { id: "weekend-visitors", name: "Weekend Visitors", description: "They come for atmosphere, events, and reputation.", demand: 0.9, rewardMultiplier: 1.24, qualityMultiplier: 1.2 }
  ],
  projects: [
    { id: "first_market_day", name: "First Market Day", description: "Open the roadside stand as a real market morning.", marketId: "local-regulars", rewardCash: 300, unlockIds: ["jam_tasting"], phases: [
      { id: "grow", name: "Grow", durationMs: 4000, qualityFromResources: { harvest: 2 }, risk: 1 },
      { id: "display", name: "Display", durationMs: 5000, qualityFromResources: { stalls: 2 }, risk: 1 },
      { id: "serve", name: "Serve", durationMs: 6000, qualityFromResources: { customers: 2 }, risk: 2 }
    ] },
    { id: "seasonal_fair", name: "Seasonal Fair", description: "Host a bigger market with deliveries and community buzz.", marketId: "weekend-visitors", costCash: 150, requiredResources: { customers: 2 }, rewardCash: 650, phases: [
      { id: "stock", name: "Stock", durationMs: 6000, qualityFromResources: { preserves: 3 }, risk: 1 },
      { id: "deliver", name: "Deliver", durationMs: 6000, qualityFromResources: { deliveries: 3 }, risk: 2 },
      { id: "host", name: "Host", durationMs: 7000, qualityFromResources: { reputation: 3 }, risk: 2 }
    ] }
  ],
  events: [
    { id: "rainy_morning", name: "Rainy Morning", description: "Clouds roll in before opening.", trigger: { elapsedMs: 26_000 }, choices: [
      { id: "move_under_awning", label: "Move Under Awning", description: "Spend stalls to lower risk.", effect: { resources: { stalls: -2 }, projectRisk: -5 } },
      { id: "ride_it_out", label: "Ride It Out", description: "Save money but risk a quiet morning.", effect: { cash: 35, projectRisk: 6 } }
    ] },
    { id: "chef_visit", name: "Chef Visit", description: "A local chef asks about regular deliveries.", trigger: { unlockedId: "delivery_bench" }, choices: [
      { id: "pack_samples", label: "Pack Samples", description: "Gain deliveries and reputation.", effect: { resources: { deliveries: 3, reputation: 2 }, projectQuality: 3 } },
      { id: "keep_counter_stocked", label: "Keep Counter Stocked", description: "Focus on current customers.", effect: { resources: { customers: 3 }, projectRisk: -2 } }
    ] }
  ],
  staffRoles: [
    { id: "grower", name: "Grower", category: "growing", baseWage: 0.15 },
    { id: "cook", name: "Preserve Cook", category: "kitchen", baseWage: 0.17 },
    { id: "market-host", name: "Market Host", category: "sales", baseWage: 0.15 },
    { id: "delivery-lead", name: "Delivery Lead", category: "logistics", baseWage: 0.18 }
  ],
  staffCandidates: [
    { id: "candidate-mina", name: "Mina Field", roleId: "grower", hireCost: 145, level: 1, traits: ["patient", "early"], morale: 80 },
    { id: "candidate-raf", name: "Raf Stone", roleId: "cook", hireCost: 185, level: 2, traits: ["precise"], morale: 76 },
    { id: "candidate-lena", name: "Lena Brooks", roleId: "market-host", hireCost: 175, level: 2, traits: ["warm"], morale: 78 }
  ],
  startingState: { grid: { width: 8, height: 6 }, cash: 270, resources: { seeds: 0, harvest: 0, preserves: 0, stalls: 0, customers: 0, deliveries: 0, buzz: 0, reputation: 0 }, unlockedIds: ["seed_table", "garden_beds", "stall_row", "first_crates", "first_market_day"] }
};

export const movieStudioPack: TycoonGamePack = {
  id: "movie-studio",
  theme: {
    title: "Movie Studio Tycoon",
    subtitle: "Turn garage shorts into a studio with box office pull.",
    description:
      "Develop scripts, build sets, shoot scenes, edit cuts, create buzz, and premiere films that grow your reputation.",
    visual: { icon: "art", illustration: "movie-studio", sceneImage: "/assets/key-art/movie-studio-set.png", logoImage: "/assets/key-art/movie-studio-set.png" },
    palette: { soil: "#111827", grid: "#cbd5e1", accent: "#9333ea", panel: "#ffffff" },
    ui: ui("#f5f3ff", "#ede9fe", "#ddd6fe", "#9333ea", "#6b21a8", "#f3e8ff")
  },
  resources: [
    resource("scripts", "Scripts", "Ideas shaped into shootable scenes."),
    resource("sets", "Sets", "Rooms, props, lighting plots, and believable worlds."),
    resource("footage", "Footage", "Captured takes ready for the edit."),
    resource("talent", "Talent", "Cast, crew, and on-camera charisma."),
    resource("edits", "Edits", "Cuts, sound passes, color, and rhythm."),
    resource("buzz", "Buzz", "Audience curiosity before release."),
    resource("box_office", "Box Office", "Sales, licensing, and proof of demand."),
    resource("reputation", "Reputation", "Trust that your next film is worth watching.")
  ],
  recipes: [
    { id: "draft_script", name: "Draft Script", durationMs: 2200, inputs: {}, outputs: { scripts: 4 } },
    { id: "dress_set", name: "Dress Set", durationMs: 3000, inputs: { scripts: 1 }, outputs: { sets: 3 } },
    { id: "cast_scene", name: "Cast Scene", durationMs: 2800, inputs: { scripts: 1 }, outputs: { talent: 3 } },
    { id: "shoot_scene", name: "Shoot Scene", durationMs: 3600, inputs: { sets: 1, talent: 1 }, outputs: { footage: 4 } },
    { id: "edit_cut", name: "Edit Cut", durationMs: 4200, inputs: { footage: 2 }, outputs: { edits: 3 } },
    { id: "launch_trailer", name: "Launch Trailer", durationMs: 4000, inputs: { edits: 1 }, outputs: { buzz: 3 } },
    { id: "premiere_film", name: "Premiere Film", durationMs: 5200, inputs: { edits: 2, buzz: 2 }, outputs: { box_office: 3, reputation: 2 } }
  ],
  buildings: [
    { id: "writers_table", name: "Writers' Table", description: "A battered table where the first scenes get real.", category: "writing", size: { width: 1, height: 1 }, cost: 0, recipeId: "draft_script", color: "#9333ea", icon: "design" },
    { id: "prop_corner", name: "Prop Corner", description: "Turns scripts into something the camera can believe.", category: "production", size: { width: 2, height: 1 }, cost: 70, recipeId: "dress_set", color: "#64748b", icon: "package" },
    { id: "casting_sofa", name: "Casting Corner", description: "Finds performers who can carry a scene.", category: "casting", size: { width: 1, height: 1 }, cost: 85, recipeId: "cast_scene", color: "#ec4899", icon: "workers" },
    { id: "camera_rig", name: "Camera Rig", description: "Captures the footage that gives the studio a heartbeat.", category: "shooting", size: { width: 2, height: 1 }, cost: 140, recipeId: "shoot_scene", color: "#2563eb", icon: "art" },
    { id: "edit_bay", name: "Edit Bay", description: "Turns messy takes into something with pace.", category: "post", size: { width: 2, height: 1 }, cost: 200, recipeId: "edit_cut", color: "#14b8a6", icon: "code" },
    { id: "trailer_team", name: "Trailer Team", description: "Cuts the thirty seconds people send to friends.", category: "marketing", size: { width: 1, height: 1 }, cost: 230, recipeId: "launch_trailer", color: "#f59e0b", icon: "megaphone" },
    { id: "premiere_room", name: "Premiere Room", description: "Screens the work and turns attention into sales.", category: "distribution", size: { width: 3, height: 2 }, cost: 360, recipeId: "premiere_film", color: "#dc2626", icon: "reputation" }
  ],
  contracts: [
    { id: "first_short", name: "First Short", description: "Write enough scenes to shoot the first short.", requires: { scripts: 8 }, rewardCash: 140, unlockIds: ["prop_corner", "camera_rig", "shootable_short"] },
    { id: "shootable_short", name: "Shootable Short", description: "Build the set and capture enough footage.", requires: { sets: 6, footage: 8 }, rewardCash: 260, unlockIds: ["casting_sofa", "edit_bay", "festival_cut"] },
    { id: "festival_cut", name: "Festival Cut", description: "Deliver a polished enough edit for a local screening.", requires: { edits: 8, talent: 5 }, rewardCash: 360, unlockIds: ["trailer_team", "trailer_drop"] },
    { id: "trailer_drop", name: "Trailer Drop", description: "Generate enough buzz before the premiere.", requires: { buzz: 10 }, rewardCash: 500, unlockIds: ["premiere_room", "first_premiere"] },
    { id: "first_premiere", name: "First Premiere", description: "Release a film people actually pay to see.", requires: { box_office: 8, reputation: 6 }, rewardCash: 760, unlockIds: [], repeatable: true }
  ],
  upgrades: [
    { id: "writers_room", name: "Writers' Room", description: "Writing work runs faster.", cost: 180, effect: { productionMultipliers: [{ category: "writing", multiplier: 1.3 }] } },
    { id: "faster_post", name: "Faster Post", description: "Post-production runs faster.", cost: 320, effect: { productionMultipliers: [{ category: "post", multiplier: 1.3 }] } },
    { id: "soundstage_expansion", name: "Soundstage Expansion", description: "Open a larger shooting floor.", cost: 700, effect: { expandGrid: { width: 4, height: 2 } } }
  ],
  actions: [
    { id: "table_read", name: "Table Read", description: "Spend cash to improve script momentum.", costCash: 50, cooldownMs: 22_000, effect: { resources: { scripts: 6 } }, icon: "workers" },
    { id: "late_night_edit", name: "Late Night Edit", description: "Boost post work with coffee and stubbornness.", costCash: 85, costResources: { footage: 2 }, cooldownMs: 34_000, effect: { productionBoost: { category: "post", multiplier: 2, durationMs: 16_000 } }, icon: "coffee" }
  ],
  markets: [
    { id: "local-film-night", name: "Local Film Night", description: "Friendly audiences who reward heart and clarity.", demand: 1.12, rewardMultiplier: 1.08 },
    { id: "streaming-buyers", name: "Streaming Buyers", description: "Buyers who reward polish, buzz, and repeatable output.", demand: 0.86, rewardMultiplier: 1.28, qualityMultiplier: 1.22 }
  ],
  projects: [
    { id: "garage_short", name: "Garage Short", description: "Make the first short with borrowed gear and nerve.", marketId: "local-film-night", rewardCash: 300, unlockIds: ["trailer_drop"], phases: [
      { id: "write", name: "Write", durationMs: 4000, qualityFromResources: { scripts: 2 }, risk: 1 },
      { id: "shoot", name: "Shoot", durationMs: 6000, qualityFromResources: { footage: 2, talent: 1 }, risk: 2 },
      { id: "cut", name: "Cut", durationMs: 6000, qualityFromResources: { edits: 2 }, risk: 2 }
    ] },
    { id: "first_feature", name: "First Feature", description: "Scale the studio into a film people talk about.", marketId: "streaming-buyers", costCash: 170, requiredResources: { scripts: 2 }, rewardCash: 700, phases: [
      { id: "package", name: "Package", durationMs: 6000, qualityFromResources: { talent: 3 }, risk: 2 },
      { id: "produce", name: "Produce", durationMs: 7000, qualityFromResources: { footage: 3 }, risk: 2 },
      { id: "release", name: "Release", durationMs: 7000, qualityFromResources: { box_office: 2, reputation: 2 }, risk: 2 }
    ] }
  ],
  events: [
    { id: "lost_location", name: "Lost Location", description: "A location falls through the night before shooting.", trigger: { elapsedMs: 28_000 }, choices: [
      { id: "rewrite_scene", label: "Rewrite Scene", description: "Spend scripts to lower risk.", effect: { resources: { scripts: -2 }, projectRisk: -5 } },
      { id: "shoot_anyway", label: "Shoot Anyway", description: "Save time but raise risk.", effect: { cash: 40, projectRisk: 7 } }
    ] },
    { id: "actor_available", name: "Actor Available", description: "A rising actor has one open day.", trigger: { unlockedId: "casting_sofa" }, choices: [
      { id: "book_them", label: "Book Them", description: "Boost talent and buzz.", effect: { resources: { talent: 3, buzz: 3 }, projectQuality: 3 } },
      { id: "protect_budget", label: "Protect Budget", description: "Keep the schedule steady.", effect: { projectRisk: -2, morale: 1 } }
    ] }
  ],
  staffRoles: [
    { id: "writer", name: "Writer", category: "writing", baseWage: 0.16 },
    { id: "producer", name: "Producer", category: "production", baseWage: 0.19 },
    { id: "editor", name: "Editor", category: "post", baseWage: 0.18 },
    { id: "publicist", name: "Publicist", category: "marketing", baseWage: 0.16 }
  ],
  staffCandidates: [
    { id: "candidate-asha", name: "Asha Reed", roleId: "writer", hireCost: 155, level: 1, traits: ["sharp", "restless"], morale: 77 },
    { id: "candidate-kit", name: "Kit Warner", roleId: "editor", hireCost: 195, level: 2, traits: ["patient"], morale: 76 },
    { id: "candidate-sol", name: "Sol Pierce", roleId: "producer", hireCost: 220, level: 2, traits: ["calm"], morale: 74 }
  ],
  startingState: { grid: { width: 8, height: 6 }, cash: 330, resources: { scripts: 0, sets: 0, footage: 0, talent: 0, edits: 0, buzz: 0, box_office: 0, reputation: 0 }, unlockedIds: ["writers_table", "prop_corner", "casting_sofa", "camera_rig", "first_short", "garage_short"] }
};

export const aquariumPack: TycoonGamePack = {
  id: "aquarium",
  theme: {
    title: "Aquarium Tycoon",
    subtitle: "Grow a local tank room into a public ocean attraction.",
    description:
      "Balance habitats, water quality, exhibits, education, guests, conservation, and the quiet wonder of a great aquarium.",
    visual: { icon: "water", illustration: "aquarium", sceneImage: "/assets/key-art/aquarium-gallery.png", logoImage: "/assets/key-art/aquarium-gallery.png" },
    palette: { soil: "#0f172a", grid: "#bae6fd", accent: "#0284c7", panel: "#ffffff" },
    ui: ui("#ecfeff", "#cffafe", "#a5f3fc", "#0284c7", "#075985", "#e0f2fe")
  },
  resources: [
    resource("habitats", "Habitats", "Tanks, rockwork, coral, and safe homes."),
    resource("water_quality", "Water Quality", "Testing, filtration, salinity, and stability."),
    resource("species", "Species", "Healthy animals suited to the exhibits."),
    resource("exhibits", "Exhibits", "Visitor-ready tanks with a story to tell."),
    resource("education", "Education", "Talks, labels, school groups, and learning moments."),
    resource("guests", "Guests", "Visitors moving through the galleries."),
    resource("conservation", "Conservation", "Rescue work, breeding programs, and credibility."),
    resource("reputation", "Reputation", "Trust that the aquarium is worth supporting.")
  ],
  recipes: [
    { id: "prepare_habitat", name: "Prepare Habitat", durationMs: 2400, inputs: {}, outputs: { habitats: 3 } },
    { id: "test_water", name: "Test Water", durationMs: 2600, inputs: { habitats: 1 }, outputs: { water_quality: 3 } },
    { id: "care_species", name: "Care for Species", durationMs: 3200, inputs: { water_quality: 1 }, outputs: { species: 3 } },
    { id: "open_exhibit", name: "Open Exhibit", durationMs: 3600, inputs: { habitats: 1, species: 1 }, outputs: { exhibits: 3 } },
    { id: "host_school_talk", name: "Host School Talk", durationMs: 3600, inputs: { exhibits: 1 }, outputs: { education: 3 } },
    { id: "welcome_visitors", name: "Welcome Visitors", durationMs: 4000, inputs: { exhibits: 2, education: 1 }, outputs: { guests: 4 } },
    { id: "run_rescue", name: "Run Rescue", durationMs: 4600, inputs: { water_quality: 2, species: 1 }, outputs: { conservation: 3 } },
    { id: "ocean_weekend", name: "Ocean Weekend", durationMs: 5400, inputs: { guests: 2, conservation: 2 }, outputs: { reputation: 2, guests: 2 } }
  ],
  buildings: [
    { id: "tank_room", name: "Tank Room", description: "A small set of tanks where the aquarium begins.", category: "habitat", size: { width: 2, height: 1 }, cost: 0, recipeId: "prepare_habitat", color: "#0284c7", icon: "station" },
    { id: "water_lab", name: "Water Lab", description: "Keeps the invisible chemistry under control.", category: "care", size: { width: 1, height: 1 }, cost: 70, recipeId: "test_water", color: "#06b6d4", icon: "clipboard" },
    { id: "quarantine_bay", name: "Quarantine Bay", description: "Careful animal care before anything goes on show.", category: "care", size: { width: 2, height: 1 }, cost: 105, recipeId: "care_species", color: "#0f766e", icon: "workers" },
    { id: "reef_gallery", name: "Reef Gallery", description: "Turns good care into a visitor-ready exhibit.", category: "exhibit", size: { width: 2, height: 2 }, cost: 160, recipeId: "open_exhibit", color: "#7c3aed", icon: "art" },
    { id: "learning_corner", name: "Learning Corner", description: "School talks, keeper chats, and small discoveries.", category: "education", size: { width: 1, height: 1 }, cost: 150, recipeId: "host_school_talk", color: "#f59e0b", icon: "ideas" },
    { id: "ticket_hall", name: "Ticket Hall", description: "Welcomes visitors into the gallery flow.", category: "guest", size: { width: 2, height: 1 }, cost: 210, recipeId: "welcome_visitors", color: "#2563eb", icon: "coin" },
    { id: "rescue_pool", name: "Rescue Pool", description: "Conservation work that gives the place a purpose.", category: "conservation", size: { width: 2, height: 2 }, cost: 300, recipeId: "run_rescue", color: "#14b8a6", icon: "reputation" },
    { id: "ocean_tunnel", name: "Ocean Tunnel", description: "The signature exhibit people come back to see.", category: "exhibit", size: { width: 3, height: 2 }, cost: 420, recipeId: "ocean_weekend", color: "#1d4ed8", icon: "station" }
  ],
  contracts: [
    { id: "first_habitats", name: "First Habitats", description: "Prepare enough healthy habitats to open.", requires: { habitats: 8, water_quality: 5 }, rewardCash: 160, unlockIds: ["quarantine_bay", "reef_gallery", "first_gallery"] },
    { id: "first_gallery", name: "First Gallery", description: "Open exhibits that guests can understand.", requires: { exhibits: 8, species: 6 }, rewardCash: 280, unlockIds: ["learning_corner", "ticket_hall", "school_week"] },
    { id: "school_week", name: "School Week", description: "Host enough education to bring in families.", requires: { education: 8, guests: 6 }, rewardCash: 390, unlockIds: ["rescue_pool", "rescue_story"] },
    { id: "rescue_story", name: "Rescue Story", description: "Prove the aquarium does more than display tanks.", requires: { conservation: 8, water_quality: 8 }, rewardCash: 540, unlockIds: ["ocean_tunnel", "ocean_weekend_contract"] },
    { id: "ocean_weekend_contract", name: "Ocean Weekend", description: "Run a full public weekend with wonder and purpose.", requires: { reputation: 6, guests: 10 }, rewardCash: 780, unlockIds: [], repeatable: true }
  ],
  upgrades: [
    { id: "better_filters", name: "Better Filters", description: "Care stations run faster.", cost: 190, effect: { productionMultipliers: [{ category: "care", multiplier: 1.3 }] } },
    { id: "gallery_flow", name: "Gallery Flow", description: "Guest work runs faster.", cost: 320, effect: { productionMultipliers: [{ category: "guest", multiplier: 1.3 }] } },
    { id: "new_wing", name: "Open Ocean Wing", description: "Expand for bigger exhibits.", cost: 760, effect: { expandGrid: { width: 4, height: 2 } } }
  ],
  actions: [
    { id: "keeper_talk", name: "Keeper Talk", description: "Create a burst of education.", costCash: 45, cooldownMs: 22_000, effect: { resources: { education: 6 } }, icon: "ideas" },
    { id: "water_sprint", name: "Water Sprint", description: "Boost care during a delicate window.", costCash: 80, costResources: { habitats: 2 }, cooldownMs: 34_000, effect: { productionBoost: { category: "care", multiplier: 2, durationMs: 16_000 } }, icon: "tools" }
  ],
  markets: [
    { id: "local-families", name: "Local Families", description: "They reward clear exhibits and a good day out.", demand: 1.12, rewardMultiplier: 1.08 },
    { id: "members-donors", name: "Members and Donors", description: "They reward conservation, trust, and a reason to support.", demand: 0.9, rewardMultiplier: 1.25, qualityMultiplier: 1.25 }
  ],
  projects: [
    { id: "first_gallery_project", name: "First Gallery Opening", description: "Open the first aquarium room to the public.", marketId: "local-families", rewardCash: 320, unlockIds: ["school_week"], phases: [
      { id: "habitat", name: "Habitat", durationMs: 5000, qualityFromResources: { habitats: 2 }, risk: 1 },
      { id: "care", name: "Care", durationMs: 5000, qualityFromResources: { water_quality: 2, species: 1 }, risk: 2 },
      { id: "open", name: "Open", durationMs: 6000, qualityFromResources: { exhibits: 2 }, risk: 2 }
    ] },
    { id: "ocean_tunnel_project", name: "Ocean Tunnel Opening", description: "Open the signature exhibit with conservation credibility.", marketId: "members-donors", costCash: 180, requiredResources: { exhibits: 2 }, rewardCash: 720, phases: [
      { id: "build", name: "Build", durationMs: 7000, qualityFromResources: { exhibits: 3 }, risk: 2 },
      { id: "educate", name: "Educate", durationMs: 6000, qualityFromResources: { education: 3 }, risk: 1 },
      { id: "support", name: "Support", durationMs: 7000, qualityFromResources: { conservation: 3 }, risk: 2 }
    ] }
  ],
  events: [
    { id: "cloudy_tank", name: "Cloudy Tank", description: "A tank clouds up just before visitors arrive.", trigger: { elapsedMs: 26_000 }, choices: [
      { id: "delay_opening", label: "Delay Opening", description: "Spend water quality to lower risk.", effect: { resources: { water_quality: -2 }, projectRisk: -5 } },
      { id: "open_partial", label: "Open Partial", description: "Keep cash flow but raise risk.", effect: { cash: 45, projectRisk: 6 } }
    ] },
    { id: "rescue_call", name: "Rescue Call", description: "A local rescue needs space quickly.", trigger: { unlockedId: "rescue_pool" }, choices: [
      { id: "make_room", label: "Make Room", description: "Gain conservation and reputation.", effect: { resources: { conservation: 3, reputation: 2 }, projectQuality: 3 } },
      { id: "refer_out", label: "Refer Out", description: "Protect current operations.", effect: { projectRisk: -2, morale: 1 } }
    ] }
  ],
  staffRoles: [
    { id: "aquarist", name: "Aquarist", category: "care", baseWage: 0.18 },
    { id: "educator", name: "Educator", category: "education", baseWage: 0.15 },
    { id: "guest-lead", name: "Guest Lead", category: "guest", baseWage: 0.15 },
    { id: "conservationist", name: "Conservationist", category: "conservation", baseWage: 0.2 }
  ],
  staffCandidates: [
    { id: "candidate-iona", name: "Iona Blue", roleId: "aquarist", hireCost: 175, level: 1, traits: ["gentle", "precise"], morale: 78 },
    { id: "candidate-marc", name: "Marc Reed", roleId: "educator", hireCost: 170, level: 2, traits: ["warm"], morale: 79 },
    { id: "candidate-suri", name: "Suri Vale", roleId: "conservationist", hireCost: 230, level: 2, traits: ["focused"], morale: 74 }
  ],
  startingState: { grid: { width: 8, height: 6 }, cash: 360, resources: { habitats: 0, water_quality: 0, species: 0, exhibits: 0, education: 0, guests: 0, conservation: 0, reputation: 0 }, unlockedIds: ["tank_room", "water_lab", "quarantine_bay", "reef_gallery", "first_habitats", "first_gallery_project"] }
};
