import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

const startPack = async (
  page: import("@playwright/test").Page,
  packId: string,
  companyName?: string
) => {
  await page.locator(`[data-action=choose-pack][data-id=${packId}]`).click();
  await expect(page.getByText(/Found your company/i)).toBeVisible();
  if (companyName) {
    await page.getByLabel("Company name").fill(companyName);
  }
  await page.getByRole("button", { name: /start company/i }).click();
};

test("lets the player choose a game pack", async ({ page }) => {
  await expect(page).toHaveTitle("PackForge Tycoon");
  await expect(page.getByRole("heading", { name: "PackForge Tycoon" })).toBeVisible();
  await expect(page.getByText("Indie Studio Tycoon")).toBeVisible();
  await expect(page.getByText("Scrapyard Tycoon")).toBeVisible();
  await expect(page.getByText("Coffee Shop Tycoon")).toBeVisible();
  await expect(page.getByText("Space Colony Tycoon")).toBeVisible();
  await expect(page.getByText("Boutique Hotel Tycoon")).toBeVisible();
  await expect(page.getByText("Festival Tycoon")).toBeVisible();
  await expect(page.getByText("Theme Park Tycoon")).toBeVisible();
  await expect(page.getByText("Farm Market Tycoon")).toBeVisible();
  await expect(page.getByText("Movie Studio Tycoon")).toBeVisible();
  await expect(page.getByText("Aquarium Tycoon")).toBeVisible();
  await expect(page.getByRole("heading", { name: /From back-room gig to field festival/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /From quiet townhouse to city favorite/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /game builder/i })).toBeDisabled();
  await expect(page.getByRole("link", { name: /download sdk/i })).toHaveAttribute(
    "href",
    "/downloads/packforge-sdk-0.1.0.tar.gz"
  );

  await startPack(page, "game-studio", "Moonshot Works");

  await expect(page).toHaveTitle("Moonshot Works - Indie Studio Tycoon | PackForge Tycoon");
  await expect(page.getByRole("heading", { name: "Moonshot Works" })).toBeVisible();
  await expect(page.getByText(/Indie Studio Tycoon · standard/i)).toBeVisible();
  await expect(page.locator(".active-job-card").getByText("First Client Pitch")).toBeVisible();
});

test("keeps the expanded start catalogue scrollable", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "PackForge Tycoon" })).toBeVisible();
  const metrics = await page.locator(".pack-select-screen").evaluate((screen) => {
    const overflowY = window.getComputedStyle(screen).overflowY;
    screen.scrollTop = 0;
    const before = screen.scrollTop;
    screen.scrollTop = screen.scrollHeight;
    return {
      overflowY,
      scrollHeight: screen.scrollHeight,
      clientHeight: screen.clientHeight,
      canScroll: screen.scrollTop > before
    };
  });
  expect(["auto", "scroll"]).toContain(metrics.overflowY);
  expect(metrics.scrollHeight).toBeGreaterThanOrEqual(metrics.clientHeight);
  if (metrics.scrollHeight > metrics.clientHeight) {
    expect(metrics.canScroll).toBe(true);
  }
  await expect(page.locator("[data-action=choose-pack][data-id=festival]")).toBeVisible();
});

