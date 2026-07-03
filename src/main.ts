import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/badge/badge.js";
import "@shoelace-style/shoelace/dist/components/card/card.js";
import "@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js";
import "./style.css";
import { GameController } from "./app/controller";
import { hasSavedGame } from "./app/storage";
import { startSimulationTicker } from "./app/ticker";
import { defaultGamePackId, gamePacks, getGamePack } from "@packforge/packs";
import { validateGamePack } from "@packforge/core";
import type {
  FounderProfile,
  GameDifficulty,
  LogoPattern,
  LogoShape,
  TycoonGamePack
} from "@packforge/core";
import { applyUiTheme, mountHud } from "./ui/hud";
import { categoryIconId, icon } from "./ui/icons";

declare global {
  interface Window {
    tycoon?: GameController;
  }
}

const hudRoot = document.querySelector<HTMLElement>("#hud-root");
if (!hudRoot) {
  throw new Error("Missing HUD root.");
}

let stopTicker: (() => void) | undefined;
let unmountHud: (() => void) | undefined;
const savedPackId = localStorage.getItem("selected-game-pack");
let activePackId = savedPackId ?? defaultGamePackId;
let libraryMessage = "";

const customPacksKey = "packforge-custom-packs";
const appTitle = "PackForge Tycoon";

const setPageTitle = (...parts: Array<string | undefined>) => {
  const titleParts = parts.map((part) => part?.trim()).filter((part): part is string => Boolean(part));
  document.title = titleParts.length ? `${titleParts.join(" - ")} | ${appTitle}` : appTitle;
};

const builtinPackIds = () => new Set(gamePacks.map(({ pack }) => pack.id));

const loadCustomPacks = (): TycoonGamePack[] => {
  const stored = localStorage.getItem(customPacksKey);
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((pack): pack is TycoonGamePack => {
      const candidate = pack as Partial<TycoonGamePack>;
      return typeof candidate.id === "string" && Array.isArray(candidate.resources);
    });
  } catch {
    localStorage.removeItem(customPacksKey);
    return [];
  }
};

let customPacks = loadCustomPacks();

const saveCustomPacks = () => {
  localStorage.setItem(customPacksKey, JSON.stringify(customPacks));
};

const getPlayablePack = (packId: string) =>
  customPacks.find((pack) => pack.id === packId) ?? getGamePack(packId);

const looksLikeGamePack = (pack: unknown): pack is TycoonGamePack => {
  const candidate = pack as Partial<TycoonGamePack>;
  return (
    typeof candidate === "object" &&
    candidate !== null &&
    typeof candidate.id === "string" &&
    Array.isArray(candidate.resources) &&
    Array.isArray(candidate.buildings) &&
    Array.isArray(candidate.recipes) &&
    Array.isArray(candidate.contracts) &&
    Array.isArray(candidate.upgrades) &&
    typeof candidate.theme === "object" &&
    candidate.theme !== null &&
    typeof candidate.startingState === "object" &&
    candidate.startingState !== null
  );
};

const addCustomPack = (pack: unknown) => {
  if (!looksLikeGamePack(pack)) {
    return {
      ok: false,
      message: "That JSON does not look like a PackForge game pack."
    };
  }
  if (builtinPackIds().has(pack.id)) {
    return {
      ok: false,
      message: `"${pack.id}" is already used by a built-in game. Change the pack id first.`
    };
  }
  const result = validateGamePack(pack);
  if (!result.ok) {
    return {
      ok: false,
      message: result.errors[0] ?? "That pack is not valid yet."
    };
  }
  customPacks = [pack, ...customPacks.filter((existing) => existing.id !== pack.id)].slice(0, 12);
  saveCustomPacks();
  return {
    ok: true,
    message: `${pack.theme.title} saved to My Worlds.`
  };
};

const parseImportedPack = async (file: File) => {
  const text = await file.text();
  const parsed = JSON.parse(text) as TycoonGamePack;
  return parsed;
};

const readImageDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result ?? "")));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });

const setBuilderVisualMode = (form: HTMLFormElement, mode: "gradient" | "generic" | "upload") => {
  const radio = form.querySelector<HTMLInputElement>(`input[name=visualMode][value=${mode}]`);
  if (radio) {
    radio.checked = true;
  }
  form.querySelectorAll(".visual-mode-choice.selected").forEach((element) => element.classList.remove("selected"));
  radio?.closest("label")?.classList.add("selected");
};

const setBuilderImageData = async (input: HTMLInputElement, fieldName: "sceneImageData" | "logoImageData") => {
  const file = input.files?.[0];
  const form = input.closest<HTMLFormElement>("[data-builder-form]");
  if (!file || !form) {
    return;
  }
  const summary = hudRoot.querySelector<HTMLElement>("[data-builder-summary]");
  if (file.size > 850_000) {
    if (summary) {
      summary.textContent = "Image is too large. Try a smaller JPG, PNG, or WebP.";
    }
    input.value = "";
    return;
  }
  const dataUrl = await readImageDataUrl(file);
  const hidden = form.elements.namedItem(fieldName) as HTMLInputElement | null;
  if (hidden) {
    hidden.value = dataUrl;
  }
  setBuilderVisualMode(form, "upload");
  updateBuilderPreview(form);
};

