const paths: Record<string, string> = {
  art: `<path d="M6 18.5c4.8 0 11.2-4.1 11.2-9.4a4.6 4.6 0 0 0-4.6-4.6C7.3 4.5 3 8.8 3 14.1c0 2.7 1.4 4.4 3 4.4Z"/><path d="M7.2 10.2h.1M10.2 7.8h.1M13.6 8.6h.1M9.3 13.4h.1"/><path d="M14.8 15.2 20 20.4"/>`,
  audio: `<path d="M4 14h3l5 4V6L7 10H4v4Z"/><path d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10"/>`,
  bolt: `<path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/>`,
  brush: `<path d="M14 4.5 19.5 10 10 19.5H4.5V14L14 4.5Z"/><path d="m12 6.5 5.5 5.5"/><path d="M4.5 14 10 19.5"/>`,
  cash: `<path d="M4 7h16v10H4V7Z"/><path d="M8 7c0 1.1-.9 2-2 2M18 9c-1.1 0-2-.9-2-2M6 15c1.1 0 2 .9 2 2M16 17c0-1.1.9-2 2-2"/><path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>`,
  check: `<path d="m4.5 12.5 4.5 4.5L19.5 6.5"/>`,
  circuit: `<path d="M8 8h8v8H8V8Z"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/>`,
  clipboard: `<path d="M8 4h8v4H8V4Z"/><path d="M6 6H5v15h14V6h-1"/><path d="M8 12h8M8 16h5"/>`,
  code: `<path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/>`,
  coin: `<path d="M12 6c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Z"/><path d="M4 9v6c0 1.7 3.6 3 8 3s8-1.3 8-3V9"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>`,
  coffee: `<path d="M5 8h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M4 21h14"/><path d="M8 3v2M12 3v2M16 3v2"/>`,
  contract: `<path d="M6 3h9l3 3v15H6V3Z"/><path d="M15 3v4h4"/><path d="M9 11h6M9 15h6M9 19h3"/>`,
  crusher: `<path d="M4 8h16v5H4V8Z"/><path d="M7 13v5h10v-5"/><path d="M8 5h8M9 18l-2 3M15 18l2 3"/><path d="M8 10h.1M12 10h.1M16 10h.1"/>`,
  design: `<path d="M4 19h16"/><path d="M7 16 17.5 5.5a2.1 2.1 0 0 1 3 3L10 19H7v-3Z"/><path d="m15.5 7.5 3 3"/>`,
  download: `<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>`,
  fans: `<path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M3 20a5 5 0 0 1 10 0M11 20a5 5 0 0 1 10 0"/>`,
  flame: `<path d="M12 22c4 0 7-2.7 7-6.5 0-2.6-1.6-4.5-3.6-6.5-.6 2-1.7 3.2-3.1 3.7.4-3.6-1.2-6.4-4.3-8.7.2 4.4-3 6.1-3 10.9C5 19.1 8 22 12 22Z"/>`,
  gamepad: `<path d="M7 9h10a5 5 0 0 1 4.8 6.4l-.5 1.8a2.3 2.3 0 0 1-3.8 1l-2.2-2.2H8.7l-2.2 2.2a2.3 2.3 0 0 1-3.8-1l-.5-1.8A5 5 0 0 1 7 9Z"/><path d="M8 12v4M6 14h4M16.5 13.5h.1M18.5 15.5h.1"/>`,
  gear: `<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>`,
  ideas: `<path d="M9 18h6M10 22h4"/><path d="M8 14.6A6 6 0 1 1 16 14.6c-.9.7-1 1.7-1 3.4h-6c0-1.7-.1-2.7-1-3.4Z"/>`,
  ingot: `<path d="M6 9h12l3 7H3l3-7Z"/><path d="M7.5 9 10 4h4l2.5 5"/>`,
  megaphone: `<path d="M4 13h3l10 4V7L7 11H4v2Z"/><path d="M7 13v5h3l1-3"/><path d="M19 10a3 3 0 0 1 0 4"/>`,
  package: `<path d="M4 8.5 12 4l8 4.5v9L12 22l-8-4.5v-9Z"/><path d="M4 8.5 12 13l8-4.5M12 13v9M8 6.3l8 4.5"/>`,
  plates: `<path d="M5 7h14v4H5V7Z"/><path d="M3 13h18v4H3v-4Z"/><path d="M7 17h10v3H7v-3Z"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  reputation: `<path d="m12 3 2.7 5.4 6 .9-4.4 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6-4.4-4.2 6-.9L12 3Z"/>`,
  reset: `<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/>`,
  rocket: `<path d="M12 2c4 2.2 6 5.7 6 10.4L14 16h-4l-4-3.6C6 7.7 8 4.2 12 2Z"/><path d="M9 16 7 21l5-3 5 3-2-5"/><path d="M12 8.5h.1"/><path d="M6 12H3l3 4M18 12h3l-3 4"/>`,
  save: `<path d="M5 3h12l2 2v16H5V3Z"/><path d="M8 3v6h8V3"/><path d="M8 21v-7h8v7"/>`,
  scrap: `<path d="M5 16 9 5h7l3 8-4 6H8l-3-3Z"/><path d="M9 5 12 16M16 5l-4 11M7 12h10"/>`,
  station: `<path d="M4 20h16"/><path d="M6 20V8l6-4 6 4v12"/><path d="M9 20v-6h6v6"/><path d="M9 10h6"/>`,
  tools: `<path d="m14 6 4-4 4 4-4 4-4-4Z"/><path d="M2 22 13 11"/><path d="m5 2 4 4M7 4 4 7"/>`,
  upgrade: `<path d="M12 20V5"/><path d="m6 11 6-6 6 6"/><path d="M5 20h14"/>`,
  upload: `<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 5h14"/>`,
  wire: `<path d="M4 12c3-6 7 6 10 0s5 2 6 4"/><path d="M4 16c3-6 7 6 10 0s5 2 6 4"/>`,
  workers: `<path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M17 11a3 3 0 0 0 0-6"/><path d="M17 14a5 5 0 0 1 5 5"/>`
};

