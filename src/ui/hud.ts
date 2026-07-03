import type { GameController, GameSnapshot } from "../app/controller";
import {
  buildingPurchaseCost,
  staffWagePerSecond,
  workerHireCost,
  type BuildingDefinition,
  type GameTheme,
  type ResourceBag
} from "@packforge/core";

const formatResourceId = (id: string) =>
  id
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatBag = (bag: ResourceBag) =>
  Object.entries(bag)
    .filter(([, amount]) => amount > 0)
    .map(([id, amount]) => `${formatResourceId(id)} ${Math.floor(amount)}`)
    .join(", ");

const bagChips = (bag: ResourceBag, className = "bag-chips") => {
  const chips = Object.entries(bag)
    .filter(([, amount]) => amount > 0)
    .map(
      ([id, amount]) => `
        <span class="bag-chip">
          <span>${formatResourceId(id)}</span>
          <strong>${Math.floor(amount)}</strong>
        </span>
      `
    )
    .join("");
  return `<div class="${className}">${chips || `<span class="bag-chip muted">None</span>`}</div>`;
};

const canAffordBag = (owned: ResourceBag, required: ResourceBag) =>
  Object.entries(required).every(([id, amount]) => (owned[id] ?? 0) >= amount);

const categoryLabel = (category: string) =>
  category.charAt(0).toUpperCase() + category.slice(1);

const categoryList = (buildings: BuildingDefinition[]) =>
  [...new Set(buildings.map((building) => building.category))];

const countByCategory = (buildings: BuildingDefinition[], snapshot: GameSnapshot) =>
  categoryList(snapshot.pack.buildings).map((category) => {
    const stationCount = snapshot.state.buildings.filter((placed) => {
      const definition = buildings.find((building) => building.id === placed.buildingId);
      return definition?.category === category;
    }).length;
    return {
      category,
      stationCount,
      workers: snapshot.state.staff.assignments[category] ?? 0
    };
  });

const productionRateLabel = (snapshot: GameSnapshot) => {
  const activeStations = snapshot.state.buildings.length;
  const assigned = Object.values(snapshot.state.staff.assignments).reduce(
    (total, value) => total + value,
    0
  );
  return `${activeStations} stations · ${assigned}/${snapshot.state.staff.totalHired} staff assigned`;
};

const visibleContractCards = (cards: string) => cards || `<p class="empty">No contracts available.</p>`;

const progressPercent = (snapshot: GameSnapshot, building: BuildingDefinition) => {
  const recipe = building.recipeId
    ? snapshot.pack.recipes.find((item) => item.id === building.recipeId)
    : undefined;
  if (!recipe) {
    return 0;
  }
  const placed = snapshot.state.buildings.filter((item) => item.buildingId === building.id);
  if (placed.length === 0) {
    return 0;
  }
  const average =
    placed.reduce((total, item) => total + item.progressMs / recipe.durationMs, 0) / placed.length;
  return Math.max(0, Math.min(100, Math.round(average * 100)));
};

const recipeSummary = (snapshot: GameSnapshot, building: BuildingDefinition) => {
  const recipe = building.recipeId
    ? snapshot.pack.recipes.find((item) => item.id === building.recipeId)
    : undefined;
  if (!recipe) {
    return `<div class="recipe-summary"><span>Support</span><strong>No production recipe</strong></div>`;
  }
  return `
    <div class="recipe-summary">
      <span>${recipe.name}</span>
      ${bagChips(recipe.outputs, "bag-chips compact")}
    </div>
  `;
};

const completionPercent = (owned: ResourceBag, required: ResourceBag) => {
  const entries = Object.entries(required).filter(([, amount]) => amount > 0);
  if (entries.length === 0) {
    return 100;
  }
  const progress =
    entries.reduce((total, [id, amount]) => total + Math.min((owned[id] ?? 0) / amount, 1), 0) /
    entries.length;
  return Math.max(0, Math.min(100, Math.round(progress * 100)));
};

const formatSeconds = (ms: number) => `${Math.ceil(ms / 1000)}s`;

const formatMoney = (amount: number) => `$${Math.floor(amount).toLocaleString("en-US")}`;

const resourceGlyph = (id: string) =>
  ({
    art: "🎨",
    audio: "🎵",
    builds: "📦",
    buzz: "📣",
    circuits: "🔌",
    code: "💻",
    components: "🧰",
    copper_wire: "🧵",
    crops: "🌿",
    design: "✏️",
    fans: "🧡",
    gears: "⚙️",
    hype: "📣",
    ideas: "💡",
    ingots: "⬡",
    loyalty: "🤝",
    morale: "🙂",
    motors: "🔋",
    oxygen: "💨",
    plates: "▰",
    power: "⚡",
    reputation: "⭐",
    research: "🧪",
    revenue: "💵",
    scrap: "🔩",
    sorted_metal: "🧲",
    water: "💧",
    widgets: "🛠️"
  })[id] ?? "⬢";

const statGlyph = (id: "cash" | "staff" | "jobs" | "forecast") =>
  ({
    cash: "💵",
    staff: "👥",
    jobs: "💼",
    forecast: "🗓️"
  })[id];

const panelGlyph = (panel: CommandPanel) =>
  ({
    work: "🤝",
    events: "⚡",
    staff: "🏢",
    stations: "👥",
    research: "🧪"
  })[panel];

const projectStagesFor = (packId: string, categories: string[]) => {
  if (packId === "game-studio") {
    return ["Design", "Production", "Polish", "Testing", "Release"];
  }
  if (packId === "coffee-shop") {
    return ["Supply", "Prep", "Service", "Buzz", "Regulars"];
  }
  if (packId === "space-colony") {
    return ["Power", "Water", "Oxygen", "Habitat", "Frontier"];
  }
  if (packId === "scrapyard") {
    return ["Source", "Sort", "Process", "Build", "Deliver"];
  }
  return categories.slice(0, 5).map(categoryLabel);
};

const opportunityKicker = (packId: string, label: string) =>
  ({
    "game-studio": "New Opportunity",
    "coffee-shop": "New Order",
    "space-colony": "New Milestone",
    scrapyard: "New Contract"
  })[packId] ??
  `New ${
    label.endsWith("ies")
      ? `${label.slice(0, -3)}y`
      : label.endsWith("s")
        ? label.slice(0, -1)
        : label
  }`;

const actionCostLabel = (cash = 0, resources: ResourceBag = {}) => {
  const parts = [
    cash > 0 ? formatMoney(cash) : "",
    ...Object.entries(resources)
      .filter(([, amount]) => amount > 0)
      .map(([id, amount]) => `${formatResourceId(id)} ${Math.floor(amount)}`)
  ].filter(Boolean);
  return parts.join(" · ") || "Free";
};