const logoChoices = ["gamepad", "code", "bolt", "reputation", "tools", "package", "ideas", "circuit", "brush", "coin"];
const colorChoices = ["#0ea5e9", "#14b8a6", "#8b5cf6", "#f97316", "#22c55e", "#e11d48", "#f59e0b", "#64748b"];
const logoShapeChoices: Array<{ id: LogoShape; title: string }> = [
  { id: "squircle", title: "Soft" },
  { id: "circle", title: "Round" },
  { id: "diamond", title: "Sharp" },
  { id: "shield", title: "Shield" }
];
const logoPatternChoices: Array<{ id: LogoPattern; title: string }> = [
  { id: "shine", title: "Shine" },
  { id: "grid", title: "Grid" },
  { id: "stripes", title: "Stripes" },
  { id: "spotlight", title: "Spotlight" }
];
const studioNameWords = {
  prefixes: ["Pixel", "Nova", "Tiny", "Bright", "Analog", "Midnight", "Copper", "Signal", "Rocket", "Indie"],
  middles: ["Button", "Byte", "Quest", "Loop", "Spark", "Patch", "Level", "Build", "Arcade", "Frame"],
  suffixes: ["Studio", "Works", "Lab", "Foundry", "Collective", "Games", "House", "Forge"]
};
const yardNameWords = {
  prefixes: ["North", "Second", "Green", "Honest", "Bright", "River", "Patchwork", "Copper", "Lucky", "Harbor"],
  middles: ["Star", "Bolt", "Yard", "Crate", "Metal", "Gear", "Depot", "Salvage", "Scrap", "Found"],
  suffixes: ["Salvage", "Works", "Yard", "Depot", "Reclaim", "Supply", "Foundry", "Exchange"]
};
const cafeNameWords = {
  prefixes: ["Corner", "Morning", "Velvet", "Copper", "Little", "Steady", "Warm", "Maple", "Beacon", "Steam"],
  middles: ["Bean", "Cup", "Mug", "Roast", "Counter", "Table", "Kettle", "Grind", "Bakery", "Ritual"],
  suffixes: ["Cafe", "Coffee", "Roastery", "Kitchen", "Counter", "Room", "House", "Bar"]
};
const colonyNameWords = {
  prefixes: ["Aster", "Kepler", "Dawn", "Red", "Orbit", "Pioneer", "Helio", "Vega", "New", "Echo"],
  middles: ["Ridge", "Crater", "Harbor", "Dome", "Outpost", "Array", "Station", "Haven", "Prospect", "Base"],
  suffixes: ["Colony", "Outpost", "Station", "Settlement", "Habitat", "Frontier", "Works", "Base"]
};
const hotelNameWords = {
  prefixes: ["Blue", "Juniper", "Little", "Civic", "Velvet", "Harbor", "Glass", "Sunday", "Maple", "Bright"],
  middles: ["Key", "Room", "Lobby", "Linen", "Suite", "Guest", "Townhouse", "Landing", "Bell", "Stay"],
  suffixes: ["Hotel", "House", "Rooms", "Inn", "Stay", "Suites", "Lodge", "Retreat"]
};
const festivalNameWords = {
  prefixes: ["Field", "Neon", "Summer", "Copper", "River", "Signal", "Lantern", "Bright", "Local", "Golden"],
  middles: ["Stage", "Sound", "Weekend", "Field", "Lineup", "Ticket", "Crowd", "Amplifier", "Poster", "Afterglow"],
  suffixes: ["Festival", "Weekender", "Live", "Presents", "Events", "Stage", "Sounds", "Gathering"]
};
const difficultyChoices: Array<{
  id: GameDifficulty;
  title: string;
  description: string;
}> = [
  {
    id: "relaxed",
    title: "Relaxed",
    description: "More starting cash and resources. Best for exploring."
  },
  {
    id: "standard",
    title: "Standard",
    description: "Balanced pacing and pressure."
  },
  {
    id: "hard",
    title: "Hard",
    description: "Lean cash, tighter resource starts, sharper choices."
  }
];

const setupDefaultsFor = (pack: TycoonGamePack) => ({
  companyName:
    pack.id === "game-studio"
      ? "Pixel Foundry"
      : pack.id === "coffee-shop"
        ? "Morning Ritual Cafe"
        : pack.id === "space-colony"
          ? "Aster Ridge Colony"
          : pack.id === "boutique-hotel"
            ? "Juniper Key Hotel"
            : pack.id === "festival"
              ? "Field Signal Festival"
              : pack.theme.title.replace(/\s+Tycoon$/i, "") || "New World",
  founderName: "Alex",
  roleLabel:
    pack.id === "game-studio"
      ? "First specialist"
      : pack.id === "coffee-shop"
        ? "First barista"
        : pack.id === "space-colony"
          ? "First specialist"
          : pack.id === "boutique-hotel"
            ? "First host"
            : pack.id === "festival"
              ? "First producer"
              : "First hire"
});

const randomFrom = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)] ?? items[0];

const randomCompanyNameFor = (pack: TycoonGamePack) => {
  const words =
    pack.id === "game-studio"
      ? studioNameWords
      : pack.id === "coffee-shop"
        ? cafeNameWords
        : pack.id === "space-colony"
          ? colonyNameWords
          : pack.id === "boutique-hotel"
            ? hotelNameWords
            : pack.id === "festival"
              ? festivalNameWords
              : yardNameWords;
  const style = Math.floor(Math.random() * 3);
  if (style === 0) {
    return `${randomFrom(words.prefixes)} ${randomFrom(words.suffixes)}`;
  }
  if (style === 1) {
    return `${randomFrom(words.middles)} ${randomFrom(words.suffixes)}`;
  }
  return `${randomFrom(words.prefixes)} ${randomFrom(words.middles)} ${randomFrom(words.suffixes)}`;
};

const setupDepartmentsFor = (pack: TycoonGamePack) => {
  const startingIds = new Set(pack.startingState.unlockedIds);
  const categories = pack.buildings
    .filter((building) => startingIds.has(building.id))
    .map((building) => building.category);
  return [...new Set(categories.length ? categories : pack.buildings.map((building) => building.category))].slice(
    0,
    4
  );
};

const titleCase = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "custom-tycoon";

const parseList = (value: FormDataEntryValue | null, fallback: string[]) =>
  String(value ?? "")
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8)
    .concat(fallback)
    .filter((item, index, items) => items.findIndex((candidate) => candidate.toLowerCase() === item.toLowerCase()) === index)
    .slice(0, 8);

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character] ?? character
  );

const builderTemplates = [
  {
    title: "Bookstore Tycoon",
    packId: "bookstore",
    businessNoun: "Bookshop",
    subtitle: "Turn a dusty shop into the neighborhood's favorite third place.",
    description: "A cozy retail management pack about stock, curation, events, local buzz, and loyal readers.",
    resources: "Stock, Curation, Recommendations, Events, Buzz, Loyalty",
    departments: "Stockroom, Curation, Counter, Events, Community",
    accent: "#2563eb",
    icon: "station"
  },
  {
    title: "Gym Tycoon",
    packId: "gym",
    businessNoun: "Gym",
    subtitle: "Grow a garage workout room into the city's busiest training club.",
    description: "A fitness management pack about equipment, coaching, classes, members, energy, and reputation.",
    resources: "Equipment, Coaching, Classes, Members, Energy, Reputation",
    departments: "Floor, Coaching, Classes, Sales, Recovery",
    accent: "#dc2626",
    icon: "bolt"
  },
  {
    title: "Aquarium Tycoon",
    packId: "aquarium",
    businessNoun: "Aquarium",
    subtitle: "Build a small marine exhibit into a beloved conservation destination.",
    description: "A visitor management pack about tanks, habitats, animal care, education, guests, and donations.",
    resources: "Tanks, Care, Habitats, Education, Guests, Donations",
    departments: "Filtration, Animal Care, Exhibits, Education, Gift Shop",
    accent: "#0891b2",
    icon: "fans"
  },
  {
    title: "Boardwalk Tycoon",
    packId: "boardwalk",
    businessNoun: "Boardwalk",
    subtitle: "Turn a sleepy pier into a glowing night-time attraction.",
    description: "A seaside management pack about stalls, rides, prizes, food, crowds, and local fame.",
    resources: "Stalls, Rides, Prizes, Food, Crowds, Fame",
    departments: "Maintenance, Attractions, Food Stalls, Games, Promotion",
    accent: "#ea580c",
    icon: "reputation"
  }
];

