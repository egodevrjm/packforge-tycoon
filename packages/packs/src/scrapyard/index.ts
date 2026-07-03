import type { TycoonGamePack } from "@packforge/core";

export const scrapyardPack: TycoonGamePack = {
  id: "scrapyard",
  theme: {
    title: "Scrapyard Tycoon",
    subtitle: "Turn junk into humming little machines.",
    visual: {
      icon: "tools",
      illustration: "scrapyard",
      sceneImage: "/assets/key-art/scrapyard-yard-room.png",
      logoImage: "/assets/key-art/scrapyard-yard-room.png"
    },
    palette: {
      soil: "#46515c",
      grid: "#7b8794",
      accent: "#14b8a6",
      panel: "#f8fafc"
    },
    ui: {
      background: "#f4f7f9",
      surface: "#ffffff",
      surfaceAlt: "#eef6f5",
      text: "#111827",
      muted: "#64748b",
      border: "#d5e1e8",
      accent: "#14b8a6",
      accentStrong: "#0f766e",
      accentSoft: "#ccfbf1",
      success: "#22c55e",
      warning: "#f97316",
      danger: "#e11d48"
    }
  },
  resources: [
    { id: "scrap", name: "Scrap", description: "Unsorted junk from the yard pile." },
    { id: "sorted_metal", name: "Sorted Metal", description: "Useful pieces separated from scrap." },
    { id: "plastic_bits", name: "Plastic Bits", description: "Recovered casing, trim, and useful scraps." },
    { id: "copper_wire", name: "Copper Wire", description: "Hand-picked wiring and conductive bits." },
    { id: "crushed_metal", name: "Crushed Metal", description: "Dense feedstock for smelting." },
    { id: "ingots", name: "Ingots", description: "Smelted metal ready for shaping." },
    { id: "plates", name: "Plates", description: "Pressed sheets for frames and housings." },
    { id: "gears", name: "Gears", description: "Basic moving parts for machines." },
    { id: "circuits", name: "Circuits", description: "Simple logic boards assembled from wire and plastic." },
    { id: "motors", name: "Motors", description: "Compact drives for contract-grade builds." },
    { id: "frames", name: "Frames", description: "Sturdy metal skeletons for bigger assemblies." },
    { id: "widgets", name: "Widgets", description: "Finished odd little devices people keep ordering." }
  ],
  recipes: [
    {
      id: "scavenge_scrap",
      name: "Scavenge Scrap",
      durationMs: 1800,
      inputs: {},
      outputs: { scrap: 4 }
    },
    {
      id: "sort_scrap",
      name: "Sort Scrap",
      durationMs: 2400,
      inputs: { scrap: 3 },
      outputs: { sorted_metal: 2, plastic_bits: 1 }
    },
    {
      id: "pick_wire",
      name: "Pick Wire",
      durationMs: 2800,
      inputs: { scrap: 2 },
      outputs: { copper_wire: 2 }
    },
    {
      id: "crush_metal",
      name: "Crush Metal",
      durationMs: 3200,
      inputs: { sorted_metal: 3 },
      outputs: { crushed_metal: 2 }
    },
    {
      id: "smelt_ingots",
      name: "Smelt Ingots",
      durationMs: 4200,
      inputs: { crushed_metal: 2 },
      outputs: { ingots: 2 }
    },
    {
      id: "press_plates",
      name: "Press Plates",
      durationMs: 3600,
      inputs: { ingots: 1 },
      outputs: { plates: 2 }
    },
    {
      id: "cut_gears",
      name: "Cut Gears",
      durationMs: 3600,
      inputs: { ingots: 1 },
      outputs: { gears: 3 }
    },
    {
      id: "assemble_circuits",
      name: "Assemble Circuits",
      durationMs: 4400,
      inputs: { copper_wire: 2, plastic_bits: 2 },
      outputs: { circuits: 1 }
    },
    {
      id: "wind_motors",
      name: "Wind Motors",
      durationMs: 5200,
      inputs: { copper_wire: 3, gears: 2 },
      outputs: { motors: 1 }
    },
    {
      id: "weld_frames",
      name: "Weld Frames",
      durationMs: 4800,
      inputs: { plates: 3, gears: 1 },
      outputs: { frames: 1 }
    },
    {
      id: "assemble_widgets",
      name: "Assemble Widgets",
      durationMs: 6200,
      inputs: { frames: 1, motors: 1, circuits: 1 },
      outputs: { widgets: 1 }
    },
    {
      id: "recycle_plastic",
      name: "Recycle Plastic",
      durationMs: 3600,
      inputs: { plastic_bits: 4 },
      outputs: { scrap: 3, copper_wire: 1 }
    }
  ],
  buildings: [
    {
      id: "junk_pile",
      name: "Junk Pile",
      description: "A messy source of scrap. Ugly, generous, essential.",
      category: "source",
      size: { width: 2, height: 2 },
      cost: 0,
      recipeId: "scavenge_scrap",
      color: "#8b6f47"
    },
    {
      id: "sorting_table",
      name: "Sorting Table",
      description: "Separates useful metal and plastic from mixed scrap.",
      category: "sorting",
      size: { width: 2, height: 1 },
      cost: 45,
      recipeId: "sort_scrap",
      color: "#5fa3a8"
    },
    {
      id: "wire_picker",
      name: "Wire Picker",
      description: "Pulls copper wire out of forgotten appliances.",
      category: "sorting",
      size: { width: 1, height: 1 },
      cost: 55,
      recipeId: "pick_wire",
      color: "#c7834d"
    },
    {
      id: "crusher",
      name: "Crusher",
      description: "Chews sorted metal into dense smelter feedstock.",
      category: "heavy",
      size: { width: 2, height: 2 },
      cost: 120,
      recipeId: "crush_metal",
      color: "#7d8a90"
    },
    {
      id: "furnace",
      name: "Barrel Furnace",
      description: "Smelts crushed metal into clean ingots.",
      category: "heat",
      size: { width: 2, height: 2 },
      cost: 180,
      recipeId: "smelt_ingots",
      color: "#d46a3a"
    },
    {
      id: "plate_press",
      name: "Plate Press",
      description: "Thumps ingots into flat, useful plates.",
      category: "forming",
      size: { width: 2, height: 1 },
      cost: 210,
      recipeId: "press_plates",
      color: "#6f91c2"
    },
    {
      id: "gear_cutter",
      name: "Gear Cutter",
      description: "Turns ingots into chunky little gears.",
      category: "forming",
      size: { width: 1, height: 2 },
      cost: 230,
      recipeId: "cut_gears",
      color: "#b7a44c"
    },
    {
      id: "circuit_bench",
      name: "Circuit Bench",
      description: "A careful bench for simple boards and relays.",
      category: "electronics",
      size: { width: 2, height: 1 },
      cost: 260,
      recipeId: "assemble_circuits",
      color: "#56a66b"
    },
    {
      id: "motor_winder",
      name: "Motor Winder",
      description: "Wraps copper around gears until motion happens.",
      category: "assembly",
      size: { width: 2, height: 2 },
      cost: 340,
      recipeId: "wind_motors",
      color: "#9860a6"
    },
    {
      id: "frame_rig",
      name: "Frame Rig",
      description: "Welds plates and gears into sturdy machine frames.",
      category: "assembly",
      size: { width: 2, height: 2 },
      cost: 360,
      recipeId: "weld_frames",
      color: "#a85f5f"
    },
    {
      id: "widget_assembler",
      name: "Widget Assembler",
      description: "The yard's first real production line finale.",
      category: "assembly",
      size: { width: 3, height: 2 },
      cost: 520,
      recipeId: "assemble_widgets",
      color: "#d49b4d"
    },
    {
      id: "plastic_recycler",
      name: "Plastic Recycler",
      description: "Squeezes extra value out of plastic leftovers.",
      category: "support",
      size: { width: 2, height: 1 },
      cost: 180,
      recipeId: "recycle_plastic",
      color: "#63b083"
    },
    {
      id: "foreman_office",
      name: "Foreman Office",
      description: "A tiny office that makes the whole yard feel official.",
      category: "support",
      size: { width: 2, height: 2 },
      cost: 420,
      color: "#b9865b"
    }
  ],
  contracts: [
    {
      id: "first_sort",
      name: "Neighbor's Cleanout",
      description: "Deliver a small batch of sorted metal.",
      requires: { sorted_metal: 8 },
      rewardCash: 90,
      unlockIds: ["crusher", "more_scrap"]
    },
    {
      id: "wire_order",
      name: "Radio Repair Shop",
      description: "They need wire and do not ask where it came from.",
      requires: { copper_wire: 8 },
      rewardCash: 100,
      unlockIds: ["plastic_recycler"]
    },
    {
      id: "plastic_delivery",
      name: "Toy Maker's Odds",
      description: "A local maker wants clean plastic bits.",
      requires: { plastic_bits: 10 },
      rewardCash: 95,
      unlockIds: ["furnace", "hotter_barrels"]
    },
    {
      id: "crushed_batch",
      name: "Foundry Sample",
      description: "Prove the crusher can make tidy feedstock.",
      requires: { crushed_metal: 10 },
      rewardCash: 160,
      unlockIds: ["plate_press", "gear_cutter"]
    },
    {
      id: "first_ingots",
      name: "Clean Metal Trial",
      description: "Ship the first ingots from your barrel furnace.",
      requires: { ingots: 8 },
      rewardCash: 170,
      unlockIds: ["yard_expansion_1", "circuit_bench"]
    },
    {
      id: "plate_delivery",
      name: "Sign Maker's Sheets",
      description: "Flat plates for shiny roadside signs.",
      requires: { plates: 14 },
      rewardCash: 220,
      unlockIds: ["faster_forming"]
    },
    {
      id: "gear_delivery",
      name: "Clock Club Rush",
      description: "Oddly serious hobbyists need many gears.",
      requires: { gears: 18 },
      rewardCash: 240,
      unlockIds: ["motor_winder"]
    },
    {
      id: "circuit_delivery",
      name: "Arcade Cabinet Rescue",
      description: "Simple circuits for a row of retired arcade machines.",
      requires: { circuits: 6 },
      rewardCash: 260,
      unlockIds: ["frame_rig", "yard_expansion_2"]
    },
    {
      id: "motor_delivery",
      name: "Garage Door Panic",
      description: "A property manager needs motors yesterday.",
      requires: { motors: 5 },
      rewardCash: 360,
      unlockIds: ["widget_assembler", "better_assembly"]
    },
    {
      id: "frame_delivery",
      name: "Market Stall Frames",
      description: "Foldable stalls made from reclaimed steel.",
      requires: { frames: 5 },
      rewardCash: 380,
      unlockIds: ["foreman_office"]
    },
    {
      id: "widget_delivery",
      name: "The First Big Widget",
      description: "The town finally trusts your finished machines.",
      requires: { widgets: 2 },
      rewardCash: 700,
      unlockIds: ["bulk_sorting", "yard_logistics"]
    },
    {
      id: "bulk_parts",
      name: "Repair Co-op Bundle",
      description: "A mixed order that keeps every station honest.",
      requires: { plates: 12, gears: 12, circuits: 4 },
      rewardCash: 540,
      unlockIds: ["wire_efficiency"]
    },
    {
      id: "machine_bundle",
      name: "Tiny Factory Kit",
      description: "Frames, motors, and widgets for a new workshop.",
      requires: { frames: 4, motors: 4, widgets: 3 },
      rewardCash: 920,
      unlockIds: ["premium_contracts"]
    },
    {
      id: "premium_contracts",
      name: "Premium Repair Queue",
      description: "A repeatable order for mature yards.",
      requires: { widgets: 4, circuits: 8, motors: 5 },
      rewardCash: 1250,
      unlockIds: [],
      repeatable: true
    }
  ],
  upgrades: [
    {
      id: "more_scrap",
      name: "Better Gloves",
      description: "Source stations work 25% faster.",
      cost: 120,
      effect: {
        productionMultipliers: [{ category: "source", multiplier: 1.25 }]
      }
    },
    {
      id: "hotter_barrels",
      name: "Hotter Barrels",
      description: "Heat stations work 30% faster.",
      cost: 220,
      effect: {
        productionMultipliers: [{ category: "heat", multiplier: 1.3 }]
      }
    },
    {
      id: "yard_expansion_1",
      name: "Lease the Back Lot",
      description: "Adds a strip of room for serious machinery.",
      cost: 300,
      effect: {
        expandGrid: { width: 4, height: 2 },
        unlockIds: ["plate_press", "gear_cutter"]
      }
    },
    {
      id: "faster_forming",
      name: "Greased Dies",
      description: "Forming stations work 25% faster.",
      cost: 340,
      effect: {
        productionMultipliers: [{ category: "forming", multiplier: 1.25 }]
      }
    },
    {
      id: "yard_expansion_2",
      name: "Open the Side Gate",
      description: "Adds more grid space for assembly lines.",
      cost: 520,
      effect: {
        expandGrid: { width: 4, height: 3 },
        unlockIds: ["motor_winder", "frame_rig"]
      }
    },
    {
      id: "better_assembly",
      name: "Assembly Jigs",
      description: "Assembly machines work 25% faster.",
      cost: 620,
      effect: {
        productionMultipliers: [{ category: "assembly", multiplier: 1.25 }]
      }
    },
    {
      id: "bulk_sorting",
      name: "Magnetic Sweepers",
      description: "Sorting machines work 30% faster.",
      cost: 680,
      effect: {
        productionMultipliers: [{ category: "sorting", multiplier: 1.3 }]
      }
    },
    {
      id: "yard_logistics",
      name: "Painted Lanes",
      description: "Support stations work 35% faster and the yard feels civilized.",
      cost: 720,
      effect: {
        productionMultipliers: [{ category: "support", multiplier: 1.35 }]
      }
    },
    {
      id: "wire_efficiency",
      name: "Copper Discipline",
      description: "Electronics benches work 30% faster.",
      cost: 820,
      effect: {
        productionMultipliers: [{ category: "electronics", multiplier: 1.3 }]
      }
    }
  ],
  markets: [
    {
      id: "local-repair",
      name: "Local Repair Buyers",
      description: "Small shops that value practical parts and quick turnaround.",
      demand: 1.1,
      rewardMultiplier: 1.05,
      qualityMultiplier: 1.05
    },
    {
      id: "maker-coop",
      name: "Maker Co-op",
      description: "Hobby builders who pay more for clean widgets and reliable assemblies.",
      demand: 0.95,
      rewardMultiplier: 1.18,
      qualityMultiplier: 1.2
    }
  ],
  projects: [
    {
      id: "cleanout_job",
      name: "Neighborhood Cleanout",
      description: "Turn a messy local haul into a finished order with as little waste as possible.",
      marketId: "local-repair",
      rewardCash: 220,
      unlockIds: ["crushed_batch", "yard_expansion_1"],
      phases: [
        { id: "source", name: "Source", durationMs: 4_000, qualityFromResources: { scrap: 1 }, risk: 1 },
        { id: "sorting", name: "Sort", durationMs: 5_000, qualityFromResources: { sorted_metal: 2, copper_wire: 1 }, risk: 1 },
        { id: "heavy", name: "Process", durationMs: 6_000, qualityFromResources: { crushed_metal: 2 }, risk: 3 },
        { id: "forming", name: "Form", durationMs: 5_000, qualityFromResources: { plates: 2, gears: 1 }, risk: 1 },
        { id: "assembly", name: "Deliver", durationMs: 5_000, qualityFromResources: { frames: 2, motors: 1 }, risk: 0 }
      ]
    },
    {
      id: "maker_widget_run",
      name: "Maker Widget Run",
      description: "A premium run of reclaimed devices for the local maker co-op.",
      marketId: "maker-coop",
      costCash: 160,
      requiredResources: { circuits: 2 },
      rewardCash: 560,
      unlockIds: ["premium_contracts"],
      phases: [
        { id: "electronics", name: "Bench Test", durationMs: 6_000, qualityFromResources: { circuits: 3 }, risk: 2 },
        { id: "assembly", name: "Assemble", durationMs: 7_000, qualityFromResources: { widgets: 3, motors: 1 }, risk: 2 },
        { id: "support", name: "Inspect", durationMs: 4_000, qualityFromResources: { plastic_bits: 2 }, risk: -2 }
      ]
    }
  ],
  events: [
    {
      id: "rainy-haul",
      name: "Rainy Haul",
      description: "A wet load comes in. It might hide good parts, or just slow everyone down.",
      trigger: { elapsedMs: 30_000 },
      choices: [
        {
          id: "dry-it-out",
          label: "Dry It Out",
          description: "Take time to protect quality.",
          effect: { morale: -3, projectRisk: -4, projectQuality: 3 }
        },
        {
          id: "sort-fast",
          label: "Sort Fast",
          description: "Keep moving and accept some messy risk.",
          effect: { resources: { scrap: 8 }, projectRisk: 5 }
        }
      ]
    },
    {
      id: "rare-motor-find",
      name: "Rare Motor Find",
      description: "Someone spots a surprisingly clean drive unit under a heap of junk.",
      trigger: { unlockedId: "motor_winder" },
      choices: [
        {
          id: "save-for-contract",
          label: "Save It",
          description: "Bank the part for a better job.",
          effect: { resources: { motors: 1 }, projectQuality: 4 }
        },
        {
          id: "sell-now",
          label: "Sell Now",
          description: "Take quick cash from a passing buyer.",
          effect: { cash: 90, projectRisk: 1 }
        }
      ]
    }
  ],
  staffRoles: [
    { id: "picker", name: "Picker", category: "source", baseWage: 0.11 },
    { id: "sorter", name: "Sorter", category: "sorting", baseWage: 0.12 },
    { id: "operator", name: "Machine Operator", category: "heavy", baseWage: 0.16 },
    { id: "fabricator", name: "Fabricator", category: "assembly", baseWage: 0.18 },
    { id: "foreman", name: "Foreman", category: "support", baseWage: 0.2 }
  ],
  staffCandidates: [
    { id: "candidate-mags", name: "Mags Turner", roleId: "sorter", hireCost: 125, level: 1, traits: ["sharp eye", "steady"], morale: 74 },
    { id: "candidate-bo", name: "Bo Alvarez", roleId: "operator", hireCost: 185, level: 2, traits: ["crusher hand", "bold"], morale: 68 },
    { id: "candidate-ness", name: "Ness Okafor", roleId: "fabricator", hireCost: 210, level: 2, traits: ["precise", "patient"], morale: 78 }
  ],
  startingState: {
    grid: { width: 10, height: 8 },
    cash: 220,
    resources: {
      scrap: 24,
      sorted_metal: 0,
      plastic_bits: 0,
      copper_wire: 0,
      crushed_metal: 0,
      ingots: 0,
      plates: 0,
      gears: 0,
      circuits: 0,
      motors: 0,
      frames: 0,
      widgets: 0
    },
    unlockedIds: [
      "junk_pile",
      "sorting_table",
      "wire_picker",
      "first_sort",
      "wire_order",
      "plastic_delivery",
      "cleanout_job"
    ]
  }
};