const packNoun = (packId: string) =>
  ({
    "game-studio": {
      project: "Current Game",
      departments: "Departments",
      opportunities: "Opportunities",
      research: "Research",
      staff: "Staff",
      production: "Production Board",
      release: "Release Forecast",
      actions: "Studio Actions"
    },
    "coffee-shop": {
      project: "Current Rush",
      departments: "Stations",
      opportunities: "Orders",
      research: "Improvements",
      staff: "Baristas",
      production: "Service Board",
      release: "Rush Forecast",
      actions: "Shop Actions"
    },
    "space-colony": {
      project: "Current Mission",
      departments: "Systems",
      opportunities: "Milestones",
      research: "Protocols",
      staff: "Crew",
      production: "Colony Board",
      release: "Survival Forecast",
      actions: "Colony Actions"
    },
    "boutique-hotel": {
      project: "Current Stay",
      departments: "Departments",
      opportunities: "Bookings",
      research: "Improvements",
      staff: "Team",
      production: "Hotel Board",
      release: "Guest Forecast",
      actions: "Hotel Actions"
    },
    festival: {
      project: "Current Event",
      departments: "Teams",
      opportunities: "Bookings",
      research: "Upgrades",
      staff: "Crew",
      production: "Festival Board",
      release: "Crowd Forecast",
      actions: "Festival Actions"
    },
    "theme-park": {
      project: "Current Park Day",
      departments: "Areas",
      opportunities: "Guest Goals",
      research: "Improvements",
      staff: "Crew",
      production: "Park Board",
      release: "Guest Forecast",
      actions: "Park Actions"
    },
    "farm-market": {
      project: "Current Market",
      departments: "Stalls",
      opportunities: "Orders",
      research: "Improvements",
      staff: "Crew",
      production: "Market Board",
      release: "Season Forecast",
      actions: "Market Actions"
    },
    "movie-studio": {
      project: "Current Film",
      departments: "Departments",
      opportunities: "Deals",
      research: "Upgrades",
      staff: "Crew",
      production: "Studio Board",
      release: "Premiere Forecast",
      actions: "Studio Actions"
    },
    aquarium: {
      project: "Current Exhibit",
      departments: "Galleries",
      opportunities: "Programs",
      research: "Improvements",
      staff: "Team",
      production: "Aquarium Board",
      release: "Visitor Forecast",
      actions: "Aquarium Actions"
    },
    scrapyard: {
      project: "Current Job",
      departments: "Crews",
      opportunities: "Contracts",
      research: "Upgrades",
      staff: "Crew",
      production: "Production Board",
      release: "Delivery Forecast",
      actions: "Yard Actions"
    }
  })[packId] ?? {
    project: "Current Job",
    departments: "Departments",
    opportunities: "Contracts",
    research: "Upgrades",
    staff: "Staff",
    production: "Production Board",
    release: "Forecast",
    actions: "Business Actions"
  };

const packSceneMedia = (packId: string) =>
  ({
    "game-studio": {
      src: "/assets/key-art/indie-studio-room.png",
      label: "Studio Floor",
      noun: "stations"
    },
    scrapyard: {
      src: "/assets/key-art/scrapyard-yard-room.png",
      label: "Yard Floor",
      noun: "stations"
    },
    "coffee-shop": {
      src: "/assets/key-art/coffee-shop-room.png",
      label: "Cafe Floor",
      noun: "stations"
    },
    "space-colony": {
      src: "/assets/key-art/space-colony-room.png",
      label: "Colony Floor",
      noun: "systems"
    },
    "boutique-hotel": {
      src: "/assets/key-art/pack-grid-ai.png",
      label: "Hotel Floor",
      noun: "departments"
    },
    festival: {
      src: "/assets/key-art/festival-gig-to-field.png",
      label: "Festival Site",
      noun: "teams"
    },
    "theme-park": {
      src: "/assets/key-art/theme-park-gates.png",
      label: "Park Gates",
      noun: "areas"
    },
    "farm-market": {
      src: "/assets/key-art/farm-market-stall.png",
      label: "Market Field",
      noun: "stalls"
    },
    "movie-studio": {
      src: "/assets/key-art/movie-studio-set.png",
      label: "Soundstage",
      noun: "departments"
    },
    aquarium: {
      src: "/assets/key-art/aquarium-gallery.png",
      label: "Aquarium Gallery",
      noun: "galleries"
    }
  })[packId] ?? {
    src: "/assets/key-art/indie-studio-room.png",
    label: "Business Floor",
    noun: "stations"
  };

const sceneImageFor = (snapshot: GameSnapshot) =>
  snapshot.pack.theme.visual?.sceneImage ?? packSceneMedia(snapshot.pack.id).src;

const logoImageFor = (snapshot: GameSnapshot) =>
  snapshot.pack.theme.visual?.logoImage ?? sceneImageFor(snapshot);

const isCssVisual = (asset: string) => asset.startsWith("linear-gradient(") || asset.startsWith("radial-gradient(");

const visualBackgroundStyle = (asset: string) =>
  isCssVisual(asset)
    ? `background:${asset};`
    : `background-image:linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.26)), url('${asset}');`;

const sceneVisualMarkup = (asset: string, className: string, alt = "") =>
  isCssVisual(asset)
    ? `<div class="${className}" style="${visualBackgroundStyle(asset)}"></div>`
    : `<img class="${className}" src="${asset}" alt="${alt}" />`;

const stationVisual = (snapshot: GameSnapshot, building: BuildingDefinition, owned: number, progress: number) => {
  const active = owned > 0;
  const sceneImage = sceneImageFor(snapshot);
  const index = Math.max(0, snapshot.pack.buildings.findIndex((item) => item.id === building.id));
  const focusX = 18 + (index % 4) * 22;
  const focusY = 28 + (Math.floor(index / 4) % 3) * 22;
  return `
    <div class="station-visual pack-media-visual ${active ? "active" : ""}" style="--station-color:${building.color}; --focus-x:${focusX}%; --focus-y:${focusY}%;">
      ${sceneVisualMarkup(sceneImage, "station-visual-media")}
      <span class="station-media-label">${building.category}</span>
      <sl-progress-bar class="station-output-meter kit-progress" value="${Math.max(progress, active ? 10 : 0)}"></sl-progress-bar>
    </div>
  `;
};