const applyBuilderTemplate = (form: HTMLFormElement, template = randomFrom(builderTemplates)) => {
  for (const [name, value] of Object.entries(template)) {
    const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    if (field) {
      field.value = value;
    }
  }
  const sceneImage = form.elements.namedItem("sceneImageData") as HTMLInputElement | null;
  const logoImage = form.elements.namedItem("logoImageData") as HTMLInputElement | null;
  if (sceneImage) {
    sceneImage.value = "";
  }
  if (logoImage) {
    logoImage.value = "";
  }
  setBuilderVisualMode(form, "gradient");
  updateBuilderPreview(form);
};

const gradientSceneFor = (accent: string) =>
  `linear-gradient(135deg, ${accent} 0%, color-mix(in srgb, ${accent} 42%, #0f172a) 46%, color-mix(in srgb, ${accent} 18%, #ffffff) 100%)`;

const genericSceneImage = "/assets/key-art/pack-grid-ai.png";

const generatedSceneAsset = (form: HTMLFormElement, accent: string) => {
  const data = new FormData(form);
  const mode = String(data.get("visualMode") || "gradient");
  const uploadedScene = String(data.get("sceneImageData") || "");
  if (mode === "upload" && uploadedScene) {
    return uploadedScene;
  }
  if (mode === "generic") {
    return genericSceneImage;
  }
  return gradientSceneFor(accent);
};

const generatedLogoAsset = (form: HTMLFormElement, sceneAsset: string) => {
  const data = new FormData(form);
  const uploadedLogo = String(data.get("logoImageData") || "");
  return uploadedLogo || sceneAsset;
};

const isCssVisual = (asset: string) => asset.startsWith("linear-gradient(") || asset.startsWith("radial-gradient(");

const visualStyle = (asset: string) =>
  isCssVisual(asset)
    ? `background:${asset};`
    : `background-image:linear-gradient(180deg, rgba(15,23,42,0.1), rgba(15,23,42,0.36)), url('${asset}');`;

const packCardArtStyle = (pack: TycoonGamePack) => {
  const asset = pack.theme.visual?.sceneImage;
  return asset ? ` style="${visualStyle(asset)}"` : "";
};

const featuredWorlds: Record<
  string,
  { kicker: string; headline: string; path: string[]; facts: Array<[string, string]> }
> = {
  festival: {
    kicker: "Default World · Full Pack",
    headline: "From back-room gig to field festival",
    path: ["Back Room Gig", "Club Night", "First Field", "Headline Weekend"],
    facts: [
      ["Core loop", "Artists to hype to tickets to reputation"],
      ["Management", "Bookers, stage techs, vendors, weather calls"],
      ["First goal", "Build the local lineup and sell the first show"]
    ]
  },
  "boutique-hotel": {
    kicker: "Featured World · Full Pack",
    headline: "From quiet townhouse to city favorite",
    path: ["First Rooms", "Breakfast Service", "Salon Night", "Return Guests"],
    facts: [
      ["Core loop", "Rooms to service to reviews to loyalty"],
      ["Management", "Housekeeping, front desk, amenities, events"],
      ["First goal", "Prepare the first rooms and earn weekend reviews"]
    ]
  }
};

const renderFeaturedWorld = ({ pack, tagline }: { pack: TycoonGamePack; tagline: string }) => {
  const content = featuredWorlds[pack.id] ?? {
    kicker: "Featured World",
    headline: pack.theme.subtitle,
    path: pack.contracts.slice(0, 4).map((contract) => contract.name),
    facts: [
      ["Core loop", pack.resources.slice(0, 4).map((resource) => resource.name).join(" to ")],
      ["Management", pack.theme.title],
      ["First goal", pack.contracts[0]?.name ?? "Start the business"]
    ] as Array<[string, string]>
  };
  return `
    <section class="featured-pack-card" style="--pack-accent:${pack.theme.ui?.accent ?? pack.theme.palette.accent}; --pack-accent-soft:${pack.theme.ui?.accentSoft ?? pack.theme.palette.accent}">
      <div class="featured-pack-art"${packCardArtStyle(pack)}></div>
      <div class="featured-pack-details">
        <span class="pack-title">${content.kicker}</span>
        <h2>${escapeHtml(content.headline)}</h2>
        <p>${escapeHtml(pack.theme.description ?? tagline)}</p>
        <div class="festival-ladder" aria-label="${escapeHtml(pack.theme.title)} growth path">
          ${content.path.map((step) => `<span>${escapeHtml(step)}</span>`).join("")}
        </div>
        <dl class="featured-pack-facts">
          ${content.facts
            .map(
              ([term, definition]) => `
                <div>
                  <dt>${escapeHtml(term)}</dt>
                  <dd>${escapeHtml(definition)}</dd>
                </div>
              `
            )
            .join("")}
        </dl>
        <button class="featured-pack-play" data-action="choose-pack" data-id="${pack.id}" type="button">
          ${icon("gamepad", "ui-icon button-icon")}Play ${escapeHtml(pack.theme.title)}
        </button>
      </div>
    </section>
  `;
};