export const icon = (name = "station", className = "ui-icon") => {
  const path = paths[name] ?? paths.station;
  return `<svg class="${className}" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
};

export const resourceIconId = (resourceId: string) =>
  ({
    art: "art",
    audio: "audio",
    builds: "package",
    circuits: "circuit",
    code: "code",
    copper_wire: "wire",
    alloys: "ingot",
    beans: "coffee",
    buzz: "megaphone",
    components: "tools",
    crops: "station",
    crushed_metal: "crusher",
    design: "design",
    fans: "fans",
    frames: "station",
    gears: "gear",
    hype: "megaphone",
    ideas: "ideas",
    ice: "crusher",
    ingots: "ingot",
    loyalty: "reputation",
    milk: "package",
    morale: "workers",
    motors: "bolt",
    ore: "scrap",
    oxygen: "fans",
    plates: "plates",
    plastic_bits: "package",
    power: "bolt",
    regolith: "scrap",
    reputation: "reputation",
    revenue: "coin",
    research: "ideas",
    roasted_beans: "flame",
    scrap: "scrap",
    sorted_metal: "ingot",
    water: "package",
    widgets: "tools"
  })[resourceId] ?? "station";

export const categoryIconId = (category: string) =>
  ({
    art: "art",
    assembly: "tools",
    audio: "audio",
    bakery: "package",
    bar: "coffee",
    creative: "ideas",
    design: "design",
    electronics: "circuit",
    engineering: "code",
    extraction: "crusher",
    fabrication: "tools",
    forming: "plates",
    habitat: "station",
    heat: "flame",
    heavy: "crusher",
    industry: "flame",
    life_support: "fans",
    marketing: "megaphone",
    power: "bolt",
    prep: "gear",
    production: "package",
    publishing: "reputation",
    roasting: "flame",
    science: "ideas",
    service: "workers",
    sorting: "scrap",
    source: "scrap",
    supply: "package",
    support: "workers"
  })[category] ?? "station";

export const packIllustration = (name = "studio") => {
  if (name === "coffee") {
    return `
      <svg class="pack-graphic" aria-hidden="true" viewBox="0 0 240 150" fill="none">
        <path class="graphic-base" d="M26 118h188l-18 17H44l-18-17Z"/>
        <rect class="graphic-soft" x="48" y="54" width="102" height="56" rx="12"/>
        <path class="graphic-ink" d="M71 64h57v34H71V64Z"/>
        <path class="graphic-accent" d="M145 70h22a20 20 0 0 1 0 40h-22V70Z"/>
        <path class="graphic-line" d="M82 78h32M82 90h20M154 82h13a8 8 0 0 1 0 16h-13"/>
        <path class="graphic-accent" d="M75 33c0-9 12-9 12 0s-12 9-12 18M102 28c0-9 12-9 12 0s-12 9-12 18M129 34c0-9 12-9 12 0s-12 9-12 18"/>
        <circle class="graphic-accent" cx="189" cy="52" r="11"/>
        <path class="graphic-line" d="M184 52h10M189 47v10"/>
      </svg>
    `;
  }

  if (name === "colony") {
    return `
      <svg class="pack-graphic" aria-hidden="true" viewBox="0 0 240 150" fill="none">
        <path class="graphic-base" d="M20 120h200l-22 15H42l-22-15Z"/>
        <path class="graphic-soft" d="M58 111a44 44 0 0 1 88 0H58Z"/>
        <path class="graphic-ink" d="M76 111a26 26 0 0 1 52 0H76Z"/>
        <path class="graphic-accent" d="M153 61h44v50h-44V61Z"/>
        <path class="graphic-line" d="M82 92h40M102 70v38M162 74h26M162 88h26M162 102h26"/>
        <path class="graphic-accent" d="M55 36 68 15l13 21-13 9-13-9Z"/>
        <path class="graphic-line" d="M68 45v28M55 73h26"/>
        <circle class="graphic-accent" cx="192" cy="34" r="8"/>
      </svg>
    `;
  }

  if (name === "scrapyard") {
    return `
      <svg class="pack-graphic" aria-hidden="true" viewBox="0 0 240 150" fill="none">
        <path class="graphic-base" d="M21 118h198l-22 17H43l-22-17Z"/>
        <path class="graphic-soft" d="M61 68h70l18 50H42l19-50Z"/>
        <path class="graphic-accent" d="M149 53h42v65h-42V53Z"/>
        <path class="graphic-ink" d="M63 68h66l17 50H44l19-50Z"/>
        <path class="graphic-line" d="M73 80h39M68 93h52M62 106h63"/>
        <path class="graphic-line" d="M158 66h24M158 81h24M158 96h24"/>
        <circle class="graphic-accent" cx="188" cy="44" r="10"/>
        <path class="graphic-line" d="M188 23v12M188 53v12M167 44h12M197 44h12"/>
      </svg>
    `;
  }

  return `
    <svg class="pack-graphic" aria-hidden="true" viewBox="0 0 240 150" fill="none">
      <path class="graphic-base" d="M24 118h192l-18 17H42l-18-17Z"/>
      <rect class="graphic-soft" x="57" y="37" width="92" height="66" rx="10"/>
      <rect class="graphic-ink" x="69" y="49" width="68" height="42" rx="6"/>
      <path class="graphic-accent" d="M95 112h16l4 17H91l4-17Z"/>
      <path class="graphic-line" d="M82 64h18M82 76h31M164 59h33M164 74h25M164 89h37"/>
      <circle class="graphic-accent" cx="193" cy="39" r="11"/>
      <path class="graphic-line" d="m186 39 5 5 9-10"/>
    </svg>
  `;
};