test("launches the newly added game packs", async ({ page }) => {
  await startPack(page, "coffee-shop", "Steam Room Cafe");
  await expect(page.getByRole("heading", { name: "Steam Room Cafe" })).toBeVisible();
  await expect(page.getByText(/Coffee Shop Tycoon/)).toBeVisible();
  await expect(page.locator(".active-job-card").getByText("First Morning Queue")).toBeVisible();

  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await startPack(page, "space-colony", "Echo Ridge Colony");
  await expect(page.getByRole("heading", { name: "Echo Ridge Colony" })).toBeVisible();
  await expect(page.getByText(/Space Colony Tycoon/)).toBeVisible();
  await expect(page.locator(".active-job-card").getByText("Water Reserve")).toBeVisible();

  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await startPack(page, "boutique-hotel", "Juniper Key Hotel");
  await expect(page.getByRole("heading", { name: "Juniper Key Hotel" })).toBeVisible();
  await expect(page.getByText(/Boutique Hotel Tycoon/)).toBeVisible();
  await expect(page.locator(".active-job-card").getByText("First Check-Ins")).toBeVisible();

  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await startPack(page, "festival", "Field Signal Festival");
  await expect(page.getByRole("heading", { name: "Field Signal Festival" })).toBeVisible();
  await expect(page.getByText(/Festival Tycoon/)).toBeVisible();
  await expect(page.locator(".active-job-card").getByText("Back Room Lineup")).toBeVisible();

  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await startPack(page, "theme-park", "Bright Loop Park");
  await expect(page.getByRole("heading", { name: "Bright Loop Park" })).toBeVisible();
  await expect(page.getByText(/Theme Park Tycoon/)).toBeVisible();
  await expect(page.locator(".active-job-card").getByText("Opening Weekend")).toBeVisible();

  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await startPack(page, "farm-market", "Maple Row Market");
  await expect(page.getByRole("heading", { name: "Maple Row Market" })).toBeVisible();
  await expect(page.getByText(/Farm Market Tycoon/)).toBeVisible();
  await expect(page.locator(".active-job-card").getByText("First Crates")).toBeVisible();

  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await startPack(page, "movie-studio", "Lantern Cut Films");
  await expect(page.getByRole("heading", { name: "Lantern Cut Films" })).toBeVisible();
  await expect(page.getByText(/Movie Studio Tycoon/)).toBeVisible();
  await expect(page.locator(".active-job-card").getByText("First Short", { exact: true })).toBeVisible();

  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await startPack(page, "aquarium", "Blue Arc Aquarium");
  await expect(page.getByRole("heading", { name: "Blue Arc Aquarium" })).toBeVisible();
  await expect(page.getByText(/Aquarium Tycoon/)).toBeVisible();
  await expect(page.locator(".active-job-card").getByText("First Habitats")).toBeVisible();
});

test("renders the shared command layout with pack-specific scene art", async ({ page }) => {
  const packs = [
    { id: "scrapyard", company: "North Star Salvage", art: "scrapyard-yard-room.png", panel: "Yard Actions" },
    { id: "coffee-shop", company: "Steam Room Cafe", art: "coffee-shop-room.png", panel: "Shop Actions" },
    { id: "space-colony", company: "Echo Ridge Colony", art: "space-colony-room.png", panel: "Colony Actions" },
    { id: "boutique-hotel", company: "Juniper Key Hotel", art: "boutique-hotel-lobby.png", panel: "Hotel Actions" },
    { id: "festival", company: "Field Signal Festival", art: "festival-gig-to-field.png", panel: "Festival Actions" },
    { id: "theme-park", company: "Bright Loop Park", art: "theme-park-gates.png", panel: "Park Actions" },
    { id: "farm-market", company: "Maple Row Market", art: "farm-market-stall.png", panel: "Market Actions" },
    { id: "movie-studio", company: "Lantern Cut Films", art: "movie-studio-set.png", panel: "Studio Actions" },
    { id: "aquarium", company: "Blue Arc Aquarium", art: "aquarium-gallery.png", panel: "Aquarium Actions" }
  ];

  for (const pack of packs) {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await startPack(page, pack.id, pack.company);
    await expect(page.locator(".scene-command-layout")).toBeVisible();
    await expect(page.locator(".world-stage-image")).toHaveAttribute("src", new RegExp(pack.art));
    await expect(page.locator("[data-action=open-panel][data-id=stations]")).toBeVisible();
    await page.locator("[data-action=open-panel][data-id=work]").click();
    await expect(page.getByText(pack.panel)).toBeVisible();
  }
});