const buildStarterPack = (form: HTMLFormElement): TycoonGamePack => {
  const data = new FormData(form);
  const title = String(data.get("title") || "My Tycoon").trim();
  const packId = slugify(String(data.get("packId") || title));
  const businessNoun = String(data.get("businessNoun") || "Business").trim() || "Business";
  const accent = String(data.get("accent") || "#2563eb");
  const sceneAsset = generatedSceneAsset(form, accent);
  const logoAsset = generatedLogoAsset(form, sceneAsset);
  const resources = parseList(data.get("resources"), ["Output", "Quality", "Buzz", "Loyalty"]).slice(0, 6);
  const departments = parseList(data.get("departments"), ["Source", "Make", "Promote", "Serve"]).slice(0, 5);
  const resourceDefs = resources.map((name) => ({
    id: slugify(name).replace(/-/g, "_"),
    name,
    description: `${name} generated by ${title}.`
  }));
  const departmentIds = departments.map((name) => slugify(name).replace(/-/g, "_"));
  const baseResource = resourceDefs[0];
  const finalResource = resourceDefs[Math.min(3, resourceDefs.length - 1)] ?? baseResource;
  const reputationResource = resourceDefs[resourceDefs.length - 1] ?? finalResource;

  const recipes = departmentIds.map((category, index) => {
    const output = resourceDefs[Math.min(index, resourceDefs.length - 1)] ?? baseResource;
    const input = index === 0 ? undefined : resourceDefs[Math.min(index - 1, resourceDefs.length - 1)];
    return {
      id: `${category}_loop`,
      name: `${departments[index]} Loop`,
      durationMs: 2200 + index * 500,
      inputs: input ? { [input.id]: index === 1 ? 1 : 2 } : {},
      outputs: { [output.id]: index === 0 ? 4 : 2 }
    };
  });

  const buildings = departmentIds.map((category, index) => ({
    id: `${category}_station`,
    name: `${departments[index]} Station`,
    description: `The first ${departments[index].toLowerCase()} station for ${title}.`,
    category,
    size: { width: index > 2 ? 2 : 1, height: 1 },
    cost: index === 0 ? 0 : 60 + index * 55,
    recipeId: `${category}_loop`,
    color: ["#2563eb", "#14b8a6", "#f59e0b", "#8b5cf6", "#ef4444"][index] ?? accent,
    icon: ["station", "tools", "megaphone", "workers", "reputation"][index] ?? "station"
  }));

  return {
    id: packId,
    theme: {
      title,
      subtitle: String(data.get("subtitle") || `Build a tiny ${businessNoun.toLowerCase()} into a local favorite.`),
      description: String(data.get("description") || `A PackForge starter pack for a ${businessNoun.toLowerCase()} management tycoon.`),
      visual: {
        icon: String(data.get("icon") || "station"),
        illustration: "custom",
        sceneImage: sceneAsset,
        logoImage: logoAsset
      },
      palette: { soil: "#334155", grid: "#cbd5e1", accent, panel: "#ffffff" },
      ui: {
        background: "#f5f8fc",
        surface: "#ffffff",
        surfaceAlt: "#eef4fb",
        text: "#111827",
        muted: "#667085",
        border: "#d8e3ef",
        accent,
        accentStrong: accent,
        accentSoft: "#e0f2fe",
        success: "#16a34a",
        warning: "#f97316",
        danger: "#dc2626"
      }
    },
    resources: resourceDefs,
    recipes,
    buildings,
    contracts: [
      {
        id: "first_delivery",
        name: `First ${businessNoun} Win`,
        description: `Prove ${title} can deliver its first paid result.`,
        requires: { [finalResource.id]: 8 },
        rewardCash: 180,
        unlockIds: ["growth_project", departmentIds[3] ? `${departmentIds[3]}_station` : reputationResource.id]
      },
      {
        id: "reputation_push",
        name: "Reputation Push",
        description: "Turn early delivery into a stronger public signal.",
        requires: { [reputationResource.id]: 8 },
        rewardCash: 360,
        unlockIds: ["scale_upgrade"],
        repeatable: true
      }
    ],
    upgrades: [
      {
        id: "faster_flow",
        name: "Faster Flow",
        description: `${departments[0]} work runs faster.`,
        cost: 180,
        effect: { productionMultipliers: [{ category: departmentIds[0], multiplier: 1.3 }] }
      },
      {
        id: "scale_upgrade",
        name: "Expand the Floor",
        description: `Open more room for the ${businessNoun.toLowerCase()}.`,
        cost: 520,
        effect: { expandGrid: { width: 4, height: 2 } }
      }
    ],
    actions: [
      {
        id: "promo_push",
        name: "Promo Push",
        description: "Spend cash for a quick useful resource bump.",
        costCash: 45,
        cooldownMs: 22_000,
        effect: { resources: { [baseResource.id]: 6 } },
        icon: "megaphone"
      }
    ],
    markets: [
      {
        id: "local-market",
        name: "Local Market",
        description: `Early customers for ${title}.`,
        demand: 1.05,
        rewardMultiplier: 1.1,
        qualityMultiplier: 1.05
      }
    ],
    projects: [
      {
        id: "opening_project",
        name: `Opening ${businessNoun}`,
        description: `Launch the first version of ${title}.`,
        marketId: "local-market",
        rewardCash: 260,
        unlockIds: ["first_delivery"],
        phases: departments.slice(0, 4).map((name, index) => ({
          id: departmentIds[index],
          name,
          durationMs: 4000 + index * 1000,
          qualityFromResources: { [resourceDefs[Math.min(index, resourceDefs.length - 1)].id]: 2 },
          risk: index
        }))
      },
      {
        id: "growth_project",
        name: `Growth ${businessNoun}`,
        description: `Scale ${title} into a stronger operation.`,
        marketId: "local-market",
        costCash: 120,
        rewardCash: 520,
        unlockIds: ["reputation_push"],
        phases: departments.slice(1, 4).map((name, index) => ({
          id: `${departmentIds[index + 1]}_growth`,
          name,
          durationMs: 5000 + index * 1000,
          qualityFromResources: { [resourceDefs[Math.min(index + 1, resourceDefs.length - 1)].id]: 3 },
          risk: index + 1
        }))
      }
    ],
    events: [
      {
        id: "early-pressure",
        name: "Early Pressure",
        description: "A small surprise tests the first version of the business.",
        trigger: { elapsedMs: 30_000 },
        choices: [
          {
            id: "protect-quality",
            label: "Protect Quality",
            description: "Lower risk and improve the active project.",
            effect: { projectRisk: -3, projectQuality: 3 }
          },
          {
            id: "chase-demand",
            label: "Chase Demand",
            description: "Gain cash but increase project risk.",
            effect: { cash: 50, projectRisk: 5 }
          }
        ]
      }
    ],
    staffRoles: departmentIds.map((category, index) => ({
      id: `${category}_lead`,
      name: `${departments[index]} Lead`,
      category,
      baseWage: 0.12 + index * 0.02
    })),
    staffCandidates: departmentIds.slice(0, 3).map((category, index) => ({
      id: `candidate_${category}`,
      name: ["Sam Vale", "Mira Cole", "Theo Hart"][index] ?? `${departments[index]} Lead`,
      roleId: `${category}_lead`,
      hireCost: 130 + index * 35,
      level: index === 0 ? 1 : 2,
      traits: [["steady"], ["creative"], ["organized"]][index] ?? ["reliable"],
      morale: 76
    })),
    startingState: {
      grid: { width: 8, height: 6 },
      cash: 260,
      resources: Object.fromEntries(resourceDefs.map((resource, index) => [resource.id, index === 0 ? 10 : 0])),
      unlockedIds: [`${departmentIds[0]}_station`, `${departmentIds[1]}_station`, "first_delivery", "opening_project"]
    }
  };
};