const defaultUiTheme: NonNullable<GameTheme["ui"]> = {
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
};

export const applyUiTheme = (theme: GameTheme, target: HTMLElement = document.documentElement) => {
  const ui = theme.ui ?? {
    ...defaultUiTheme,
    accent: theme.palette.accent,
    accentStrong: theme.palette.accent,
    surface: theme.palette.panel
  };

  target.style.setProperty("--ui-bg", ui.background);
  target.style.setProperty("--ui-surface", ui.surface);
  target.style.setProperty("--ui-surface-alt", ui.surfaceAlt);
  target.style.setProperty("--ui-text", ui.text);
  target.style.setProperty("--ui-muted", ui.muted);
  target.style.setProperty("--ui-border", ui.border);
  target.style.setProperty("--ui-accent", ui.accent);
  target.style.setProperty("--ui-accent-strong", ui.accentStrong);
  target.style.setProperty("--ui-accent-soft", ui.accentSoft);
  target.style.setProperty("--ui-success", ui.success);
  target.style.setProperty("--ui-warning", ui.warning);
  target.style.setProperty("--ui-danger", ui.danger);
};

export interface HudOptions {
  onChangePack?: () => void;
}

type CommandPanel = "work" | "events" | "staff" | "stations" | "research";

export const mountHud = (root: HTMLElement, controller: GameController, options: HudOptions = {}) => {
  let activeDetail:
    | { type: "station" | "contract" | "action" | "upgrade"; id: string }
    | undefined;
  let activePanel: CommandPanel | undefined;
  let hoveringAction = false;
  let pressingAction = false;
  let pendingSnapshot: GameSnapshot | undefined;
  let flushTimer = 0;
  const actionSelector = "button[data-action], a[data-action], [role='button'][data-action]";

  const isActionTarget = (target: EventTarget | null) =>
    target instanceof Element ? target.closest<HTMLElement>(actionSelector) : null;

  const isRenderingDeferred = () => hoveringAction || pressingAction;

  const flushPendingRender = () => {
    window.clearTimeout(flushTimer);
    flushTimer = window.setTimeout(() => {
      if (isRenderingDeferred() || !pendingSnapshot) {
        return;
      }
      const snapshot = pendingSnapshot;
      pendingSnapshot = undefined;
      renderNow(snapshot);
    }, 40);
  };

  const renderNow = (snapshot: GameSnapshot) => {
    const { pack, state, message } = snapshot;
    applyUiTheme(pack.theme, document.documentElement);
    const resources = pack.resources
      .map((resource) => {
        const amount = Math.floor(state.resources[resource.id] ?? 0);
        return `
          <span class="resource-chip" title="${resource.description}">
            <span class="resource-glyph" aria-hidden="true">${resourceGlyph(resource.id)}</span>
            <span>${resource.name}: <strong>${amount}</strong></span>
          </span>
        `;
      })
      .join("");

    const assignedStaff = Object.values(state.staff.assignments).reduce(
      (total, amount) => total + amount,
      0
    );
    const activeContracts = state.activeContracts.length;
    const nouns = packNoun(pack.id);
    const currentEra = pack.eras?.find((era) => era.id === state.currentEraId);
    const activeTrend = state.activeTrends
      .map((trend) => pack.marketTrends?.find((definition) => definition.id === trend.trendId))
      .find((trend) => trend !== undefined);
    const currentPanel = activePanel ?? "work";
    const panelLabels: Record<CommandPanel, { title: string; subtitle: string }> = {
      work: { title: nouns.opportunities, subtitle: "Pick profitable work" },
      events: {
        title: "Events",
        subtitle:
          state.activeEvents.length > 0
            ? `${state.activeEvents.length} decision${state.activeEvents.length === 1 ? "" : "s"} waiting`
            : "Nothing urgent"
      },
      staff: { title: "Office", subtitle: productionRateLabel(snapshot) },
      stations: { title: nouns.departments, subtitle: `Buy ${packSceneMedia(pack.id).noun} to open output paths` },
      research: { title: nouns.research, subtitle: "Unlock scale" }
    };
    const availableContracts = controller.availableContracts();
    const availableProjects = controller.availableProjects();
    const activeProject = state.activeProject;
    const activeProjectDefinition = activeProject
      ? availableProjects.find((project) => project.id === activeProject.projectId)
      : undefined;
    const activeProjectPhase = activeProjectDefinition?.phases[activeProject?.phaseIndex ?? 0];
    const activeProjectReady =
      activeProject !== undefined &&
      activeProjectPhase !== undefined &&
      activeProject.phaseProgressMs >= activeProjectPhase.durationMs;
    const activeProjectDone =
      activeProject !== undefined &&
      activeProjectDefinition !== undefined &&
      activeProject.phaseIndex >= activeProjectDefinition.phases.length - 1 &&
      activeProjectReady;
    const focusContract =
      state.activeContracts
        .map((contractId) => pack.contracts.find((contract) => contract.id === contractId))
        .find((contract) => contract !== undefined) ?? availableContracts[0];
    const projectProgress = focusContract
      ? completionPercent(state.resources, focusContract.requires)
      : Math.min(100, state.completedContracts.length * 18);
    const forecastLabel =
      projectProgress >= 100
        ? "Ready"
        : projectProgress >= 62
          ? "Promising"
          : projectProgress >= 28
            ? "Building"
            : "Early";
    const monthlyBurn = Math.max(0, staffWagePerSecond(state) * 60);
    const sceneMedia = packSceneMedia(pack.id);
    const forecastDots = Array.from({ length: 14 }, (_, index) =>
      index < Math.round(projectProgress / 8)
        ? `<span class="filled"></span>`
        : `<span></span>`
    ).join("");
    const riskItems = [
      state.staff.unassigned > 0 ? "Idle staff available" : "No idle staff",
      state.cash < workerHireCost(state) ? "Hiring cash is tight" : "Hiring runway stable",
      activeContracts === 0 ? "No job pinned" : "Job pinned",
      state.activeEvents.length > 0 ? `${state.activeEvents.length} active event${state.activeEvents.length === 1 ? "" : "s"}` : "No active events"
    ];
    const projectStages =
      activeProjectDefinition?.phases.map((phase) => phase.name) ??
      projectStagesFor(pack.id, categoryList(pack.buildings));
    const projectStageSteps = projectStages
      .map(
        (stage, index) => `
          <span class="project-stage ${index === (activeProject?.phaseIndex ?? 0) ? "active" : ""}">
            <span class="stage-dot">${index + 1}</span>
            <strong>${stage}</strong>
          </span>
        `
      )
      .join("");
    const projectStats =
      pack.id === "game-studio"
        ? [
            ["Genre", "Not set"],
            ["Budget", activeProject ? formatMoney(activeProject.risk * 10) : formatMoney(0)],
            ["Target Platform", "PC"],
            ["Team Size", String(state.staff.totalHired)],
            ["Quality", String(Math.floor(activeProject?.quality ?? 0))]
          ]
        : pack.id === "coffee-shop"
          ? [
              ["Menu Focus", "Not set"],
              ["Daily Budget", formatMoney(0)],
              ["Service Style", "Counter"],
              ["Team Size", String(state.staff.totalHired)],
              ["Days Open", String(Math.floor(state.elapsedMs / 86_400_000))]
            ]
          : pack.id === "space-colony"
            ? [
                ["Biome", "Unsurveyed"],
                ["Supply Budget", formatMoney(0)],
                ["Habitat Type", "Starter"],
                ["Crew Size", String(state.staff.totalHired)],
                ["Sols Active", String(Math.floor(state.elapsedMs / 86_400_000))]
              ]
            : [
                ["Contract Type", "Local"],
                ["Budget", formatMoney(0)],
                ["Yard Size", `${state.grid.width} x ${state.grid.height}`],
                ["Crew Size", String(state.staff.totalHired)],
                ["Days Active", String(Math.floor(state.elapsedMs / 86_400_000))]
              ];
    const projectStatsMarkup = projectStats
      .map(
        ([label, value]) => `
          <div>
            <span>${label}</span>
            <strong>${value}</strong>
          </div>
        `
      )
      .join("");
    const focusReward = focusContract
      ? `
        <div class="opportunity-rewards">
          <span>Reward</span>
          <strong><span aria-hidden="true">💵</span> ${formatMoney(focusContract.rewardCash)}</strong>
          ${
            focusContract.unlockIds.length > 0
              ? `<strong><span aria-hidden="true">⭐</span> ${focusContract.unlockIds.length} unlock${focusContract.unlockIds.length === 1 ? "" : "s"}</strong>`
              : ""
          }
        </div>
      `
      : "";
    const actionCards = controller
      .availableActions()
      .map((action) => {
        const cooldown = state.actionCooldowns[action.id] ?? 0;
        const boost = state.activeBoosts.find((item) => item.actionId === action.id);
        const affordable =
          state.cash >= (action.costCash ?? 0) && canAffordBag(state.resources, action.costResources ?? {});
        const disabled = cooldown > 0 || !affordable;
        const status =
          cooldown > 0
            ? `Cooldown ${formatSeconds(cooldown)}`
            : boost
              ? `Boosting ${categoryLabel(boost.category)} ${formatSeconds(boost.remainingMs)}`
              : "Ready";
        return `
          <article class="management-card action-card ${boost ? "active" : ""}">
            <span class="icon-badge action-badge" aria-hidden="true"></span>
            <div class="card-copy">
              <div class="card-title-row">
                <strong>${action.name}</strong>
                <sl-badge class="mini-pill kit-badge" pill>${actionCostLabel(action.costCash, action.costResources)}</sl-badge>
              </div>
              <em>${status}</em>
            </div>
            <div class="card-actions">
              <button class="sub-action" data-action="open-detail" data-kind="action" data-id="${action.id}">Details</button>
              <button class="row-action" data-action="run-action" data-id="${action.id}" ${disabled ? "disabled" : ""}>Run</button>
            </div>
          </article>
        `;
      })
      .join("");

    const projectCards = availableProjects
      .map((project) => {
        const isActive = activeProject?.projectId === project.id;
        const disabled = activeProject !== undefined || state.cash < (project.costCash ?? 0);
        return `
          <article class="management-card project-management-card ${isActive ? "active" : ""}">
            <div class="card-copy">
              <div class="card-title-row">
                <strong>${isActive ? activeProject.name : project.name}</strong>
                <sl-badge class="mini-pill kit-badge" pill>${formatMoney(project.rewardCash ?? 0)} upside</sl-badge>
              </div>
              <em>${isActive ? `Phase ${activeProject.phaseIndex + 1}/${project.phases.length} · Quality ${Math.floor(activeProject.quality)}` : project.description}</em>
              ${
                isActive && activeProjectPhase
                  ? `<sl-progress-bar class="progress-track kit-progress" value="${Math.min(100, Math.round((activeProject.phaseProgressMs / activeProjectPhase.durationMs) * 100))}" aria-label="Project phase progress"></sl-progress-bar>`
                  : ""
              }
            </div>
            <div class="card-actions">
              ${
                isActive
                  ? `
                    <button class="sub-action" data-action="cancel-project">Cancel</button>
                    ${
                      activeProjectDone
                        ? `<button class="row-action" data-action="release-project">Release</button>`
                        : `<button class="row-action" data-action="advance-project" ${activeProjectReady ? "" : "disabled"}>${activeProjectReady ? "Next Phase" : "Working"}</button>`
                    }
                  `
                  : `<button class="row-action" data-action="start-project" data-id="${project.id}" ${disabled ? "disabled" : ""}>Start</button>`
              }
            </div>
          </article>
        `;
      })
      .join("");

    const eventCards = controller
      .activeEvents()
      .map(
        (event) => `
          <article class="management-card event-card">
            <div class="card-copy">
              <div class="card-title-row">
                <strong>${event.name}</strong>
                <sl-badge class="mini-pill kit-badge" pill>Event</sl-badge>
              </div>
              <em>${event.description}</em>
            </div>
            <div class="card-actions">
              ${event.choices
                .map(
                  (choice) =>
                    `<button class="row-action" data-action="resolve-event" data-id="${event.id}" data-choice="${choice.id}">${choice.label}</button>`
                )
                .join("")}
            </div>
          </article>
        `
      )
      .join("");

    const eventDeckCards = (pack.eventDecks ?? [])
      .map((deck) => {
        const deckState = state.eventDecks[deck.id];
        const nextDraw = deckState ? Math.max(0, deckState.nextDrawMs - state.elapsedMs) : deck.intervalMs;
        return `
          <article class="management-card event-deck-card">
            <div class="card-copy">
              <div class="card-title-row">
                <strong>${deck.name}</strong>
                <sl-badge class="mini-pill kit-badge" pill>${deckState?.draws ?? 0} seen</sl-badge>
              </div>
              <em>${deck.description}</em>
              <small>Next check in ${formatSeconds(nextDraw)} · ${deck.eventIds.length} possible outcomes</small>
            </div>
          </article>
        `;
      })
      .join("");

    const stationCards = controller
      .availableBuildings()
      .map((building) => {
        const owned = state.buildings.filter((placed) => placed.buildingId === building.id).length;
        const purchaseCost = buildingPurchaseCost(state, building);
        const disabled = state.cash < purchaseCost;
        const progress = progressPercent(snapshot, building);
        return `
          <article class="management-card station-card pipeline-row ${owned > 0 ? "online" : ""}">
            ${stationVisual(snapshot, building, owned, progress)}
            <span class="icon-badge station-badge" style="--badge-color:${building.color}" aria-hidden="true"></span>
            <div class="card-copy">
              <div class="card-title-row">
                <strong>${building.name}</strong>
                <sl-badge class="mini-pill kit-badge" pill>Owned ${owned}</sl-badge>
              </div>
              <em>${categoryLabel(building.category)} lane</em>
              <sl-progress-bar class="progress-track kit-progress" value="${progress}" aria-label="Station production progress"></sl-progress-bar>
            </div>
            <div class="card-actions">
              <button class="sub-action" data-action="open-detail" data-kind="station" data-id="${building.id}">Details</button>
              <button class="row-action" data-action="buy-station" data-id="${building.id}" ${disabled ? "disabled" : ""}>Buy ${formatMoney(purchaseCost)}</button>
            </div>
          </article>
        `;
      })
      .join("");

    const departmentRows = countByCategory(pack.buildings, snapshot)
      .filter((row) => row.stationCount > 0 || row.workers > 0)
      .map(
        (row) => `
          <article class="department-row staff-row">
            <span class="icon-badge small-badge" aria-hidden="true"></span>
            <div>
              <strong>${categoryLabel(row.category)}</strong>
              <small>${row.stationCount} station${row.stationCount === 1 ? "" : "s"} · +${row.workers * 25}% speed</small>
            </div>
            <div class="staff-controls">
              <button data-action="unassign-worker" data-id="${row.category}" ${row.workers <= 0 ? "disabled" : ""}>-</button>
              <span>${row.workers}</span>
              <button data-action="assign-worker" data-id="${row.category}" ${state.staff.unassigned <= 0 ? "disabled" : ""}>+</button>
            </div>
          </article>
        `
      )
      .join("");

    const candidateCards = controller
      .staffCandidates()
      .slice(0, 3)
      .map(
        (candidate) => `
          <article class="department-row staff-row">
            <span class="icon-badge small-badge" aria-hidden="true"></span>
            <div>
              <strong>${candidate.name}</strong>
              <small>Level ${candidate.level} · ${candidate.traits.join(", ")}</small>
            </div>
            <button data-action="hire-candidate" data-id="${candidate.id}" ${state.cash < candidate.hireCost ? "disabled" : ""}>Hire ${formatMoney(candidate.hireCost)}</button>
          </article>
        `
      )
      .join("");

    const contractCards = controller
      .availableContracts()
      .map((contract) => {
        const active = state.activeContracts.includes(contract.id);
        const completed = state.completedContracts.includes(contract.id) && !contract.repeatable;
        const ready = active && canAffordBag(state.resources, contract.requires);
        return `
          <article class="management-card contract opportunity-card ${completed ? "done" : ""}" data-testid="contract-card">
            <span class="icon-badge contract-badge" aria-hidden="true"></span>
            <div class="card-copy">
              <div class="card-title-row">
                <strong>${contract.name}</strong>
                <sl-badge class="reward-pill kit-badge" pill>${formatMoney(contract.rewardCash)}</sl-badge>
              </div>
              <em>${active ? "Pinned job" : "Available job"} · Needs ${formatBag(contract.requires) || "nothing"}</em>
            </div>
            <div class="card-actions">
              <button class="sub-action" data-action="open-detail" data-kind="contract" data-id="${contract.id}">Details</button>
              ${
                completed
                  ? `<sl-badge class="status-pill kit-badge" variant="success" pill>Delivered</sl-badge>`
                  : active
                    ? `<button class="row-action" data-action="claim-contract" data-id="${contract.id}" ${ready ? "" : "disabled"}>${ready ? "Deliver" : "Producing"}</button>`
                    : `<button class="row-action" data-action="start-contract" data-id="${contract.id}">Accept</button>`
              }
            </div>
          </article>
        `;
      })
      .join("");

    const upgradeCards = controller
      .availableUpgrades()
      .map((upgrade) => {
        const bought = state.purchasedUpgrades.includes(upgrade.id);
        return `
          <article class="management-card upgrade research-card ${bought ? "done" : ""}">
            <span class="icon-badge upgrade-badge" aria-hidden="true"></span>
            <div class="card-copy">
              <div class="card-title-row">
                <strong>${upgrade.name}</strong>
                <sl-badge class="mini-pill kit-badge" pill>${formatMoney(upgrade.cost)}</sl-badge>
              </div>
              <em>${bought ? "Installed" : "Ready to research"}</em>
            </div>
            <div class="card-actions">
              <button class="sub-action" data-action="open-detail" data-kind="upgrade" data-id="${upgrade.id}">Details</button>
              ${
                bought
                  ? `<sl-badge class="status-pill kit-badge" variant="success" pill>Installed</sl-badge>`
                  : `<button class="row-action" data-action="buy-upgrade" data-id="${upgrade.id}" ${state.cash < upgrade.cost ? "disabled" : ""}>Research</button>`
              }
            </div>
          </article>
        `;
      })
      .join("");

    const eraCards = (pack.eras ?? [])
      .map((era) => {
        const reached = state.reachedEraIds.includes(era.id);
        const active = state.currentEraId === era.id;
        return `
          <article class="management-card research-card ${reached ? "done" : ""}">
            <span class="icon-badge upgrade-badge" aria-hidden="true"></span>
            <div class="card-copy">
              <div class="card-title-row">
                <strong>${era.name}</strong>
                <sl-badge class="mini-pill kit-badge" pill>${active ? "Current" : reached ? "Reached" : "Locked"}</sl-badge>
              </div>
              <em>${era.description}</em>
            </div>
          </article>
        `;
      })
      .join("");

    const trendCards = (pack.marketTrends ?? [])
      .slice(0, 8)
      .map((trend) => {
        const active = state.activeTrends.some((item) => item.trendId === trend.id);
        const seen = state.resolvedTrends.includes(trend.id);
        return `
          <article class="management-card research-card ${active ? "active" : seen ? "done" : ""}">
            <span class="icon-badge upgrade-badge" aria-hidden="true"></span>
            <div class="card-copy">
              <div class="card-title-row">
                <strong>${trend.name}</strong>
                <sl-badge class="mini-pill kit-badge" pill>${active ? "Active" : seen ? "Passed" : formatSeconds(trend.startsAtMs)}</sl-badge>
              </div>
              <em>${trend.description}</em>
            </div>
          </article>
        `;
      })
      .join("");

    const sceneImage = sceneImageFor(snapshot);
    const logoImage = logoImageFor(snapshot);
    const focusContractActive = focusContract ? state.activeContracts.includes(focusContract.id) : false;
    const focusContractCompleted = focusContract
      ? state.completedContracts.includes(focusContract.id) && !focusContract.repeatable
      : false;
    const focusContractReady =
      focusContract !== undefined && focusContractActive && canAffordBag(state.resources, focusContract.requires);
    const focusContractAction = focusContract
      ? focusContractCompleted
        ? `<sl-badge class="status-pill kit-badge" variant="success" pill>Delivered</sl-badge>`
        : focusContractActive
          ? `<button data-action="claim-contract" data-id="${focusContract.id}" ${focusContractReady ? "" : "disabled"}>${focusContractReady ? "Deliver" : "Producing"}</button>`
          : `<button data-action="start-contract" data-id="${focusContract.id}">Accept</button>`
      : "";
    const drawerContent = (() => {
      if (currentPanel === "staff") {
        return `
          <div class="drawer-kpis command-kpis">
            <article>
              <span>Cash</span>
              <strong>${formatMoney(state.cash)}</strong>
            </article>
            <article>
              <span>Payroll</span>
              <strong>${formatMoney(monthlyBurn)}/min</strong>
            </article>
            <article>
              <span>Idle</span>
              <strong>${state.staff.unassigned}</strong>
            </article>
            <article>
              <span>Done</span>
              <strong>${state.completedContracts.length}</strong>
            </article>
          </div>
          <div class="drawer-section-header">
            <span>${nouns.departments}</span>
            <button data-action="hire-worker" ${state.cash < workerHireCost(state) ? "disabled" : ""}>Hire ${formatMoney(workerHireCost(state))}</button>
          </div>
          <div class="department-list staff-stack command-list">
            ${departmentRows || `<p class="empty">Buy a station to open its department.</p>`}
          </div>
          <div class="drawer-section-header">
            <span>Candidates</span>
            <strong>Named hires</strong>
          </div>
          <div class="department-list staff-stack command-list">
            ${candidateCards || `<p class="empty">No candidates waiting.</p>`}
          </div>
        `;
      }

      if (currentPanel === "stations") {
        return `
          <div class="drawer-section-header">
            <span>${nouns.departments}</span>
            <strong>Owned ${state.buildings.length}</strong>
          </div>
          <div class="management-stack station-stack pipeline-stack command-list command-grid">${stationCards}</div>
        `;
      }

      if (currentPanel === "events") {
        return `
          <section class="drawer-section">
            <div class="drawer-section-header">
              <span>Active Events</span>
              <strong>${state.activeEvents.length} open</strong>
            </div>
            <div class="management-stack event-stack command-list">
              ${eventCards || `<p class="empty">No urgent events right now. Keep building and new situations will appear as the world changes.</p>`}
            </div>
          </section>
          <section class="drawer-section">
            <div class="drawer-section-header">
              <span>Event Decks</span>
              <strong>${pack.eventDecks?.length ?? 0} systems</strong>
            </div>
            <div class="management-stack event-stack command-list">
              ${eventDeckCards || `<p class="empty">This pack has no event decks configured yet.</p>`}
            </div>
          </section>
        `;
      }

      if (currentPanel === "research") {
        return `
          <div class="drawer-section-header">
            <span>Eras</span>
            <strong>${state.reachedEraIds.length}/${pack.eras?.length ?? 1} reached</strong>
          </div>
          <div class="management-stack research-stack command-list">
            ${eraCards || `<p class="empty">No era ladder configured.</p>`}
          </div>
          <div class="drawer-section-header">
            <span>Market Trends</span>
            <strong>${state.activeTrends.length} active</strong>
          </div>
          <div class="management-stack research-stack command-list">
            ${trendCards || `<p class="empty">No market trends configured.</p>`}
          </div>
          <div class="drawer-section-header">
            <span>${nouns.research}</span>
            <strong>${state.purchasedUpgrades.length} installed</strong>
          </div>
          <div class="management-stack research-stack command-list">
            ${upgradeCards || `<p class="empty">Complete contracts to unlock research.</p>`}
          </div>
        `;
      }

      return `
        <section class="drawer-section">
          <div class="drawer-section-header">
            <span>${nouns.project}</span>
            <strong>${activeProject ? "In development" : "Ready"}</strong>
          </div>
          <div class="management-stack command-list">${projectCards}</div>
        </section>
        <section class="drawer-section">
          <div class="drawer-section-header">
            <span>${nouns.opportunities}</span>
            <strong>${activeContracts} active</strong>
          </div>
          <div class="management-stack contract-stack command-list">${visibleContractCards(contractCards)}</div>
        </section>
        <section class="drawer-section">
          <div class="drawer-section-header">
            <span>${nouns.actions}</span>
            <strong>Spend, boost, repeat</strong>
          </div>
          <div class="management-stack action-stack command-list">
            ${actionCards || `<p class="empty">Complete work to unlock actions.</p>`}
          </div>
        </section>
      `;
    })();

    const detailModal = (() => {
      if (!activeDetail) {
        return "";
      }

      if (activeDetail.type === "station") {
        const building = pack.buildings.find((item) => item.id === activeDetail?.id);
        if (!building) {
          return "";
        }
        const owned = state.buildings.filter((placed) => placed.buildingId === building.id).length;
        const progress = progressPercent(snapshot, building);
        const purchaseCost = buildingPurchaseCost(state, building);
        const disabled = state.cash < purchaseCost;
        return `
          <dialog class="detail-modal" open>
            <form method="dialog" class="detail-panel">
              <button class="modal-close" data-action="close-detail" aria-label="Close">Close</button>
              <div class="detail-hero">
                ${stationVisual(snapshot, building, owned, progress)}
                <div>
                  <span class="screen-kicker">${categoryLabel(building.category)} station</span>
                  <h2>${building.name}</h2>
                  <p>${building.description}</p>
                </div>
              </div>
              ${recipeSummary(snapshot, building)}
              <div class="modal-actions">
                <button data-action="buy-station" data-id="${building.id}" ${disabled ? "disabled" : ""}>Buy ${formatMoney(purchaseCost)}</button>
              </div>
            </form>
          </dialog>
        `;
      }

      if (activeDetail.type === "contract") {
        const contract = pack.contracts.find((item) => item.id === activeDetail?.id);
        if (!contract) {
          return "";
        }
        const active = state.activeContracts.includes(contract.id);
        const completed = state.completedContracts.includes(contract.id) && !contract.repeatable;
        const ready = active && canAffordBag(state.resources, contract.requires);
        return `
          <dialog class="detail-modal" open>
            <form method="dialog" class="detail-panel">
              <button class="modal-close" data-action="close-detail" aria-label="Close">Close</button>
              <span class="screen-kicker">${nouns.opportunities}</span>
              <h2>${contract.name}</h2>
              <p>${contract.description}</p>
              <div class="contract-needs">
                <span>Needs</span>
                ${bagChips(contract.requires, "bag-chips compact")}
              </div>
              <div class="modal-actions">
                <strong>Pays ${formatMoney(contract.rewardCash)}</strong>
                ${
                  completed
                    ? `<sl-badge class="status-pill kit-badge" variant="success" pill>Delivered</sl-badge>`
                    : active
                      ? `<button data-action="claim-contract" data-id="${contract.id}" ${ready ? "" : "disabled"}>${ready ? "Deliver" : "Producing"}</button>`
                      : `<button data-action="start-contract" data-id="${contract.id}">Accept</button>`
                }
              </div>
            </form>
          </dialog>
        `;
      }

      if (activeDetail.type === "action") {
        const action = pack.actions?.find((item) => item.id === activeDetail?.id);
        if (!action) {
          return "";
        }
        const cooldown = state.actionCooldowns[action.id] ?? 0;
        const disabled =
          cooldown > 0 ||
          state.cash < (action.costCash ?? 0) ||
          !canAffordBag(state.resources, action.costResources ?? {});
        return `
          <dialog class="detail-modal" open>
            <form method="dialog" class="detail-panel">
              <button class="modal-close" data-action="close-detail" aria-label="Close">Close</button>
              <span class="screen-kicker">${nouns.actions}</span>
              <h2>${action.name}</h2>
              <p>${action.description}</p>
              <div class="modal-actions">
                <strong>${actionCostLabel(action.costCash, action.costResources)}</strong>
                <button data-action="run-action" data-id="${action.id}" ${disabled ? "disabled" : ""}>Run</button>
              </div>
            </form>
          </dialog>
        `;
      }

      const upgrade = pack.upgrades.find((item) => item.id === activeDetail?.id);
      if (!upgrade) {
        return "";
      }
      const bought = state.purchasedUpgrades.includes(upgrade.id);
      return `
        <dialog class="detail-modal" open>
          <form method="dialog" class="detail-panel">
            <button class="modal-close" data-action="close-detail" aria-label="Close">Close</button>
            <span class="screen-kicker">${nouns.research}</span>
            <h2>${upgrade.name}</h2>
            <p>${upgrade.description}</p>
            <div class="modal-actions">
              <strong>${formatMoney(upgrade.cost)}</strong>
              ${
                bought
                  ? `<sl-badge class="status-pill kit-badge" variant="success" pill>Installed</sl-badge>`
                  : `<button data-action="buy-upgrade" data-id="${upgrade.id}" ${state.cash < upgrade.cost ? "disabled" : ""}>Research</button>`
              }
            </div>
          </form>
        </dialog>
      `;
    })();

    root.innerHTML = `
      <div class="command-screen play-screen" data-pack="${pack.id}" style="--scene-image:url('${sceneImage}')">
        <header class="top-bar management-top command-header game-header">
          <div class="brand-cluster">
            <span class="brand-mark logo-shape-${state.profile.logoShape ?? "squircle"} logo-pattern-${state.profile.logoPattern ?? "shine"}" style="--logo-color:${state.profile.logoColor}">
              ${sceneVisualMarkup(logoImage, "brand-mark-visual")}
            </span>
            <div>
              <span class="screen-kicker">${pack.theme.title} · ${state.profile.difficulty}</span>
              <h1>${state.profile.companyName}</h1>
              <p>Founded by ${state.profile.founderName} · ${pack.theme.subtitle}</p>
            </div>
          </div>
          <div class="command-strip" aria-label="Business status">
            <article>
              <span><span class="stat-glyph" aria-hidden="true">${statGlyph("cash")}</span>Cash</span>
              <strong data-testid="cash">${formatMoney(state.cash)}</strong>
            </article>
            <article>
              <span><span class="stat-glyph" aria-hidden="true">${statGlyph("staff")}</span>${nouns.staff}</span>
              <strong>${assignedStaff}/${state.staff.totalHired}</strong>
            </article>
            <article>
              <span><span class="stat-glyph" aria-hidden="true">${statGlyph("jobs")}</span>Jobs</span>
              <strong>${activeContracts}</strong>
            </article>
            <article>
              <span><span class="stat-glyph" aria-hidden="true">${statGlyph("forecast")}</span>${nouns.release}</span>
              <strong>${forecastLabel}</strong>
            </article>
          </div>
          <div class="top-actions">
            <button data-action="change-pack">Games</button>
          </div>
        </header>

        <section class="resource-bar resource-dock" aria-label="Inventory">
          ${resources}
        </section>

        <main class="management-shell command-layout game-layout scene-command-layout ${activePanel ? "drawer-open" : "drawer-closed"}" aria-label="Production command board">
          <section class="game-stage-panel scene-stage">
            <div class="world-stage" aria-label="${pack.theme.title} room">
              ${sceneVisualMarkup(sceneImage, "world-stage-image")}
              <div class="world-stage-glass"></div>
              <div class="scene-title-card">
                <div class="project-card-head">
                  <span class="screen-kicker">${nouns.production}</span>
                  <h2>${activeProject?.name ?? nouns.project} <span aria-hidden="true">✎</span></h2>
                  <p>${activeProjectPhase ? `${activeProjectPhase.name} phase · Quality ${Math.floor(activeProject?.quality ?? 0)} · Risk ${Math.floor(activeProject?.risk ?? 0)}` : pack.theme.subtitle}</p>
                </div>
                <div class="project-stages">${projectStageSteps}</div>
                <div class="project-stats">
                  <span>Project Stats</span>
                  ${projectStatsMarkup}
                </div>
              </div>
              <article class="active-job-card">
                <span>${focusContract ? opportunityKicker(pack.id, nouns.opportunities) : nouns.opportunities}</span>
                <strong>${focusContract ? focusContract.name : "Pick Work"}</strong>
                <small>${focusContract?.description ?? "Choose a job, build stations, and turn output into cash."}</small>
                <div class="active-job-needs">
                  ${focusContract ? bagChips(focusContract.requires, "bag-chips compact") : `<span class="bag-chip muted">No target selected</span>`}
                </div>
                ${focusReward}
                ${focusContractAction}
              </article>
            </div>

            <div class="quick-readout">
              <article>
                <span>Forecast</span>
                <strong>${forecastLabel}</strong>
                <div class="forecast-dots">${forecastDots}</div>
              </article>
              <article>
                <span>Target Output</span>
                ${focusContract ? bagChips(focusContract.requires, "bag-chips compact") : `<strong>No target selected</strong>`}
                <small>${focusContract?.name ?? pack.theme.title}</small>
              </article>
              <article>
                <span>Signals</span>
                ${riskItems.map((item) => `<small>${item}</small>`).join("")}
              </article>
              <article>
                <span>World State</span>
                <strong>${currentEra?.name ?? "Starter"}</strong>
                <small>${activeTrend?.name ?? "No active trend"}</small>
              </article>
            </div>
          </section>

          ${
            activePanel
              ? `<aside class="command-drawer" data-panel="${currentPanel}">
            <header class="drawer-heading">
              <div>
                <span class="screen-kicker">Command drawer</span>
                <h2>${panelLabels[currentPanel].title}</h2>
                <p>${panelLabels[currentPanel].subtitle}</p>
              </div>
              <button class="drawer-close" data-action="close-panel">Close</button>
            </header>
            <div class="drawer-body">
              ${drawerContent}
            </div>
          </aside>`
              : ""
          }
        </main>

        <footer class="command-dock ${activePanel ? "drawer-open" : "drawer-closed"}" aria-label="Primary game actions">
          <nav class="dock-nav" aria-label="Command panels">
            ${(["work", "events", "staff", "stations", "research"] as const)
              .map(
                (panel) => `
                  <button class="dock-button ${activePanel === panel ? "active" : ""}" data-action="open-panel" data-id="${panel}" title="${panelLabels[panel].title}: ${panelLabels[panel].subtitle}" aria-label="${panelLabels[panel].title}: ${panelLabels[panel].subtitle}">
                    <span class="dock-icon" aria-hidden="true">${panelGlyph(panel)}</span>
                    <span>${panelLabels[panel].title}</span>
                  </button>
                `
              )
              .join("")}
          </nav>
          <div class="dock-message">
            <span data-testid="message">${message}</span>
          </div>
          <div class="dock-actions">
            <button data-action="change-pack">Games</button>
            <button data-action="save">Save</button>
            <button data-action="reset">Reset</button>
          </div>
        </footer>

        ${detailModal}
      </div>
    `;
  };

  const render = (snapshot: GameSnapshot) => {
    if (isRenderingDeferred()) {
      pendingSnapshot = snapshot;
      return;
    }
    renderNow(snapshot);
  };

  root.addEventListener(
    "pointerover",
    (event) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      const action = isActionTarget(event.target);
      if (!action || action.contains(event.relatedTarget as Node | null)) {
        return;
      }
      hoveringAction = true;
    },
    true
  );

  root.addEventListener(
    "pointerout",
    (event) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      const action = isActionTarget(event.target);
      if (!action || action.contains(event.relatedTarget as Node | null)) {
        return;
      }
      hoveringAction = false;
      flushPendingRender();
    },
    true
  );

  root.addEventListener(
    "pointerdown",
    (event) => {
      if (isActionTarget(event.target)) {
        pressingAction = true;
      }
    },
    true
  );

  root.addEventListener(
    "pointerup",
    () => {
      pressingAction = false;
      flushPendingRender();
    },
    true
  );

  root.addEventListener(
    "pointercancel",
    () => {
      pressingAction = false;
      flushPendingRender();
    },
    true
  );

  root.addEventListener("click", (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (!target) {
      return;
    }
    hoveringAction = false;
    pressingAction = false;
    pendingSnapshot = undefined;
    const action = target.dataset.action;
    const id = target.dataset.id ?? "";
    if (action === "open-detail") {
      const kind = target.dataset.kind;
      if (kind === "station" || kind === "contract" || kind === "action" || kind === "upgrade") {
        activeDetail = { type: kind, id };
        renderNow(controller.getSnapshot());
      }
      return;
    }
    if (action === "close-detail") {
      activeDetail = undefined;
      renderNow(controller.getSnapshot());
      return;
    }
    if (action === "open-panel") {
      if (id === "work" || id === "events" || id === "staff" || id === "stations" || id === "research") {
        activePanel = id;
        renderNow(controller.getSnapshot());
      }
      return;
    }
    if (action === "close-panel") {
      activePanel = undefined;
      renderNow(controller.getSnapshot());
      return;
    }
    if (action === "buy-station") {
      controller.buyStation(id);
    }
    if (action === "start-contract") {
      controller.dispatch({ type: "startContract", contractId: id });
    }
    if (action === "claim-contract") {
      controller.dispatch({ type: "claimContract", contractId: id });
    }
    if (action === "buy-upgrade") {
      controller.dispatch({ type: "buyUpgrade", upgradeId: id });
    }
    if (action === "run-action") {
      controller.dispatch({ type: "runAction", actionId: id });
    }
    if (action === "start-project") {
      controller.dispatch({ type: "startProject", projectId: id });
    }
    if (action === "advance-project") {
      controller.dispatch({ type: "advanceProjectPhase" });
    }
    if (action === "release-project") {
      controller.dispatch({ type: "releaseProject" });
    }
    if (action === "cancel-project") {
      controller.dispatch({ type: "cancelProject" });
    }
    if (action === "resolve-event") {
      controller.dispatch({
        type: "resolveEvent",
        eventId: id,
        choiceId: target.dataset.choice ?? ""
      });
    }
    if (action === "hire-worker") {
      controller.dispatch({ type: "hireWorker" });
    }
    if (action === "hire-candidate") {
      controller.dispatch({ type: "hireCandidate", candidateId: id });
    }
    if (action === "assign-worker") {
      controller.dispatch({ type: "assignWorker", category: id, delta: 1 });
    }
    if (action === "unassign-worker") {
      controller.dispatch({ type: "assignWorker", category: id, delta: -1 });
    }
    if (action === "save") {
      controller.saveNow();
    }
    if (action === "reset") {
      controller.reset();
    }
    if (action === "change-pack") {
      options.onChangePack?.();
    }
  });

  return controller.subscribe(render);
};