test("keeps events separate and long drawers scrollable", async ({ page }) => {
  await page.setViewportSize({ width: 1040, height: 520 });
  await page.reload();
  await startPack(page, "game-studio", "Signal Room");

  const dockMetrics = await page.locator(".command-dock").evaluate((dock) => {
    const buttonTops = [...dock.querySelectorAll<HTMLElement>(".dock-button")].map((button) =>
      Math.round(button.getBoundingClientRect().top)
    );
    return {
      height: Math.round(dock.getBoundingClientRect().height),
      rows: new Set(buttonTops).size
    };
  });
  expect(dockMetrics.rows).toBe(1);
  expect(dockMetrics.height).toBeLessThanOrEqual(86);

  await page.locator("[data-action=open-panel][data-id=work]").click();
  await expect(page.locator(".command-drawer").getByText("Active Events")).toHaveCount(0);

  await page.evaluate(() => {
    const snapshot = window.tycoon?.getSnapshot();
    if (!snapshot || !window.tycoon) {
      throw new Error("Missing tycoon controller.");
    }
    snapshot.state.activeEvents = [
      { eventId: "depth_event_vip-request", appearedAtMs: snapshot.state.elapsedMs },
      { eventId: "depth_event_equipment-fault", appearedAtMs: snapshot.state.elapsedMs },
      { eventId: "depth_event_supply-crunch", appearedAtMs: snapshot.state.elapsedMs }
    ];
    window.tycoon.advance(1);
  });

  await page.locator("[data-action=open-panel][data-id=events]").click();
  await expect(page.locator(".command-drawer").getByRole("heading", { name: "Events" })).toBeVisible();
  await expect(page.locator(".command-drawer").getByText("Active Events")).toBeVisible();
  await expect(page.locator(".command-drawer").getByText("Event Decks")).toBeVisible();
  await expect(page.locator(".command-drawer").getByText("VIP Request")).toBeVisible();

  const eventLayout = await page.locator(".command-drawer[data-panel=events]").evaluate((drawer) => {
    const eventCards = [...drawer.querySelectorAll<HTMLElement>(".event-card")].map((card) =>
      card.getBoundingClientRect()
    );
    const deckHeader = [...drawer.querySelectorAll<HTMLElement>(".drawer-section-header")].find((header) =>
      header.textContent?.includes("Event Decks")
    );
    const choiceButtons = [...drawer.querySelectorAll<HTMLElement>(".event-card .row-action")].map((button) =>
      button.getBoundingClientRect()
    );
    return {
      activeEventCount: eventCards.length,
      activeEventsEnd: Math.max(...eventCards.map((card) => card.bottom)),
      deckHeaderTop: deckHeader?.getBoundingClientRect().top ?? 0,
      maxButtonHeight: Math.max(...choiceButtons.map((button) => button.height))
    };
  });
  expect(eventLayout.activeEventCount).toBeGreaterThanOrEqual(3);
  expect(eventLayout.activeEventsEnd).toBeLessThanOrEqual(eventLayout.deckHeaderTop);
  expect(eventLayout.maxButtonHeight).toBeLessThanOrEqual(44);

  await page.locator("[data-action=open-panel][data-id=stations]").click();
  const metrics = await page.locator(".drawer-body").evaluate((drawer) => {
    const overflowY = window.getComputedStyle(drawer).overflowY;
    drawer.scrollTop = 0;
    const before = drawer.scrollTop;
    drawer.scrollTop = drawer.scrollHeight;
    return {
      overflowY,
      scrollHeight: drawer.scrollHeight,
      clientHeight: drawer.clientHeight,
      canScroll: drawer.scrollTop > before
    };
  });
  expect(["auto", "scroll"]).toContain(metrics.overflowY);
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
  expect(metrics.canScroll).toBe(true);
});

test("greys out the game builder until image generation is integrated", async ({ page }) => {
  const builderButton = page.getByRole("button", { name: /game builder/i });
  await expect(builderButton).toBeDisabled();
  await expect(builderButton).toContainText(/coming soon/i);
  await expect(page.getByRole("heading", { name: "Build a Game Pack" })).toHaveCount(0);
});