const renderPackSelector = () => {
  stopTicker?.();
  stopTicker = undefined;
  unmountHud?.();
  unmountHud = undefined;
  setPageTitle();
  applyUiTheme(getPlayablePack(activePackId).theme, document.documentElement);
  const playablePacks = [
    ...gamePacks.map((entry) => ({ ...entry, source: "built-in" as const })),
    ...customPacks.map((pack) => ({
      pack,
      tagline: pack.theme.description ?? "A custom PackForge world from your local library.",
      source: "custom" as const
    }))
  ];
  const featuredPackEntries = ["festival", "boutique-hotel"]
    .map((packId) => playablePacks.find(({ pack, source }) => pack.id === packId && source === "built-in"))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const featuredPackIds = new Set(featuredPackEntries.map(({ pack }) => pack.id));
  const gridPacks = featuredPackEntries.length
    ? playablePacks.filter(({ pack }) => !featuredPackIds.has(pack.id))
    : playablePacks;
  hudRoot.innerHTML = `
    <main class="pack-select-screen">
      <section class="pack-select-header">
        <span class="brand-kicker">Modular Management Worlds</span>
        <h1>PackForge Tycoon</h1>
        <p>Choose a game pack and build a business from the first tiny win.</p>
        <div class="pack-select-actions">
          <a class="download-sdk-link" href="/downloads/packforge-sdk-0.1.0.tar.gz" download>
            ${icon("download", "ui-icon button-icon")}Download SDK
          </a>
          <button class="builder-open-link builder-open-link-disabled" data-action="open-builder" disabled aria-disabled="true" title="Coming back once image generation is integrated.">
            ${icon("tools", "ui-icon button-icon")}Game Builder <small>Coming soon</small>
          </button>
          <label class="import-world-link">
            ${icon("upload", "ui-icon button-icon")}Load World JSON
            <input type="file" accept="application/json,.json" data-action="import-world-file" />
          </label>
        </div>
        ${
          libraryMessage
            ? `<p class="library-message" role="status">${escapeHtml(libraryMessage)}</p>`
            : ""
        }
      </section>
      ${featuredPackEntries.length ? `<section class="featured-pack-stack">${featuredPackEntries.map(renderFeaturedWorld).join("")}</section>` : ""}
      <section class="pack-grid">
        ${gridPacks
          .map(
            ({ pack, tagline, source }) => `
              <sl-card class="pack-card ${pack.id === activePackId ? "selected" : ""}" style="--pack-accent:${pack.theme.ui?.accent ?? pack.theme.palette.accent}; --pack-accent-soft:${pack.theme.ui?.accentSoft ?? pack.theme.palette.accent}">
                <button class="pack-card-button" data-action="choose-pack" data-id="${pack.id}">
                  <span class="pack-card-art pack-art-${pack.id}"${packCardArtStyle(pack)}></span>
                  <span class="pack-title">${source === "custom" ? "My World" : pack.theme.title}</span>
                  <strong>${source === "custom" ? pack.theme.title : pack.theme.subtitle}</strong>
                  <small>${pack.theme.description ?? tagline}</small>
                </button>
              </sl-card>
            `
          )
          .join("")}
      </section>
    </main>
  `;
};

