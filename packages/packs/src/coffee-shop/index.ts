import type { TycoonGamePack } from "@packforge/core";

export const coffeeShopPack: TycoonGamePack = {
  id: "coffee-shop",
  theme: {
    title: "Coffee Shop Tycoon",
    subtitle: "Turn a tiny counter into the neighborhood's daily ritual.",
    description:
      "A service management pack about beans, drinks, pastries, rushes, regulars, and building a cafe people remember.",
    visual: {
      icon: "coffee",
      illustration: "coffee",
      sceneImage: "/assets/key-art/coffee-shop-room.png",
      logoImage: "/assets/key-art/coffee-shop-room.png"
    },
    palette: {
      soil: "#6b5b4b",
      grid: "#b6a58f",
      accent: "#d97706",
      panel: "#fff7ed"
    },
    ui: {
      background: "#fff8f0",
      surface: "#ffffff",
      surfaceAlt: "#fff1dc",
      text: "#1f2937",
      muted: "#7c6252",
      border: "#ead8c4",
      accent: "#d97706",
      accentStrong: "#9a3412",
      accentSoft: "#ffedd5",
      success: "#16a34a",
      warning: "#f59e0b",
      danger: "#dc2626"
    }
  },
  resources: [
    { id: "beans", name: "Beans", description: "Fresh green beans ready for roasting." },
    { id: "roasted_beans", name: "Roasted Beans", description: "Warm, aromatic beans with a little personality." },
    { id: "grounds", name: "Grounds", description: "Coffee ready for the machine." },
    { id: "espresso", name: "Espresso", description: "Tiny cups of useful intensity." },
    { id: "milk", name: "Milk", description: "Cold stock for foam, lattes, and pastry work." },
    { id: "foam", name: "Foam", description: "Steamed milk for fancy drinks." },
    { id: "pastries", name: "Pastries", description: "Sweet counter goods that make the queue happier." },
    { id: "drinks", name: "Drinks", description: "Finished menu items ready to serve." },
    { id: "buzz", name: "Buzz", description: "Local attention, social chatter, and queue energy." },
    { id: "loyalty", name: "Loyalty", description: "Regulars who come back without being asked." }
  ],
  recipes: [
    {
      id: "source_beans",
      name: "Receive Beans",
      durationMs: 1800,
      inputs: {},
      outputs: { beans: 4 }
    },
    {
      id: "milk_delivery",
      name: "Milk Delivery",
      durationMs: 2200,
      inputs: {},
      outputs: { milk: 3 }
    },
    {
      id: "roast_beans",
      name: "Roast Beans",
      durationMs: 2600,
      inputs: { beans: 3 },
      outputs: { roasted_beans: 3 }
    },
    {
      id: "grind_beans",
      name: "Grind Beans",
      durationMs: 2200,
      inputs: { roasted_beans: 2 },
      outputs: { grounds: 3 }
    },
    {
      id: "pull_espresso",
      name: "Pull Espresso",
      durationMs: 2600,
      inputs: { grounds: 2 },
      outputs: { espresso: 2 }
    },
    {
      id: "steam_milk",
      name: "Steam Milk",
      durationMs: 2400,
      inputs: { milk: 2 },
      outputs: { foam: 2 }
    },
    {
      id: "bake_pastries",
      name: "Bake Pastries",
      durationMs: 3600,
      inputs: { milk: 2, beans: 1 },
      outputs: { pastries: 2 }
    },
    {
      id: "build_menu_drinks",
      name: "Build Menu Drinks",
      durationMs: 3200,
      inputs: { espresso: 2, foam: 1 },
      outputs: { drinks: 2 }
    },
    {
      id: "serve_regulars",
      name: "Serve Regulars",
      durationMs: 4200,
      inputs: { drinks: 2, pastries: 1 },
      outputs: { buzz: 3, loyalty: 1 }
    },
    {
      id: "chalkboard_hype",
      name: "Chalkboard Special",
      durationMs: 3800,
      inputs: { drinks: 1 },
      outputs: { buzz: 4 }
    }
  ],
  buildings: [
    {
      id: "bean_crates",
      name: "Bean Crates",
      description: "A humble source of beans and the smell of possibility.",
      category: "supply",
      size: { width: 1, height: 1 },
      cost: 0,
      recipeId: "source_beans",
      color: "#7c5f2f",
      icon: "coffee"
    },
    {
      id: "sample_roaster",
      name: "Sample Roaster",
      description: "Turns raw beans into the shop's first real product.",
      category: "roasting",
      size: { width: 1, height: 1 },
      cost: 45,
      recipeId: "roast_beans",
      color: "#b45309",
      icon: "flame"
    },
    {
      id: "counter_grinder",
      name: "Counter Grinder",
      description: "Keeps the espresso bar fed with fresh grounds.",
      category: "prep",
      size: { width: 1, height: 1 },
      cost: 50,
      recipeId: "grind_beans",
      color: "#78716c",
      icon: "gear"
    },
    {
      id: "espresso_bar",
      name: "Espresso Bar",
      description: "The first machine people actually queue for.",
      category: "bar",
      size: { width: 2, height: 1 },
      cost: 100,
      recipeId: "pull_espresso",
      color: "#0f766e",
      icon: "coffee"
    },
    {
      id: "milk_fridge",
      name: "Milk Fridge",
      description: "A reliable cold corner for the latte economy.",
      category: "supply",
      size: { width: 1, height: 1 },
      cost: 55,
      recipeId: "milk_delivery",
      color: "#38bdf8",
      icon: "package"
    },
    {
      id: "steam_wand",
      name: "Steam Wand",
      description: "Makes foam, noise, and the occasional tiny cloud.",
      category: "bar",
      size: { width: 1, height: 1 },
      cost: 90,
      recipeId: "steam_milk",
      color: "#60a5fa",
      icon: "audio"
    },
    {
      id: "pastry_case",
      name: "Pastry Case",
      description: "Adds sweet reasons to buy one more thing.",
      category: "bakery",
      size: { width: 2, height: 1 },
      cost: 150,
      recipeId: "bake_pastries",
      color: "#f59e0b",
      icon: "package"
    },
    {
      id: "menu_bar",
      name: "Menu Bar",
      description: "Combines espresso and foam into finished drinks.",
      category: "service",
      size: { width: 2, height: 1 },
      cost: 190,
      recipeId: "build_menu_drinks",
      color: "#d946ef",
      icon: "clipboard"
    },
    {
      id: "window_seats",
      name: "Window Seats",
      description: "A few warm seats that turn customers into regulars.",
      category: "service",
      size: { width: 2, height: 2 },
      cost: 260,
      recipeId: "serve_regulars",
      color: "#22c55e",
      icon: "workers"
    },
    {
      id: "chalkboard_menu",
      name: "Chalkboard Menu",
      description: "A hand-lettered special board that creates local buzz.",
      category: "marketing",
      size: { width: 1, height: 1 },
      cost: 120,
      recipeId: "chalkboard_hype",
      color: "#334155",
      icon: "megaphone"
    }
  ],
  contracts: [
    {
      id: "first_espressos",
      name: "First Morning Queue",
      description: "Serve a small batch of strong espresso to early commuters.",
      requires: { espresso: 8 },
      rewardCash: 110,
      unlockIds: ["milk_fridge", "steam_wand", "latte_order"]
    },
    {
      id: "latte_order",
      name: "Latte Test Run",
      description: "The neighborhood wants foam on purpose now.",
      requires: { espresso: 8, foam: 6 },
      rewardCash: 170,
      unlockIds: ["menu_bar", "pastry_case", "rush_sampling"]
    },
    {
      id: "pastry_box",
      name: "Pastry Box Pickup",
      description: "A nearby office wants breakfast boxes before a meeting.",
      requires: { pastries: 8 },
      rewardCash: 160,
      unlockIds: ["window_seats", "better_roaster"]
    },
    {
      id: "lunch_rush",
      name: "Lunch Rush",
      description: "Finished drinks and pastries for the midday crowd.",
      requires: { drinks: 8, pastries: 4 },
      rewardCash: 260,
      unlockIds: ["faster_bar", "daily_special"]
    },
    {
      id: "local_feature",
      name: "Local Paper Feature",
      description: "Generate enough buzz for a tiny but useful mention.",
      requires: { buzz: 12 },
      rewardCash: 280,
      unlockIds: ["loyalty_cards", "open_mic_night"]
    },
    {
      id: "regulars_table",
      name: "Regulars' Table",
      description: "Keep the same good people coming back.",
      requires: { loyalty: 6, drinks: 6 },
      rewardCash: 360,
      unlockIds: ["bakery_rhythm", "second_machine"]
    },
    {
      id: "catering_cart",
      name: "Catering Cart",
      description: "A mixed order big enough to prove the shop can scale.",
      requires: { drinks: 14, pastries: 10, buzz: 8 },
      rewardCash: 560,
      unlockIds: ["shop_expansion"]
    },
    {
      id: "festival_stall",
      name: "Festival Stall",
      description: "A repeatable weekend stall for a mature cafe.",
      requires: { drinks: 18, pastries: 12, loyalty: 8 },
      rewardCash: 820,
      unlockIds: [],
      repeatable: true
    }
  ],
  upgrades: [
    {
      id: "better_roaster",
      name: "Roast Profiles",
      description: "Roasting stations work 25% faster.",
      cost: 180,
      effect: {
        productionMultipliers: [{ category: "roasting", multiplier: 1.25 }]
      }
    },
    {
      id: "faster_bar",
      name: "Bar Flow",
      description: "Bar stations work 30% faster.",
      cost: 260,
      effect: {
        productionMultipliers: [{ category: "bar", multiplier: 1.3 }]
      }
    },
    {
      id: "loyalty_cards",
      name: "Stamp Cards",
      description: "Service stations build loyalty faster.",
      cost: 340,
      effect: {
        productionMultipliers: [{ category: "service", multiplier: 1.3 }]
      }
    },
    {
      id: "bakery_rhythm",
      name: "Prep Timers",
      description: "Bakery stations work 25% faster.",
      cost: 320,
      effect: {
        productionMultipliers: [{ category: "bakery", multiplier: 1.25 }]
      }
    },
    {
      id: "second_machine",
      name: "Second Grouphead",
      description: "Prep and bar work both speed up.",
      cost: 480,
      effect: {
        productionMultipliers: [
          { category: "prep", multiplier: 1.2 },
          { category: "bar", multiplier: 1.2 }
        ]
      }
    },
    {
      id: "shop_expansion",
      name: "Knock Through the Wall",
      description: "Expand the shop floor for larger service stations.",
      cost: 680,
      effect: {
        expandGrid: { width: 4, height: 2 }
      }
    }
  ],
  actions: [
    {
      id: "rush_sampling",
      name: "Free Samples",
      description: "Spend a little cash to create a quick burst of buzz.",
      costCash: 35,
      cooldownMs: 18_000,
      effect: {
        resources: { buzz: 8 }
      },
      icon: "megaphone"
    },
    {
      id: "daily_special",
      name: "Daily Special",
      description: "Use drinks to create local attention and repeat visits.",
      costCash: 50,
      costResources: { drinks: 2 },
      cooldownMs: 28_000,
      effect: {
        resources: { buzz: 6, loyalty: 2 }
      },
      icon: "clipboard"
    },
    {
      id: "open_mic_night",
      name: "Open Mic Night",
      description: "Double service speed while the shop is full of energy.",
      costCash: 90,
      costResources: { buzz: 5 },
      cooldownMs: 38_000,
      effect: {
        productionBoost: { category: "service", multiplier: 2, durationMs: 18_000 }
      },
      icon: "audio"
    }
  ],
  markets: [
    {
      id: "morning-commuters",
      name: "Morning Commuters",
      description: "Fast-moving regulars who care about speed, consistency, and strong coffee.",
      demand: 1.2,
      rewardMultiplier: 1.08,
      qualityMultiplier: 1
    },
    {
      id: "weekend-regulars",
      name: "Weekend Regulars",
      description: "Slower guests who reward pastries, atmosphere, and loyalty.",
      demand: 0.9,
      rewardMultiplier: 1.16,
      qualityMultiplier: 1.25
    }
  ],
  projects: [
    {
      id: "morning_rush_project",
      name: "Morning Rush",
      description: "Run the shop through a focused service rush and turn strangers into regulars.",
      marketId: "morning-commuters",
      rewardCash: 240,
      unlockIds: ["lunch_rush", "daily_special"],
      phases: [
        { id: "supply", name: "Stock", durationMs: 4_000, qualityFromResources: { beans: 1, milk: 1 }, risk: 1 },
        { id: "roasting", name: "Roast", durationMs: 5_000, qualityFromResources: { roasted_beans: 2 }, risk: 1 },
        { id: "prep", name: "Prep", durationMs: 5_000, qualityFromResources: { grounds: 2 }, risk: 1 },
        { id: "bar", name: "Serve", durationMs: 6_000, qualityFromResources: { espresso: 2, foam: 1 }, risk: 3 },
        { id: "service", name: "Regulars", durationMs: 5_000, qualityFromResources: { drinks: 2, buzz: 1 }, risk: 0 }
      ]
    },
    {
      id: "weekend_brunch_project",
      name: "Weekend Brunch Board",
      description: "A slower, higher-value service built around pastries and atmosphere.",
      marketId: "weekend-regulars",
      costCash: 120,
      requiredResources: { pastries: 2 },
      rewardCash: 460,
      unlockIds: ["festival_stall"],
      phases: [
        { id: "bakery", name: "Bake", durationMs: 6_000, qualityFromResources: { pastries: 3 }, risk: 1 },
        { id: "bar", name: "Pair Drinks", durationMs: 5_000, qualityFromResources: { drinks: 3 }, risk: 1 },
        { id: "marketing", name: "Chalkboard", durationMs: 4_000, qualityFromResources: { buzz: 2, loyalty: 1 }, risk: -1 }
      ]
    }
  ],
  events: [
    {
      id: "espresso-rush",
      name: "Unexpected Queue",
      description: "A train delay sends a crowd toward the counter all at once.",
      trigger: { elapsedMs: 28_000 },
      choices: [
        {
          id: "keep-service-tight",
          label: "Keep It Tight",
          description: "Protect the rush with focused service.",
          effect: { morale: -3, projectQuality: 4, projectRisk: -2 }
        },
        {
          id: "push-samples",
          label: "Push Samples",
          description: "Create buzz, but risk messy execution.",
          effect: { resources: { buzz: 5 }, projectRisk: 4 }
        }
      ]
    },
    {
      id: "local-blogger",
      name: "Local Blogger",
      description: "A cafe blogger asks what makes the shop special.",
      trigger: { unlockedId: "window_seats" },
      choices: [
        {
          id: "feature-pastries",
          label: "Feature Pastries",
          description: "Lean into the cozy angle.",
          effect: { resources: { buzz: 4, loyalty: 2 }, projectQuality: 2 }
        },
        {
          id: "talk-craft",
          label: "Talk Craft",
          description: "Make the coffee nerds happy.",
          effect: { projectQuality: 5, morale: -1 }
        }
      ]
    }
  ],
  staffRoles: [
    { id: "roaster", name: "Roaster", category: "roasting", baseWage: 0.14 },
    { id: "barista", name: "Barista", category: "bar", baseWage: 0.15 },
    { id: "prep", name: "Prep Lead", category: "prep", baseWage: 0.13 },
    { id: "baker", name: "Baker", category: "bakery", baseWage: 0.16 },
    { id: "host", name: "Host", category: "service", baseWage: 0.14 }
  ],
  staffCandidates: [
    { id: "candidate-nora", name: "Nora Pike", roleId: "barista", hireCost: 145, level: 1, traits: ["fast hands", "warm"], morale: 80 },
    { id: "candidate-eli", name: "Eli Santos", roleId: "roaster", hireCost: 175, level: 2, traits: ["precise", "quiet"], morale: 72 },
    { id: "candidate-bea", name: "Bea Morgan", roleId: "baker", hireCost: 190, level: 2, traits: ["early riser", "creative"], morale: 76 }
  ],
  startingState: {
    grid: { width: 8, height: 6 },
    cash: 260,
    resources: {
      beans: 16,
      roasted_beans: 0,
      grounds: 0,
      espresso: 0,
      milk: 0,
      foam: 0,
      pastries: 0,
      drinks: 0,
      buzz: 0,
      loyalty: 0
    },
    unlockedIds: [
      "bean_crates",
      "sample_roaster",
      "counter_grinder",
      "espresso_bar",
      "chalkboard_menu",
      "first_espressos",
      "morning_rush_project"
    ]
  }
};