test("lets the player found a company before the board opens", async ({ page }) => {
  await page.locator("[data-action=choose-pack][data-id=game-studio]").click();
  await expect(page.getByRole("heading", { name: "Pixel Foundry" })).toBeVisible();

  await page.getByRole("button", { name: /randomise/i }).click();
  const randomName = await page.getByLabel("Company name").inputValue();
  expect(randomName.length).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { name: randomName })).toBeVisible();

  await page.getByLabel("Company name").fill("Nova Byte");
  await expect(page).toHaveTitle("Found Nova Byte - Indie Studio Tycoon | PackForge Tycoon");
  await expect(page.getByRole("heading", { name: "Nova Byte" })).toBeVisible();
  await page.getByLabel("Founder name").fill("Riley");
  await page.locator("input[name=logoIcon][value=bolt]").check({ force: true });
  await page.locator("input[name=logoColor][value='#8b5cf6']").check({ force: true });
  await page.locator("input[name=logoShape][value=shield]").check({ force: true });
  await page.locator("input[name=logoPattern][value=grid]").check({ force: true });
  await page.locator("input[name=difficulty][value=hard]").check({ force: true });
  await page.locator("input[name=firstDepartment][value=design]").check({ force: true });
  await page.getByRole("button", { name: /start company/i }).click();

  await expect(page.getByRole("heading", { name: "Nova Byte" })).toBeVisible();
  await expect(page.getByText(/Founded by Riley/i)).toBeVisible();
  await expect(page.getByText(/Indie Studio Tycoon · hard/i)).toBeVisible();
  const hardCash = await page.evaluate(() => window.tycoon?.getSnapshot().state.cash ?? 0);
  expect(hardCash).toBeGreaterThanOrEqual(171);
  expect(hardCash).toBeLessThanOrEqual(172);

  const assigned = await page.evaluate(() => window.tycoon?.getSnapshot().state.staff.assignments.design ?? 0);
  expect(assigned).toBe(1);
  const logo = await page.evaluate(() => window.tycoon?.getSnapshot().state.profile);
  expect(logo?.logoShape).toBe("shield");
  expect(logo?.logoPattern).toBe("grid");
});