const renderBuilder = () => {
  stopTicker?.();
  stopTicker = undefined;
  unmountHud?.();
  unmountHud = undefined;
  setPageTitle("Game Builder");
  applyUiTheme(getPlayablePack(activePackId).theme, document.documentElement);
  hudRoot.innerHTML = `
    <main class="builder-screen">
      <section class="builder-hero">
        <div class="builder-hero-actions">
          <button class="setup-back" data-action="back-to-packs" type="button">${icon("reset", "ui-icon button-icon")}Games</button>
          <button class="builder-random-button" data-action="random-builder-template" type="button">${icon("bolt", "ui-icon button-icon")}Try Template</button>
        </div>
        <span class="brand-kicker">PackForge Builder</span>
        <h1>Build a Game Pack</h1>
        <p>Sketch a tycoon world, generate starter data, then download the JSON as a foundation for a full PackForge game.</p>
      </section>

      <form class="builder-workbench" data-builder-form>
        <section class="builder-panel builder-form-panel">
          <div class="setup-section-header">
            <span>${icon("clipboard", "ui-icon header-icon")}World</span>
            <strong>Identity and mood</strong>
          </div>
          <label class="setup-field">
            <span>Game title</span>
            <input name="title" value="Bookstore Tycoon" maxlength="40" autocomplete="off" />
          </label>
          <label class="setup-field">
            <span>Pack id</span>
            <input name="packId" value="bookstore" maxlength="34" autocomplete="off" />
          </label>
          <label class="setup-field">
            <span>Business noun</span>
            <input name="businessNoun" value="Bookshop" maxlength="28" autocomplete="off" />
          </label>
          <label class="setup-field">
            <span>Subtitle</span>
            <input name="subtitle" value="Turn a dusty shop into the neighborhood's favorite third place." maxlength="96" autocomplete="off" />
          </label>
          <label class="setup-field">
            <span>Description</span>
            <textarea name="description" rows="3">A cozy retail management pack about stock, curation, events, local buzz, and loyal readers.</textarea>
          </label>
          <div class="builder-inline-fields">
            <label class="setup-field">
              <span>Accent</span>
              <input name="accent" type="color" value="#2563eb" />
            </label>
            <label class="setup-field">
              <span>Icon</span>
              <select name="icon">
                <option value="station">Station</option>
                <option value="coffee">Coffee</option>
                <option value="audio">Audio</option>
                <option value="rocket">Rocket</option>
                <option value="tools">Tools</option>
                <option value="reputation">Star</option>
              </select>
            </label>
          </div>
          <section class="visual-builder">
            <div class="setup-section-header compact">
              <span>${icon("art", "ui-icon header-icon")}Visuals</span>
              <strong>Default or uploaded art</strong>
            </div>
            <div class="visual-mode-grid">
              <label class="visual-mode-choice selected">
                <input type="radio" name="visualMode" value="gradient" checked />
                <span class="visual-mode-swatch gradient"></span>
                <strong>Gradient</strong>
              </label>
              <label class="visual-mode-choice">
                <input type="radio" name="visualMode" value="generic" />
                <span class="visual-mode-swatch generic"></span>
                <strong>Generic</strong>
              </label>
              <label class="visual-mode-choice">
                <input type="radio" name="visualMode" value="upload" />
                <span class="visual-mode-swatch upload"></span>
                <strong>Upload</strong>
              </label>
            </div>
            <input type="hidden" name="sceneImageData" />
            <input type="hidden" name="logoImageData" />
            <div class="upload-row">
              <label class="asset-upload-button">
                ${icon("upload", "ui-icon button-icon")}Scene Image
                <input type="file" accept="image/png,image/jpeg,image/webp" data-action="builder-scene-image" />
              </label>
              <label class="asset-upload-button">
                ${icon("upload", "ui-icon button-icon")}Logo Image
                <input type="file" accept="image/png,image/jpeg,image/webp" data-action="builder-logo-image" />
              </label>
            </div>
            <small class="builder-help-text">Uploaded images are embedded into the world JSON for local export/import.</small>
          </section>
        </section>

        <section class="builder-panel">
          <div class="setup-section-header">
            <span>${icon("gear", "ui-icon header-icon")}Systems</span>
            <strong>Comma or line separated</strong>
          </div>
          <label class="setup-field">
            <span>Resources</span>
            <textarea name="resources" rows="5">Stock, Curation, Recommendations, Events, Buzz, Loyalty</textarea>
          </label>
          <label class="setup-field">
            <span>Departments</span>
            <textarea name="departments" rows="5">Stockroom, Curation, Counter, Events, Community</textarea>
          </label>
          <div class="builder-actions">
            <button type="button" data-action="save-builder-world">${icon("save", "ui-icon button-icon")}Save to My Worlds</button>
            <button type="submit">${icon("check", "ui-icon button-icon")}Generate Pack</button>
            <button type="button" data-action="download-builder-pack">${icon("download", "ui-icon button-icon")}Download JSON</button>
          </div>
        </section>

        <section class="builder-panel builder-preview-panel">
          <div class="setup-section-header">
            <span>${icon("code", "ui-icon header-icon")}Generated Pack</span>
            <strong data-builder-summary>Starter JSON</strong>
          </div>
          <div class="builder-live-preview" data-builder-live-preview></div>
          <textarea class="builder-output" data-builder-output spellcheck="false"></textarea>
        </section>
      </form>
    </main>
  `;
  const form = hudRoot.querySelector<HTMLFormElement>("[data-builder-form]");
  if (form) {
    updateBuilderPreview(form);
  }
};

const updateBuilderPreview = (form: HTMLFormElement) => {
  const pack = buildStarterPack(form);
  const output = hudRoot.querySelector<HTMLTextAreaElement>("[data-builder-output]");
  const summary = hudRoot.querySelector<HTMLElement>("[data-builder-summary]");
  const livePreview = hudRoot.querySelector<HTMLElement>("[data-builder-live-preview]");
  if (output) {
    output.value = JSON.stringify(pack, null, 2);
  }
  if (summary) {
    summary.textContent = `${pack.resources.length} resources · ${pack.buildings.length} departments · ${pack.projects?.length ?? 0} projects`;
  }
  if (livePreview) {
    const firstProject = pack.projects?.[0];
    const firstContract = pack.contracts[0];
    const sceneAsset = pack.theme.visual?.sceneImage ?? gradientSceneFor(pack.theme.palette.accent);
    const logoAsset = pack.theme.visual?.logoImage ?? sceneAsset;
    livePreview.style.setProperty("--builder-accent", pack.theme.palette.accent);
    livePreview.innerHTML = `
      <div class="builder-pack-card">
        <div class="builder-scene-preview" style="${visualStyle(sceneAsset)}">
          <span>Scene Preview</span>
        </div>
        <div class="builder-pack-scene">
          <span class="builder-pack-mark" style="${visualStyle(logoAsset)}">
            <span class="builder-pack-mark-glass">${icon(pack.theme.visual?.icon ?? "station", "ui-icon builder-pack-icon")}</span>
          </span>
          <div>
            <span>${escapeHtml(pack.id)}</span>
            <strong>${escapeHtml(pack.theme.title)}</strong>
            <small>${escapeHtml(pack.theme.subtitle)}</small>
          </div>
        </div>
        <div class="builder-preview-grid">
          <article>
            <span>Opening Cash</span>
            <strong>$${pack.startingState.cash}</strong>
          </article>
          <article>
            <span>First Contract</span>
            <strong>${escapeHtml(firstContract?.name ?? "None")}</strong>
          </article>
          <article>
            <span>First Project</span>
            <strong>${escapeHtml(firstProject?.name ?? "None")}</strong>
          </article>
        </div>
        <div class="builder-chip-section">
          <span>Resources</span>
          <div>${pack.resources.map((resource) => `<b>${escapeHtml(resource.name)}</b>`).join("")}</div>
        </div>
        <div class="builder-chip-section">
          <span>Departments</span>
          <div>${pack.buildings.map((building) => `<b>${escapeHtml(building.category.replace(/_/g, " "))}</b>`).join("")}</div>
        </div>
        <div class="builder-flow-preview">
          ${(firstProject?.phases ?? [])
            .slice(0, 4)
            .map((phase, index) => `<span class="${index === 0 ? "active" : ""}">${escapeHtml(phase.name)}</span>`)
            .join("")}
        </div>
      </div>
    `;
  }
  return pack;
};