test("opens setup when choosing a pack even if that game has a save", async ({ page }) => {
  await startPack(page, "game-studio", "Saved Studio");
  await page.getByRole("button", { name: /save/i }).click();
  await page.getByRole("button", { name: /games/i }).first().click();

  await page.locator("[data-action=choose-pack][data-id=game-studio]").click();
  await expect(page.getByText(/Found your company/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pixel Foundry" })).toBeVisible();
});

test("boots into management mode, buys stations, and changes resources", async ({ page }) => {
  await startPack(page, "scrapyard", "North Star Salvage");
  await expect(page.getByRole("heading", { name: "North Star Salvage" })).toBeVisible();
  await expect(page.getByText(/Scrapyard Tycoon/)).toBeVisible();
  await expect(page.locator(".management-shell")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByText("Office")).toBeVisible();
  await expect(page.getByTestId("message")).toContainText("Run the yard");

  await page.locator("[data-action=open-panel][data-id=stations]").click();
  await page.locator("[data-action=buy-station][data-id=junk_pile]").click();
  await expect(page.getByTestId("message")).toContainText("Junk Pile added");

  await page.locator("[data-action=buy-station][data-id=sorting_table]").click();
  await page.locator("[data-action=open-panel][data-id=staff]").click();
  await expect(page.locator("[data-action=assign-worker][data-id=source]")).toBeDisabled();

  await page.evaluate(() => window.tycoon?.advance(30_000));

  await expect
    .poll(() => page.evaluate(() => window.tycoon?.getSnapshot().state.resources.sorted_metal ?? 0))
    .toBeGreaterThan(0);
  await page.locator("[data-action=open-panel][data-id=staff]").click();
  await expect(page.getByText("Payroll")).toBeVisible();
});

test("can complete a contract through the public app surface", async ({ page }) => {
  await startPack(page, "scrapyard");
  await expect(page.locator(".management-shell")).toBeVisible();
  await page.evaluate(() => {
    const controller = window.tycoon;
    if (!controller) {
      throw new Error("Missing controller");
    }
    const started = controller.dispatch({ type: "startContract", contractId: "first_sort" });
    if (!started.ok) {
      throw new Error(started.message);
    }
    const snapshot = controller.getSnapshot();
    snapshot.state.resources.sorted_metal = 8;
    const claimed = controller.dispatch({ type: "claimContract", contractId: "first_sort" });
    if (!claimed.ok) {
      throw new Error(claimed.message);
    }
  });

  await expect
    .poll(() => page.evaluate(() => window.tycoon?.getSnapshot().state.cash ?? 0))
    .toBeGreaterThanOrEqual(309);
  await expect
    .poll(() => page.evaluate(() => window.tycoon?.getSnapshot().state.unlockedIds.includes("crusher") ?? false))
    .toBe(true);
});

test("lets the player run active studio actions", async ({ page }) => {
  await startPack(page, "game-studio");
  await page.locator("[data-action=open-panel][data-id=work]").click();
  await expect(page.getByText("Studio Actions")).toBeVisible();

  const before = await page.evaluate(() => window.tycoon?.getSnapshot().state.resources.ideas ?? 0);
  await page.locator("[data-action=run-action][data-id=brainstorm_jam]").click();

  await expect
    .poll(() => page.evaluate(() => window.tycoon?.getSnapshot().state.resources.ideas ?? 0))
    .toBeGreaterThan(before);
  await expect(page.locator("[data-action=run-action][data-id=brainstorm_jam]")).toBeDisabled();
});

test("keeps command board actions above the footer hit area", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop footer collision regression");

  await startPack(page, "game-studio");
  await page.locator("[data-action=open-panel][data-id=stations]").click();
  await page.locator("[data-action=buy-station][data-id=garage_desk]").click();

  const hitAction = await page.locator("[data-action=buy-station][data-id=design_corner]").evaluate((button) => {
    const rect = button.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return hit?.closest<HTMLElement>("[data-action]")?.dataset.action ?? hit?.tagName ?? null;
  });

  expect(hitAction).toBe("buy-station");
  await page.locator("[data-action=buy-station][data-id=design_corner]").click();
  await expect(page.getByTestId("message")).toContainText("Design Corner added");
});

test("does not replace hovered action buttons during simulation ticks", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop hover stability regression");

  await startPack(page, "game-studio");
  await page.locator("[data-action=open-panel][data-id=stations]").click();
  await page.locator("[data-action=buy-station][data-id=garage_desk]").click();

  const action = page.locator("[data-action=buy-station][data-id=design_corner]");
  const handle = await action.elementHandle();
  const box = await action.boundingBox();
  if (!handle || !box) {
    throw new Error("Missing action button for hover stability check.");
  }

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(750);

  await expect
    .poll(() =>
      handle.evaluate(
        (button) =>
          button.isConnected &&
          button === document.querySelector("[data-action=buy-station][data-id=design_corner]")
      )
    )
    .toBe(true);

  await action.click();
  await expect(page.getByTestId("message")).toContainText("Design Corner added");
});

test("keeps the mobile HUD usable and saves across reload", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile project only");

  await startPack(page, "scrapyard", "Pocket Yard");
  await expect(page.getByRole("heading", { name: "Pocket Yard" })).toBeVisible();
  await page.getByRole("button", { name: /save/i }).click();
  await page.reload();
  await page.locator("[data-action=open-panel][data-id=stations]").click();
  await expect(page.getByText("Sorting Table")).toBeVisible();
  await expect(page.locator(".management-shell")).toBeVisible();
});