const downloadBuilderPack = (form: HTMLFormElement) => {
  const pack = updateBuilderPreview(form);
  const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${pack.id}.packforge.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const renderSetup = (packId: string) => {
  stopTicker?.();
  stopTicker = undefined;
  unmountHud?.();
  unmountHud = undefined;

  activePackId = packId;
  const pack = getPlayablePack(packId);
  const defaults = setupDefaultsFor(pack);
  const departments = setupDepartmentsFor(pack);
  setPageTitle(`Found ${defaults.companyName}`, pack.theme.title);
  applyUiTheme(pack.theme, document.documentElement);
  hudRoot.innerHTML = `
    <main class="founder-setup-screen">
      <section class="founder-preview">
        <button class="setup-back" data-action="back-to-packs">${icon("reset", "ui-icon button-icon")}Games</button>
        <span class="brand-kicker">${pack.theme.title}</span>
        <h1 data-preview-company>${defaults.companyName}</h1>
        <p><strong>Found your company.</strong> <span data-preview-founder>Founded by ${defaults.founderName}</span>. Choose the mark, pressure, and first person beside you.</p>
        <div class="founder-logo-preview logo-shape-squircle logo-pattern-shine" data-preview-logo style="--setup-logo-color:${colorChoices[0]}">
          ${icon(pack.theme.visual?.icon ?? "gamepad", "ui-icon founder-logo-icon")}
        </div>
        <div class="founder-logo-caption">
          <span data-preview-logo-name>${defaults.companyName}</span>
          <strong>${pack.theme.subtitle}</strong>
        </div>
      </section>

      <form class="founder-form" data-setup-form>
        <section class="setup-panel">
          <div class="setup-section-header">
            <span>${icon("clipboard", "ui-icon header-icon")}Identity</span>
            <strong>This appears on the command board</strong>
          </div>
          <label class="setup-field">
            <span>Company name</span>
            <div class="company-name-row">
              <input name="companyName" value="${defaults.companyName}" maxlength="34" autocomplete="off" />
              <button type="button" data-action="random-company-name">${icon("bolt", "ui-icon button-icon")}Randomise</button>
            </div>
          </label>
          <label class="setup-field">
            <span>Founder name</span>
            <input name="founderName" value="${defaults.founderName}" maxlength="24" autocomplete="off" />
          </label>
        </section>

        <section class="setup-panel">
          <div class="setup-section-header">
            <span>${icon("art", "ui-icon header-icon")}Logo Creator</span>
            <strong>Shape, mark, color, finish</strong>
          </div>
          <div class="logo-maker-preview" data-mini-logo style="--setup-logo-color:${colorChoices[0]}">
            <span class="founder-logo-preview logo-shape-squircle logo-pattern-shine">
              ${icon(pack.theme.visual?.icon ?? "gamepad", "ui-icon founder-logo-icon")}
            </span>
          </div>
          <div class="logo-subsection">
            <span>Shape</span>
            <div class="logo-shape-grid">
              ${logoShapeChoices
                .map(
                  (shape, index) => `
                    <label class="logo-shape-choice ${index === 0 ? "selected" : ""}">
                      <input type="radio" name="logoShape" value="${shape.id}" ${index === 0 ? "checked" : ""} />
                      <span class="shape-token logo-shape-${shape.id}"></span>
                      <strong>${shape.title}</strong>
                    </label>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="logo-subsection">
            <span>Mark</span>
          <div class="logo-choice-grid">
            ${logoChoices
              .map(
                (logo, index) => `
                  <label class="logo-choice ${index === 0 ? "selected" : ""}">
                    <input type="radio" name="logoIcon" value="${logo}" ${index === 0 ? "checked" : ""} />
                    <span>${icon(logo, "ui-icon founder-choice-icon")}</span>
                  </label>
                `
              )
              .join("")}
          </div>
          </div>
          <div class="logo-subsection">
            <span>Color</span>
          <div class="color-choice-grid">
            ${colorChoices
              .map(
                (color, index) => `
                  <label class="color-choice ${index === 0 ? "selected" : ""}" style="--choice-color:${color}">
                    <input type="radio" name="logoColor" value="${color}" ${index === 0 ? "checked" : ""} />
                    <span></span>
                  </label>
                `
              )
              .join("")}
          </div>
          </div>
          <div class="logo-subsection">
            <span>Finish</span>
            <div class="logo-pattern-grid">
              ${logoPatternChoices
                .map(
                  (pattern, index) => `
                    <label class="logo-pattern-choice ${index === 0 ? "selected" : ""}">
                      <input type="radio" name="logoPattern" value="${pattern.id}" ${index === 0 ? "checked" : ""} />
                      <span class="pattern-token logo-pattern-${pattern.id}" style="--setup-logo-color:${colorChoices[index] ?? colorChoices[0]}"></span>
                      <strong>${pattern.title}</strong>
                    </label>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>

        <section class="setup-panel">
          <div class="setup-section-header">
            <span>${icon("bolt", "ui-icon header-icon")}Difficulty</span>
            <strong>Changes the opening economy</strong>
          </div>
          <div class="difficulty-grid">
            ${difficultyChoices
              .map(
                (difficulty) => `
                  <label class="difficulty-choice ${difficulty.id === "standard" ? "selected" : ""}">
                    <input type="radio" name="difficulty" value="${difficulty.id}" ${difficulty.id === "standard" ? "checked" : ""} />
                    <strong>${difficulty.title}</strong>
                    <small>${difficulty.description}</small>
                  </label>
                `
              )
              .join("")}
          </div>
        </section>

        <section class="setup-panel">
          <div class="setup-section-header">
            <span>${icon("workers", "ui-icon header-icon")}${defaults.roleLabel}</span>
            <strong>Your first hire starts assigned here</strong>
          </div>
          <div class="department-choice-grid">
            ${departments
              .map(
                (department, index) => `
                  <label class="department-choice ${index === 0 ? "selected" : ""}">
                    <input type="radio" name="firstDepartment" value="${department}" ${index === 0 ? "checked" : ""} />
                    <span>${icon(categoryIconId(department), "ui-icon founder-choice-icon")}</span>
                    <strong>${titleCase(department)}</strong>
                  </label>
                `
              )
              .join("")}
          </div>
        </section>

        <div class="setup-actions">
          <button type="button" data-action="back-to-packs">${icon("reset", "ui-icon button-icon")}Back</button>
          <button type="submit">${icon("check", "ui-icon button-icon")}Start Company</button>
        </div>
      </form>
    </main>
  `;
};

const mountGame = (packId: string, profile?: Partial<FounderProfile>) => {
  activePackId = packId;
  localStorage.setItem("selected-game-pack", packId);
  stopTicker?.();
  unmountHud?.();

  const pack = getPlayablePack(packId);
  const controller = new GameController(pack, profile);
  window.tycoon = controller;
  setPageTitle(controller.getSnapshot().state.profile.companyName, pack.theme.title);
  unmountHud = mountHud(hudRoot, controller, {
    onChangePack: renderPackSelector
  });
  stopTicker = startSimulationTicker(controller);
};

const updateSetupPreview = (form: HTMLFormElement) => {
  form.querySelectorAll(".selected").forEach((element) => element.classList.remove("selected"));
  form.querySelectorAll<HTMLInputElement>("input:checked").forEach((checked) => {
    checked.closest("label")?.classList.add("selected");
  });

  const data = new FormData(form);
  const pack = getPlayablePack(activePackId);
  const defaults = setupDefaultsFor(pack);
  const companyName = String(data.get("companyName") || defaults.companyName).trim() || defaults.companyName;
  const founderName = String(data.get("founderName") || defaults.founderName).trim() || defaults.founderName;
  const logoColor = String(data.get("logoColor") || colorChoices[0]);
  const logoIcon = String(data.get("logoIcon") || pack.theme.visual?.icon || "gamepad");
  const logoShape = String(data.get("logoShape") || "squircle");
  const logoPattern = String(data.get("logoPattern") || "shine");
  const logoMarkup = icon(logoIcon, "ui-icon founder-logo-icon");

  hudRoot.querySelector<HTMLElement>("[data-preview-company]")!.textContent = companyName;
  hudRoot.querySelector<HTMLElement>("[data-preview-founder]")!.textContent = `Founded by ${founderName}`;
  hudRoot.querySelector<HTMLElement>("[data-preview-logo-name]")!.textContent = companyName;
  setPageTitle(`Found ${companyName}`, pack.theme.title);

  for (const preview of hudRoot.querySelectorAll<HTMLElement>("[data-preview-logo], [data-mini-logo] .founder-logo-preview")) {
    preview.style.setProperty("--setup-logo-color", logoColor);
    preview.className = `founder-logo-preview logo-shape-${logoShape} logo-pattern-${logoPattern}`;
    preview.innerHTML = logoMarkup;
  }
};

hudRoot.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!target) {
    return;
  }
  if (target.dataset.action === "choose-pack") {
    const packId = target.dataset.id ?? defaultGamePackId;
    renderSetup(packId);
  }
  if (target.dataset.action === "back-to-packs") {
    renderPackSelector();
  }
  if (target.dataset.action === "open-builder") {
    if (target instanceof HTMLButtonElement && target.disabled) {
      return;
    }
    renderBuilder();
  }
  if (target.dataset.action === "download-builder-pack") {
    const form = target.closest<HTMLFormElement>("[data-builder-form]");
    if (form) {
      downloadBuilderPack(form);
    }
  }
  if (target.dataset.action === "save-builder-world") {
    const form = target.closest<HTMLFormElement>("[data-builder-form]");
    if (form) {
      const result = addCustomPack(updateBuilderPreview(form));
      libraryMessage = result.message;
      if (result.ok) {
        activePackId = buildStarterPack(form).id;
        renderPackSelector();
      } else {
        const summary = hudRoot.querySelector<HTMLElement>("[data-builder-summary]");
        if (summary) {
          summary.textContent = result.message;
        }
      }
    }
  }
  if (target.dataset.action === "random-builder-template") {
    const form = hudRoot.querySelector<HTMLFormElement>("[data-builder-form]");
    if (form) {
      applyBuilderTemplate(form);
    }
  }
  if (target.dataset.action === "random-company-name") {
    const form = target.closest<HTMLFormElement>("[data-setup-form]");
    const companyInput = form?.elements.namedItem("companyName") as HTMLInputElement | null;
    if (!form || !companyInput) {
      return;
    }
    companyInput.value = randomCompanyNameFor(getPlayablePack(activePackId));
    updateSetupPreview(form);
  }
});

hudRoot.addEventListener("change", async (event) => {
  const input = event.target as HTMLInputElement;
  if (input.dataset.action === "builder-scene-image") {
    await setBuilderImageData(input, "sceneImageData");
    return;
  }
  if (input.dataset.action === "builder-logo-image") {
    await setBuilderImageData(input, "logoImageData");
    return;
  }
  if (input.dataset.action === "import-world-file") {
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    try {
      const pack = await parseImportedPack(file);
      const result = addCustomPack(pack);
      libraryMessage = result.message;
      if (result.ok) {
        activePackId = pack.id;
      }
    } catch {
      libraryMessage = "Could not read that JSON file.";
    }
    renderPackSelector();
    return;
  }
  if (input.form?.matches("[data-builder-form]")) {
    if (input.name === "visualMode") {
      setBuilderVisualMode(input.form, input.value as "gradient" | "generic" | "upload");
    }
    updateBuilderPreview(input.form);
    return;
  }
  if (!input.form?.matches("[data-setup-form]")) {
    return;
  }
  updateSetupPreview(input.form);
});

hudRoot.addEventListener("input", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.form?.matches("[data-builder-form]")) {
    updateBuilderPreview(input.form);
    return;
  }
  if (!input.form?.matches("[data-setup-form]")) {
    return;
  }
  updateSetupPreview(input.form);
});

hudRoot.addEventListener("submit", (event) => {
  const form = (event.target as HTMLElement).closest<HTMLFormElement>("[data-setup-form]");
  const builderForm = (event.target as HTMLElement).closest<HTMLFormElement>("[data-builder-form]");
  if (builderForm) {
    event.preventDefault();
    updateBuilderPreview(builderForm);
    return;
  }
  if (!form) {
    return;
  }
  event.preventDefault();
  const data = new FormData(form);
  const profile: FounderProfile = {
    companyName: String(data.get("companyName") || setupDefaultsFor(getPlayablePack(activePackId)).companyName).trim(),
    founderName: String(data.get("founderName") || "Alex").trim(),
    logoIcon: String(data.get("logoIcon") || "gamepad"),
    logoColor: String(data.get("logoColor") || colorChoices[0]),
    logoShape: (String(data.get("logoShape") || "squircle") as LogoShape),
    logoPattern: (String(data.get("logoPattern") || "shine") as LogoPattern),
    difficulty: (String(data.get("difficulty") || "standard") as GameDifficulty),
    firstDepartment: String(data.get("firstDepartment") || "")
  };
  mountGame(activePackId, profile);
});

if (savedPackId && hasSavedGame(getPlayablePack(savedPackId))) {
  mountGame(savedPackId);
} else {
  renderPackSelector();
}
